<template>

<div>
  <div v-if="loading">
    <div id="loading-spinner" class="has-text-centered">
      <span class="icon is-large">
        <i class="fa fa-circle-o-notch fa-pulse"></i>
      </span>
    </div>
  </div>
  <div v-else v-shortkey="['ctrl', 's']" @shortkey="saveCode()">
    <codemirror
      ref="myEditor"
      :code="code"
      @change="onEditorCodeChange"
      :options="editorOptions"
      >
    </codemirror>
  </div>
</div>
</template>

<script>
  import { codemirror } from 'vue-codemirror'
  import localization from '../assets/json/lang.json'

  import apiConf from '../../matchIdConfig/backend.json'
  let api = apiConf.api

  // require('../codemirror_addons/comment.js')

  export default {
    components: {
      codemirror
    },
    data () {
      return {
        code: null,
        object: {},
        localization: localization,
        lang: localization.default,
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
        project: '',
        source: '',
        loading: false,
        editorOptions: {
          // viewportMargin: Infinity,
          tabSize: 2,
          indentWithTabs: false,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          foldGutter: true,
          styleSelectedText: true,
          mode: 'text/yaml',
          // keyMap: 'sublime',
          showCursorWhenSelecting: true,
          // extraKeys: { 'Ctrl+S': this.saveCode() },
          extraKeys: {
            Tab: function (cm) {
              var spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
              cm.replaceSelection(spaces, 'end', '+input')
            }
          },
          hintOptions: {
            completeSingle: false
          }
        }
      }
    },
    methods: {
      onEditorReady (editor) {
        console.log('the editor is readied!', editor)
      },
      onEditorFocus (editor) {
        console.log('the editor is focus!', editor)
      },
      onEditorCodeChange (newCode) {
        this.code = newCode
      },
      saveCode () {
        var vue = this
        var w = window
        // console.log('saveCode')
        var data = {yaml: vue.code}
        // w.bus.$emit('loadingCode', true)
        // console.log(data)
        this.$http.post(api.url + 'conf/' + vue.source, data)
          .then(response => {
            w.bus.$emit('loadingCode', false)
            console.log(vue.source + ' successfully saved')
            w.bus.$emit('codeContentChange', vue.object)
            // success callback
            console.log()
            var msg = response.body[Object.keys(response.body)[0]].yaml_validator
            if (msg !== 'yaml is ok') {
              window.bus.$emit('error', {display: true, message: msg, type: 'danger'})
            } else {
              window.bus.$emit('error', {display: true, message: vue.localization.codemirror.saved[vue.lang], type: 'success'})
            }
          },
            response => {
              // w.bus.$emit('loadingCode', false)
              console.log(vue.source + ' : error while saving')
              var msg = vue.localization.codemirror.notSaved[vue.lang] + ' - ' + response.body.message
              w.bus.$emit('error', {display: true, message: msg, type: 'danger'})
            // error callback
            })
      }
    },
    computed: {
      editor () {
        return this.$refs.myEditor.editor
      }
    },
    mounted () {
      var vue = this
      var w = window
      window.bus.$on('projectChange', function (project) {
        vue.project = project
        // vue.editor.setValue('')
      })

      window.bus.$on('loadingCode', function (loading) {
        vue.loading = loading
      })

      window.bus.$on('langChange', function (value) {
        self.lang = value
      })

      window.bus.$on('objectChange', function (object) {
        // console.log('codeMirror objectChange ' + vue.id + ' ' + Object.keys(object)[0])
        if (vue.object !== object) {
          // vue.editor.setValue('')
          vue.object = object
          var props = object[Object.keys(object)[0]]
          w.bus.$emit('loadingCode', true)
          vue.source = props.project + '/' + props.source
          // console.log('codeMirror loadSource ' + vue.id + ' ' + Object.keys(object)[0])
          vue.$http.get(api.url + 'conf/' + vue.source)
            .then(response => {
              console.log('codeMirror ok ' + vue.id + ' ' + Object.keys(object)[0])
              window.bus.$emit('loadingCode', false)
              vue.code = response.body
              vue.editor.setValue(vue.code)
            },
              response => {
                console.log('codeMirror yaml load failure')
              }
            )
        }
      })
    }
  }
</script>

