<template>
  <div id="validationWrapper">

    <div id="controller" v-show="!error.display">
      <div class="box">
        <div class="columns">

          <div class="column" :class="validationConf.display ? 'is-4' : 'is-4'">
            <div class="field has-addons">
              <p class="control">
                <span class="select">
                  <select v-model='selectedSearchField'>
                    <option
                      v-for="column in columns"
                      :value="Array.isArray(column.field) ? column.field.join() : column.field"
                      v-if="column.searchable"
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
                >
                <span class="icon is-small is-left">
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

          <div class="column" :class="validationConf.display ? 'is-3' : 'is-4'">
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

          <div class="column" :class="validationConf.display ? 'is-2' : 'is-4'">
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
                  <span class="icon is-small is-left">
                    <i class="fa fa-filter"></i>
                  </span>
                </p>
              </form>
            </div>
          </div>

          <div class="column is-3" v-if="validationConf.display">
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
              :columns="columns"
              :scrollContainer="'#table-wrapper'"
              :validationConf="validationConf"
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
                <td
                  v-for="column in columns"
                  :key="Array.isArray(column.field) ? column.field.join() : column.field"
                  v-if="column.display"
                  :class="column.appliedClass ? column.appliedClass.body : ''"
                >
                  <span v-if="column.type === 'score'">
                    <progress-bar
                      :size="'small'"
                      :value="Number(entry[column.field])"
                      :max="scoreConfig.range.max"
                      :show-label="true"
                    ></progress-bar>
                  </span>
                  <span
                    v-else
                    v-html="formattedField(Array.isArray(column.field) ? [entry[column.field[0]], entry[column.field[1]]] : entry[column.field] , column.callBack)"
                  ></span>
                </td>

                <td v-if="validationConf.display">
                  <div class="field is-grouped has-text-centered">
                    <p class="has-text-centered mID-nowrap mID-margin-right-8">
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          v-model="entry.validation_decision"
                          :checked="entry.validation_decision"
                          @change="updateData(entry, 'decision')"
                        >
                          <i class="fa" :class="entry.validation_decision ? 'fa-check has-text-success' : 'fa-times has-text-danger'" aria-hidden="true"></i>
                      </label>
                    </p>
                    <p class="has-text-centered mID-nowrap">
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          v-model="entry.validation_indecision"
                          :checked="entry.validation_indecision"
                          @change="updateData(entry, 'indecision')"
                        >
                          <i class="fa fa-question" :class="entry.validation_indecision ? 'has-text-black' : 'has-text-grey-lighter'" aria-hidden="true"></i>
                      </label>
                    </p>
                  </div>
                </td>

                <td v-if="validationConf.display">
                  <div class="field has-text-centered">
                    <p class="has-text-centered mID-nowrap">
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          v-model="entry.validation_done"
                          :checked="entry.validation_done"
                          @change="updateData(entry, 'done')"
                        >
                        <span class="icon">
                          <i class="fa" :class="entry.validation_done ? 'fa-check has-text-purple' : 'fa-times has-text-grey-lighter'" aria-hidden="true"></i>
                        </span>
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

  </div>
</template>

<script>
import matchIdMessage from './Message'
import ProgressBar from './ProgressBar'
import ScrollManager from './FixedHeader/ScrollManager'
import TableHeader from './FixedHeader/TableHeader'
import RangeSlider from './RangeSlider'

import localization from '../../matchIdConfig/json/lang.json'

import randomIdConf from '../../matchIdConfig/json/randomId.json'
import columnsConf from '../../matchIdConfig/json/columns.json'
import scoresConf from '../../matchIdConfig/json/scores.json'
import esConf from '../../matchIdConfig/json/elasticsearch.json'
import validationConf from '../../matchIdConfig/json/validation.json'

import es from '../assets/js/es'
import formatCell from '../../matchIdConfig/js/formatCell'

export default {
  components: {
    matchIdMessage,
    ProgressBar,
    TableHeader,
    RangeSlider
  },
  data () {
    return {
      localization: localization,
      lang: localization.default,
      dataTable: [],
      searchString: '',
      selectedSearchField: randomIdConf.default_search_field,
      columns: columnsConf,
      validationConf: validationConf,
      fieldsForSourceES: [],
      loading: false,
      activeRow: 0,
      screenHeightMiddle: 0,
      shortcutsActivation: false,
      searchQuery: '',
      onlyUndone: false,
      scoreConfig: {
        connect: [ false, true, false ],
        step: (scoresConf.range[1] - scoresConf.range[0]) / 100,
        range: {
          min: scoresConf.range[0],
          max: scoresConf.range[1]
        }
      },
      valuesRangeSlider: scoresConf.range,
      error: {
        display: false,
        message: '',
        type: ''
      }
    }
  },
  created () {
    this.searchString = this.generateRandomId(randomIdConf)

    const scrollManagerCallbacks = {}
    Object.assign(scrollManagerCallbacks, {
      reachedStart: () => this.$refs.tableHeaderRef.release(),
      inside: () => this.$refs.tableHeaderRef.stick()
    })
    this.scrollManager = new ScrollManager(scrollManagerCallbacks)

    this.fieldsForSourceES = this.getFieldsForSourceES()

    this.refreshData()
  },
  mounted () {
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
          } else if (event.keyCode === 38) { // up arrow
            this.moveUp()
          }
          if (validationConf.display) {
            if (event.keyCode === 32) { // spacebar
              self.filteredData[self.activeRow].validation_done = true
              this.updateData(self.filteredData[self.activeRow], 'done')
              this.moveDown()
            }

            if (event.keyCode === 65) { // change decision
              self.filteredData[self.activeRow].validation_decision = !self.filteredData[self.activeRow].validation_decision
            }

            if (event.keyCode === 69) { // change indecision
              self.filteredData[self.activeRow].validation_indecision = !self.filteredData[self.activeRow].validation_indecision
            }
          }

          event.preventDefault()
        }
      }, false)
    },
    stopShortcutsMode () {
      this.shortcutsActivation = false
    },
    moveDown () {
      this.activeRow < (esConf[process.env.NODE_ENV].size - 1) ? this.activeRow += 1 : null
      let downOffsetTop = document.querySelector("[tr-line='tr-" + this.activeRow + "']").offsetTop
      document.getElementById('table-wrapper').scrollTop = (downOffsetTop - this.screenHeightMiddle)
    },
    moveUp () {
      this.activeRow > 0 ? this.activeRow -= 1 : null
      let upOffsetTop = document.querySelector("[tr-line='tr-" + this.activeRow + "']").offsetTop
      document.getElementById('table-wrapper').scrollTop = (upOffsetTop - this.screenHeightMiddle)
    },
    formattedField (value, callback) {
      if (Array.isArray(value)) {
        if (callback) {
          return formatCell[callback](value[0], value[1])
        }
        return formatCell.brDiff(value[0], value[1])
      }

      if (callback) {
        return formatCell[callback](value)
      }
      return value
    },
    generateRandomId (conf) {
      return conf.prefix + Array.from({ length: conf.lenght }, () => conf.characters[Math.floor(Math.random() * conf.characters.length)]).join('') + conf.suffix
    },
    refreshData () {
      this.dataTable = []
      this.valuesRangeSlider = scoresConf.range
      this.searchQuery = ''
      this.getData().then(() => {
        this.$refs.tableHeaderRef.justify()
      })
    },
    getData () {
      let self = this
      this.stopShortcutsMode()
      self.loading = true
      return es.search(self.searchString, self.selectedSearchField).then(function (response) {
        response.hits.hits.forEach(function (element) {
          if (self.onlyUndone || !element._source.validation_done) {
            if (validationConf.display) {
              element._source.validation_decision = !element._source.validation_decision ? element._source.confiance > scoresConf.preComputed.decision : element._source.validation_decision
              element._source.validation_done = !element._source.validation_done ? false : element._source.validation_done
              element._source.validation_indecision = !element._source.validation_indecision ? Array.isArray(scoresConf.preComputed.indecision) && element._source.confiance <= scoresConf.preComputed.indecision[1] && element._source.confiance >= scoresConf.preComputed.indecision[0] : element._source.validation_indecision
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
          es.updateDone(entry).then(function (response) {
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
        es.updateDone(entry).then(function (response) {
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
    },
    getFieldsForSourceES () {
      return this.columns.filter((item) => {
        return item.display
      }).map((item) => {
        return item.field
      })
    }
  }
}
</script>
