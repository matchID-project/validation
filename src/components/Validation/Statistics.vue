<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('close')"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <i class="fa fa-bar-chart-o mID-margin-right-8" aria-hidden="true"></i> {{ localization.navbar.statistics[lang] }}
            </div>
            <div class="card-header-icon">
              <button class="delete" @click="$emit('close')"></button>
            </div>
          </div>
          <div class="card-content">
            <stats-chart
              :chartData="dataFormattedForChartJs(statisticsRendered)"
              :options="optionsForChartJs()"
            ></stats-chart>
          </div>
          <div class="card-footer has-text-centered">
            <div class="card-footer-item">{{statisticsRendered.total ? statisticsRendered.total.toLocaleString() : 0}}<br/>total</div>
            <div class="card-footer-item">{{statisticsRendered.done_count ? statisticsRendered.done_count.reduce((a, b) => a + b, 0).toLocaleString() : 0}}<br/>done</div>
          </div>
        </div>
      </div>
    <button class="modal-close is-large" @click="$emit('close')"></button>
  </div>
</template>

<script>
import localization from '../../assets/json/lang.json'

import statsChart from '../../assets/js/charts'

export default {
  components: {
    statsChart
  },
  props: {
    dataResults: {
      required: true,
      type: Object
    },
    scores: {
      required: true,
      type: Object
    },
    validationIndecisionDisplay: {
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
      localization: localization,
      lang: localization.default
    }
  },
  computed: {
    statisticsRendered () {
      let data = {}
      let choice = ['decision']
      let pick = ['false', 'true']

      if (Object.keys(this.dataResults).length > 0) {
        data.total = this.dataResults.hits.total
        data.intervals = []
        data.intervals_count = []
        data.done_count = []
        for (let i = 0; i < choice.length; i++) {
          data[choice[i]] = {}
          for (let j = 0; j < pick.length; j++) {
            data[choice[i]][pick[j]] = []
          }
        }

        for (var interval = 0; interval < this.scores.range[1]; interval = interval + this.scores.statisticsInterval) {
          let nextInterval = interval + this.scores.statisticsInterval
          let find = this.dataResults.aggregations.scores.buckets[this.dataResults.aggregations.scores.buckets.findIndex(x => x.key === interval)]
          data.intervals.push(interval + '-' + nextInterval)
          if (!find) {
            data.intervals_count.push(0)
            data.done_count.push(0)

            for (let i = 0; i < choice.length; i++) {
              for (let j = 0; j < pick.length; j++) {
                data[choice[i]][pick[j]].push(0)
              }
            }
          } else {
            data.intervals_count.push(find.doc_count)
            data.done_count.push(!find.done ? 0 : find.done.doc_count)

            for (let i = 0; i < choice.length; i++) {
              for (let j = 0; j < pick.length; j++) {
                let val = find[choice[i]].buckets[find[choice[i]].buckets.findIndex(x => x.key === pick[j])]
                data[choice[i]][pick[j]].push(val === void 0 ? 0 : val.doc_count)
              }
            }
          }
        }
      }

      return data
    }
  },
  methods: {
    dataFormattedForChartJs (statistics) {
      if (Object.keys(this.dataResults).length === 0) return {}

      let datasets = [
        {
          label: 'Total',
          backgroundColor: '#f87979',
          data: statistics.intervals_count,
          fill: false,
          yAxisID: 'y-total'
        },
        {
          label: 'Done',
          backgroundColor: '#79abff',
          data: statistics.done_count,
          fill: false,
          yAxisID: 'y-done'
        },
        {
          label: 'Decision True',
          backgroundColor: '#d17e64',
          data: statistics.decision.true,
          fill: false,
          yAxisID: 'y-done'
        },
        {
          label: 'Decision False',
          backgroundColor: '#b2d164',
          data: statistics.decision.false,
          fill: false,
          yAxisID: 'y-done'
        }
      ]

      return {
        labels: statistics.intervals,
        datasets: datasets
      }
    },
    optionsForChartJs () {
      return {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        scales: {
          yAxes: [
            {
              type: 'linear',
              display: true,
              position: 'right',
              id: 'y-total'
            },
            {
              type: 'linear',
              display: true,
              position: 'left',
              id: 'y-done',
              gridLines: {
                drawOnChartArea: false // only want the grid lines for one axis to show up
              }
            }
          ]
        }
      }
    }
  },
  mounted () {
    let self = this
    window.bus.$on('langChange', function (value) {
      self.lang = value
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
