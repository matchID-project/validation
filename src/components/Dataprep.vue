<template>
<div id="dataprep">
  <div v-show="loading">
    <div class="has-text-centered is-large">
      <span class="icon is-large">
        <i class="fa fa-circle-o-notch fa-pulse"></i>
      </span>
    </div>
  </div>
  <validation
    v-show="!empty & validation"
  ></validation>
  <div v-show="!empty & !loading & !validation">
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
import validationConf from '../../matchIdConfig/json/validation.json'
import Message from './Message'
import Validation from './Validation'
import Codemirror from './Codemirror'
import Viewdata from './Viewdata'
import Viewlog from './Viewlog'
import localization from '../../matchIdConfig/json/lang.json'

export default {
  components: {
    Message,
    Validation,
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
      validation: false,
      validationConf: validationConf,
      error: {
        display: false,
        message: '',
        type: ''
      }
    }
  },
  mounted () {
    var vue = this

    window.bus.$on('projectChange', function (object) {
      vue.empty = true
      vue.loading = false
    })

    window.bus.$on('objectChange', function (object) {
      vue.empty = false
    })

    window.bus.$on('validation', function (validation) {
      vue.validation = validation
    })

    window.bus.$on('loadingCode', function (loading) {
      vue.loadingCode = loading
      vue.loading = vue.loadingCode && vue.loadingData && vue.loadingLog
    })

    window.bus.$on('loadingData', function (loading) {
      vue.loadingData = loading
      vue.loading = vue.loadingCode && vue.loadingData && vue.loadingLog
    })

    window.bus.$on('loadingLog', function (loading) {
      vue.loadingLog = loading
      vue.loading = vue.loadingCode && vue.loadingData && vue.loadingLog
    })

    window.bus.$on('error', function (error) {
      vue.error = error
    })

    window.bus.$on('langChange', function (value) {
      self.lang = value
    })
  }
}

</script>
