<template>
<div>

  <div v-show="loading">
    <div id="loading-spinner" class="has-text-centered">
      <span class="icon is-large">
        <i class="fa fa-circle-o-notch fa-spin"></i>
      </span>
    </div>
  </div>

  <div v-show="!loading" class="is-fullheight">
      <p v-for="entry in parsedLog" class="is-small">
           <a :class="[entry.match('Ooops') ? 'has-text-danger' : 'has-text-primary']" > {{entry}}</a> 
      </p>
  </div>
</div>

</template>

<script>
import localization from '../assets/json/lang.json'

import apiConf from '../../matchIdConfig/backend.json'
let api = apiConf.api

export default {
  data () {
    return {
      object: {},
      head: 100,
      langs: localization.available,
      lang: localization.default,
      log: '',
      loading: false,
      localization: localization
    }
  },
  methods: {
    loadRunningLog () {
      // var vue = this
      var object = this.object
      var name = Object.keys(object)[0]
      if (name === undefined) {
        return
      }
      // console.log('loadRunningLog')
      var type = object[name].type
      if (type === 'recipe') {
        if (object[name].running === true) {
          // vue.loading = true
          this.object = object
          this.$http.get(api.url + type + 's/' + name + '/log')
            .then(
              response => {
                window.bus.$emit('logChange', response.body)
              },
              response => {
                window.bus.$emit('error', {display: true, message: response.body, type: 'danger'})
              }
            )
        }
      }
    },
    changeLog (log) {
      this.log = log
      var vue = this
      window.bus.$emit('loadingLog', false)
      if (log.match('Ooops')) {
        window.bus.$emit('error', {display: true, message: vue.localization.viewlog.recipeError[vue.lang], type: 'warning'})
      }
    }
  },
  computed: {
    parsedLog: function () {
      var logLines = this.log.split('\n')
      if (logLines.length > (2 * this.head + 1)) {
        logLines.splice(this.head, logLines.length - 2 * this.head)
        logLines[this.head - 1] = '...'
      }
      return logLines
    }
  },
  mounted () {
    var vue = this
    window.bus.$on('objectChange', function (object) {
      vue.object = object
      var name = Object.keys(object)[0]
      var type = object[name].type
      vue.log = ''
      if (type === 'recipe') {
        window.bus.$emit('loadingLog', true)
      }
    })

    window.bus.$on('loadingLog', function (loading) {
      vue.loading = loading
    })

    window.bus.$on('langChange', function (value) {
      self.lang = value
    })

    window.bus.$on('logChange', this.changeLog)

    setInterval(function () {
      vue.loadRunningLog()
    }, 5000)
  }
}

</script>

