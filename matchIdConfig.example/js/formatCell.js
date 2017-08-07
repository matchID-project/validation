import moment from 'moment'
import {diffChars} from 'diff'
import {coloredDiff, brDiff} from '../../src/assets/js/formatCell'

export default {coloredDiff, brDiff, formatSex, formatDiff, formatDistance, formatRank, formatDate}

function formatSex (doubleArray) {
  return coloredDiff(doubleArray.map(sexConvertor))
}

function sexConvertor (value) {
  if (value === '1') return 'H'

  return 'F'
}

function formatDistance (value) {
  if (typeof value === 'undefined' || Number(value) === 0 || value === 'NaN') {
    return ''
  }

  if (value < 10) {
    return value + ' km'
  }

  return Math.round(value) + ' km'
}

function formatRank (value) {
  return Number(value) === 1 ? '' : '<span class="icon"><i class="fa fa-exclamation-triangle has-text-danger"></i></span>'
}

function formatDate (doubleArray) {
  return coloredDiff(doubleArray.map((i) => moment(i, 'YYYY-MM-DD').format('DD/MM/YYYY')))
}
