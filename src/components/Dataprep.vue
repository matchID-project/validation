<template>
<div id="dataprep">

  <div v-show="loading">
    <div class="has-text-centered is-large">
      <span class="icon is-large">
        <i class="fa fa-circle-o-notch fa-pulse"></i>
      </span>
    </div>
  </div>

  <template v-if="!empty & validationDisplay">
    <controller
      :columns="validationConfig.columns"
      :scores="validationConfig.scores"
      :view="validationConfig.view"
      :actions="validationConfig.actions"
      :elasticsearch="validationConfig.elasticsearch"
    ></controller>
  </template>

  <div v-show="!empty & !loading & !validationDisplay">
    <div class="level max-height-300px resize">
      <div class="level-item is-6" >
        <codemirror class="overflow-y-hidden is-small is-12  max-height-300px"></codemirror>
      </div>
      <div class="level-item is-6">
        <viewlog class="overflow-y-auto is-12 max-height-300px">
        </viewlog>
      </div>
    </div>
    <div>
      <message
          v-show="error.display"
          :type="error.type"
      >
          <span slot="header" >
              <b v-if="error.type !== 'success' ">{{ localization.dataprep.mistake[lang] }}</b>
              <b v-else="error.type ">{{ localization.dataprep.success[lang] }}</b>
          </span>
          <span slot="button">
            <button class="delete"  @click="error.display = false"></button>
          </span>
          <slot class="is-small">
            {{error.message}}
          </slot>
      </message>
    </div>
    <div>
      <viewdata></viewdata>
    </div>
  </div>

</div>
</template>

<script>
import Message from './Helpers/Message'
import Controller from './Validation/Controller'
import Codemirror from './Codemirror'
import Viewdata from './Viewdata'
import Viewlog from './Viewlog'
import localization from '../assets/json/lang.json'

export default {
  components: {
    Message,
    Controller,
    Codemirror,
    Viewdata,
    Viewlog
  },
  data () {
    return {
      empty: true,
      loading: false,
      localization: localization,
      lang: localization.default,
      loadingCode: false,
      loadingData: false,
      loadingLog: false,
      validationDisplay: false,
      validationConfig: {},
      error: {
        display: false,
        message: '',
        type: ''
      }
    }
  },
  mounted () {
    let self = this

    window.bus.$on('projectChange', function (object) {
      self.empty = true
      self.loading = false
    })

    window.bus.$on('objectChange', function (object) {
      self.empty = false
    })

    window.bus.$on('validationDisplay', function (object) {
      self.validationDisplay = object
    })

    window.bus.$on('validationConfig', function (object) {
      self.validationConfig = object.props
    })

    window.bus.$on('loadingCode', function (loading) {
      self.loadingCode = loading
      self.loading = self.loadingCode && self.loadingData && self.loadingLog
    })

    window.bus.$on('loadingData', function (loading) {
      self.loadingData = loading
      self.loading = self.loadingCode && self.loadingData && self.loadingLog
    })

    window.bus.$on('loadingLog', function (loading) {
      self.loadingLog = loading
      self.loading = self.loadingCode && self.loadingData && self.loadingLog
    })

    window.bus.$on('error', function (error) {
      self.error = error
    })

    window.bus.$on('langChange', function (value) {
      self.lang = value
    })
  }
}

</script>
