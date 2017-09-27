<template>
  <div id="validationWrapper">

    <div id="controller" v-show="!error.display">
      <div class="box">
        <div class="columns">

          <div class="column" :class="actionsConfig.display && scoresDisplay ? 'is-4' : !actionsConfig.display && !scoresDisplay ? 'is-6' : 'is-4'">
            <div class="field has-addons">
              <p class="control">
                <span class="select">
                  <select v-model='selectedSearchField'>
                    <option :value="'random'">Random</option>
                    <option
                      v-for="column in columnsConfig"
                      :value="Array.isArray(column.field) ? column.field.join() : column.field"
                      v-show="column.searchable"
                    >
                      {{column.label}}
                    </option>
                  </select>
                </span>
              </p>
              <p class="control has-icons-left">
                <input
                  class="input"
                  type="text"
                  v-model.trim="searchString"
                  :disabled="selectedSearchField === 'random'"
                >
                <span class="icon is-left">
                  <i class="fa fa-search"></i>
                </span>
              </p>
              <p class="control">
                <a
                  class="button"
                  @click="refreshData"
                >
                  <i class="fa fa-refresh" aria-hidden="true"></i>
                </a>
              </p>
            </div>
          </div>

          <div class="column" :class="actionsConfig.display ? 'is-3' : 'is-4'" v-show="scoresDisplay">
              <div class="columns is-gapless">
                <div class="column is-2">
                  <div class="field">
                    <input class="input has-text-centered" type="text" name="min" v-model.number.lazy="valuesRangeSlider[0]">
                  </div>
                </div>
                <div class="column is-8" id="sliderWrapper">
                  <range-slider
                    :config="scoreConfig"
                    :values="valuesRangeSlider"
                    :color="'has-background-turquoise'"
                    @updateRangeSlider="updateValuesRangeSlider"
                  ></range-slider>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <input class="input has-text-centered" type="text" name="max" v-model.number.lazy="valuesRangeSlider[1]">
                  </div>
                </div>
              </div>
          </div>

          <div class="column" :class="actionsConfig.display && scoresDisplay ? 'is-2' : !actionsConfig.display && !scoresDisplay ? 'is-6' : 'is-4'">
            <div class="field">
              <form id="search">
                <p class="control has-icons-left is-expanded">
                  <input
                    class="input"
                    type="text"
                    :placeholder="localization.validation.filter[lang]"
                    name="query"
                    v-model="searchQuery"
                  >
                  <span class="icon is-left">
                    <i class="fa fa-filter"></i>
                  </span>
                </p>
              </form>
            </div>
          </div>

          <div class="column" v-show="actionsConfig.display" :class="scoresDisplay ? 'is-3' : 'is-4'">
            <div class="field">
              <p class="control">
                <label class="checkbox mID-checkbox">
                  <input
                    type="checkbox"
                    class="mID-margin-right-8"
                    v-model="onlyUndone"
                    @change="refreshData"
                  >
                  <span class="is-size-7">
                    {{ localization.validation.displayUndoneOnly[lang] }}
                  </span>
                </label>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div id="table-wrapper">
      <div id="content">
        <match-id-message
          v-show="error.display"
          :type="error.type"
        >
          <span slot="header">
            <b>{{ localization.validation.mistake[lang] }}</b>
          </span>
          <slot>
            {{error.message}}
          </slot>
        </match-id-message>

        <template v-if="loading">
          <div id="loading-spinner" class="has-text-centered">
            <span class="icon is-large">
              <i class="fa fa-spinner fa-pulse"></i>
            </span>
          </div>
        </template>
        <div v-else class="stickTable">
          <table class='table is-narrow is-bordered'>
            <table-header
              ref="tableHeaderRef"
              :columns="columnsConfig"
              :scrollContainer="'#table-wrapper'"
              :validationConf="actionsConfig"
              :viewConf="viewConfig"
            />

            <tbody
              :class="{'activeShortcuts' : shortcutsActivation}"
            >
              <tr
                v-for="(entry, index) in filteredData"
                :key="index"
                :tr-line="'tr-' + index"
                :class="[
                  {'operation-fade' : entry.validation},
                  {'operation-success' : entry.validation === 'success'},
                  {'operation-fail' : entry.validation === 'fail'},
                  index === activeRow ? 'border-selected' : 'fade-unselected'
                ]"
              >
                <td class="has-text-centered" v-show="viewConfig.display">
                  <a class="button is-small is-outlined" @click="getElasticsearchResponse(entry)">
                    <span class="icon">
                      <i class="fa fa-eye"></i>
                    </span>
                  </a>
                </td>
                <td
                  v-for="column in columnsConfig"
                  :key="Array.isArray(column.field) ? column.field.join() : column.field"
                  v-show="column.display"
                  :class="column.appliedClass ? column.appliedClass.body : ''"
                >
                  <span v-if="column.type === 'score'">
                    <progress-bar
                      :size="'small'"
                      :value="formattedField(entry[column.field], column.callBack)"
                      :max="scoreConfig.range.max"
                      :show-label="true"
                    ></progress-bar>
                  </span>
                  <span
                    v-else
                    v-html="formattedField(Array.isArray(column.field) ? column.field.map((i) => entry[i]) : entry[column.field] , column.callBack)"
                  ></span>
                </td>

                <td v-show="actionsConfig.display">
                  <div class="field has-text-centered" :class="{'is-grouped' : indecisionDisplay}">
                    <p class="has-text-centered mID-nowrap" :class="{'mID-margin-right-8' : indecisionDisplay}">
                      <label class="checkbox">
                        <toggle-button
                          v-model="entry.validation_decision"
                          :value="entry.validation_decision"
                          :color="{checked: '#00d1b2', unchecked: '#ff3860'}"
                          :sync="true"
                          :labels="{checked: 'I', unchecked: 'O'}"
                          @change="updateData(entry, 'decision')"
                        />
                      </label>
                    </p>
                    <p class="has-text-centered mID-nowrap" v-show="indecisionDisplay">
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          v-model="entry.validation_indecision"
                          :checked="entry.validation_indecision"
                          :sync="true"
                          @change="updateData(entry, 'indecision')"
                        />
                          <i class="fa fa-question" :class="entry.validation_indecision ? 'has-text-black' : 'has-text-grey-lighter'" aria-hidden="true"></i>
                      </label>
                    </p>
                  </div>
                </td>

                <td v-show="actionsConfig.display">
                  <div class="field has-text-centered">
                    <p class="has-text-centered mID-nowrap">
                      <label class="checkbox">
                        <toggle-button
                          v-model="entry.validation_done"
                          :value="entry.validation_done"
                          color="#363636"
                          :labels="{checked: '<span class=\'icon is-small\'><i class=\'fa fa-small fa-check\'></i></span>', unchecked: ''}"
                          :sync="true"
                          @change="updateData(entry, 'done')"
                        />
                      </label>
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <div id="modal-wrapper">
      <elasticsearch-response
        v-show="elasticsearchResponseShow"
        :data="elasticsearchResponseData"
        @close="elasticsearchResponseShow = false"
      ></elasticsearch-response>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'

import matchIdMessage from './Message'
import ProgressBar from './ProgressBar'
import ScrollManager from './FixedHeader/ScrollManager'
import TableHeader from './FixedHeader/TableHeader'
import RangeSlider from './RangeSlider'
import ElasticsearchResponse from './ElasticsearchResponse'

import localization from '../assets/json/lang.json'

import es from '../assets/js/es'
import formatCell from '../../matchIdConfig/js/formatCell'

import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

export default {
  components: {
    matchIdMessage,
    ProgressBar,
    TableHeader,
    RangeSlider,
    ElasticsearchResponse
  },
  props: {
    columns: {
      required: true,
      type: Array
    },
    scores: {
      required: true,
      type: Object
    },
    view: {
      required: true,
      type: Object
    },
    actions: {
      required: true,
      type: Object
    },
    elasticsearch: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      localization: localization,
      lang: localization.default,
      columnsConfig: this.columns,
      scoresConfig: this.scores,
      viewConfig: this.view,
      actionsConfig: this.actions,
      elasticsearchConfig: this.elasticsearch,
      dataTable: [],
      searchString: '',
      selectedSearchField: 'random',
      elasticsearchResponseShow: false,
      elasticsearchResponseData: {},
      loading: false,
      activeRow: 0,
      screenHeightMiddle: 0,
      shortcutsActivation: false,
      searchQuery: '',
      onlyUndone: false,
      scoreConfig: {
        connect: [ false, true, false ],
        step: (this.scoresConfig.range[1] - this.scoresConfig.range[0]) / 100,
        range: {
          min: this.scoresConfig.range[0],
          max: this.scoresConfig.range[1]
        }
      },
      indecisionDisplay: this.actionsConfig.action.indecision_display,
      scoresDisplay: !!this.scoresConfig.column,
      valuesRangeSlider: this.scoresConfig.range,
      error: {
        display: false,
        message: '',
        type: ''
      }
    }
  },
  created () {
    console.log('COOOOOOOOL')
  },
  mounted () {
    const scrollManagerCallbacks = {}
    Object.assign(scrollManagerCallbacks, {
      reachedStart: () => this.$refs.tableHeaderRef.release(),
      inside: () => this.$refs.tableHeaderRef.stick()
    })
    this.scrollManager = new ScrollManager(scrollManagerCallbacks)

    this.refreshData()

    const scrollContainerEl = document.querySelector('#table-wrapper')
    scrollContainerEl.className += ' stickTable-container'

    this.scrollManager.init(scrollContainerEl)

    this.initShortcuts()

    let self = this
    window.bus.$on('langChange', function (value) {
      self.lang = value
    })
  },
  destroyed () {
    this.scrollManager.destroy()
  },
  computed: {
    filteredData () {
      var searchQuery = this.searchQuery && this.searchQuery.toLowerCase()
      var data = this.dataTable

      if (searchQuery) {
        data = data.filter((row) => {
          return Object.keys(row).some((key) => {
            return String(row[key]).toLowerCase().indexOf(searchQuery) > -1
          })
        })
      }

      if (this.valuesRangeSlider[0] !== 0 || this.valuesRangeSlider[1] !== 100) {
        data = data.filter((row) => {
          return row.confiance >= this.valuesRangeSlider[0] && row.confiance <= this.valuesRangeSlider[1]
        })
      }

      return data
    }
  },
  methods: {
    getElasticsearchResponse (entry) {
      this.elasticsearchResponseShow = true

      this.elasticsearchResponseData = entry
    },
    initShortcuts () {
      let self = this
      self.screenHeightMiddle = window.screen.availHeight / 3

      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.altKey) {
          self.shortcutsActivation = !self.shortcutsActivation
        }

        if (self.shortcutsActivation) {
          if (event.keyCode === 40) { // down arrow
            this.moveDown()
            this.elasticsearchResponseShow = false
          } else if (event.keyCode === 38) { // up arrow
            this.moveUp()
            this.elasticsearchResponseShow = false
          }
          if (this.actionsConfig.display) {
            if (event.keyCode === 32) { // spacebar
              self.filteredData[self.activeRow].validation_done = true
              this.updateData(self.filteredData[self.activeRow], 'done')
              this.moveDown()
              this.elasticsearchResponseShow = false
            }

            if (event.keyCode === 65) { // change decision
              self.filteredData[self.activeRow].validation_decision = !self.filteredData[self.activeRow].validation_decision
            }

            if (event.keyCode === 69 && self.indecisionDisplay) { // change indecision
              self.filteredData[self.activeRow].validation_indecision = !self.filteredData[self.activeRow].validation_indecision
            }

            if (event.keyCode === 73) { // reload with random data
              let statusShortcutBefore = this.shortcutsActivation
              this.selectedSearchField = 'random'
              this.refreshData()
              this.elasticsearchResponseShow = false
              this.shortcutsActivation = statusShortcutBefore
            }

            if (event.keyCode === 68) { // json view
              if (this.elasticsearchResponseShow) {
                this.elasticsearchResponseShow = false
              } else {
                this.getElasticsearchResponse(self.filteredData[self.activeRow])
              }
            }
          }

          event.preventDefault()
        }
      }, false)
    },
    resetShortcutsMode () {
      this.shortcutsActivation = false
      this.activeRow = 0
    },
    moveDown () {
      this.activeRow < (this.elasticsearchConfig.size - 1) ? this.activeRow += 1 : null
      let downOffsetTop = document.querySelector("[tr-line='tr-" + this.activeRow + "']").offsetTop
      document.getElementById('table-wrapper').scrollTop = (downOffsetTop - this.screenHeightMiddle)
    },
    moveUp () {
      this.activeRow > 0 ? this.activeRow -= 1 : null
      let upOffsetTop = document.querySelector("[tr-line='tr-" + this.activeRow + "']").offsetTop
      document.getElementById('table-wrapper').scrollTop = (upOffsetTop - this.screenHeightMiddle)
    },
    formattedField (value, callback) {
      if (callback) {
        return formatCell[callback](value)
      }
      return value
    },
    refreshData () {
      this.dataTable = []
      this.valuesRangeSlider = this.scoresConfig.range
      this.searchQuery = ''
      this.getData().then(() => {
        this.$refs.tableHeaderRef.justify()
      })
    },
    getData () {
      let self = this
      this.resetShortcutsMode()
      self.loading = true
      return es.search(self.searchString, self.selectedSearchField).then(function (response) {
        response.hits.hits.forEach(function (element) {
          if (self.onlyUndone || !element._source.validation_done) {
            if (self.actionsConfig.display) {
              if (self.scoresDisplay) {
                element._source.validation_decision = !element._source.validation_decision ? element._source[self.scoresConfig.column] > self.scoresConfig.preComputed.decision : element._source.validation_decision

                element._source.validation_done = !element._source.validation_done ? false : element._source.validation_done

                if (self.indecisionDisplay) {
                  element._source.validation_indecision = !element._source.validation_indecision ? Array.isArray(self.scoresConfig.preComputed.indecision) && element._source[self.scoresConfig.column] <= self.scoresConfig.preComputed.indecision[1] && element._source[self.scoresConfig.column] >= self.scoresConfig.preComputed.indecision[0] : element._source.validation_indecision
                }
              } else {
                element._source.validation_decision = !element._source.validation_decision ? false : element._source.validation_decision

                element._source.validation_done = !element._source.validation_done ? false : element._source.validation_done

                if (self.indecisionDisplay) {
                  element._source.validation_indecision = !element._source.validation_indecision ? false : element._source.validation_indecision
                }
              }

              element._source.validation = false
            }
            self.dataTable.push(Object.assign(element._source, {_id: element._id}))
          }
        })
        self.loading = false
        window.bus.$emit('errorConnection', false)
      }, function (error) {
        self.error.display = true
        self.error.message = error
        self.error.type = 'danger'
        window.bus.$emit('errorConnection', true)
      })
    },
    updateData (entry, type) {
      if (type === 'done') {
        if (entry.validation_done) {
          es.updateDone(entry, this.indecisionDisplay).then(function (response) {
            entry.validation = 'success'
          }, function (error) {
            console.log(error)
            entry.validation = 'fail'
            entry.validation_done = false
          })
        } else {
          es.updateCancel(entry).then(function (response) {
            entry.validation = 'success'
          }, function (error) {
            console.log(error)
            entry.validation = 'fail'
            entry.validation_done = true
          })
        }
      } else {
        es.updateDone(entry, this.indecisionDisplay).then(function (response) {
          entry.validation = 'success'
          entry.validation_done = true
        }, function (error) {
          console.log(error)
          entry.validation = 'fail'
          type === 'no-propagation-to-done' ? null : entry.validation_done = false
        })
      }

      setTimeout(function () {
        entry.validation = null
      }, 2000)
    },
    updateValuesRangeSlider (valueRange) {
      this.valuesRangeSlider = valueRange.map((v) => {
        return Number.parseInt(v)
      })
    }
  }
}
</script>
