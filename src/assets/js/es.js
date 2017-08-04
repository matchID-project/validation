import elasticsearch from 'elasticsearch'
import esConf from '../../../matchIdConfig/json/elasticsearch.json'
import scoresConf from '../../../matchIdConfig/json/scores.json'

export default {search, updateDone, updateCancel, getStatistics, size}

let index = esConf[process.env.NODE_ENV].index
let type = esConf[process.env.NODE_ENV].type

let client = new elasticsearch.Client(
  esConf[process.env.NODE_ENV].connection
)

let size = esConf[process.env.NODE_ENV].size

function search (query, fields) {
  if (fields.includes(',')) {
    return client.search({
      index: index,
      size: size,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: fields.split(',')
          }
        }
      }
    })
  }

  return client.search({
    index: index,
    size: size,
    q: fields + ':' + query
  })
}

function updateDone (entry) {
  let script =
    'ctx._source.validation_decision = ' + entry.validation_decision + ';' +
    'ctx._source.validation_indecision = ' + entry.validation_indecision + ';' +
    'ctx._source.validation_done = ' + Date.now() + 'L;'

  return updateDocument(entry['_id'], script)
}

function updateCancel (entry) {
  let script = 'ctx._source.remove(\'validation_decision\'); ctx._source.remove(\'validation_indecision\'); ctx._source.remove(\'validation_done\');'

  return updateDocument(entry['_id'], script)
}

function updateDocument (id, script) {
  return client.update({
    index: index,
    type: type,
    id: id,
    body: {
      'script': script
    }
  })
}

function getStatistics () {
  return client.search({
    index: index,
    size: 0,
    body: {
      'aggs': {
        'scores': {
          'histogram': {
            'field': 'confiance',
            'interval': scoresConf.statisticsInterval
          },
          'aggs': {
            'decision': {
              'terms': {
                'field': 'validation_decision'
              }
            },
            'indecision': {
              'terms': {
                'field': 'validation_indecision'
              }
            },
            'done': {
              'filter': {
                'exists': {
                  'field': 'validation_done'
                }
              }
            }
          }
        }
      }
    }
  })
}
