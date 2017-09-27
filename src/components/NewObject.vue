<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close()"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <i class="fa fa-bars mID-margin-right-8" aria-hidden="true"></i> {{ localization.newObject[action+type][lang] }}
            </div>
            <div class="card-header-icon">
              <button class="delete" @click="close()"></button>
            </div>
          </div>
          <div class="card-content has-text-centered">
            <div v-show="action == 'new' || type == 'project'" class="level">
              <div class="level-item has-text centered">
                <form>
                  {{ localization.newObject['name'+type][lang] }} &nbsp;
                  <input name="objectName"
                    @keyup.enter="saveObject(name)"
                    v-model="name"
                    :placeholder="localization.newObject['name'+type][lang].replace(/[^a-z0-9]/gi, '_').toLowerCase()"
                  >
                </form>
              </div>
              <div class="level-item has-text centered">
                <button
                  class="button is-primary"
                  @click="saveObject(name)"
                >
                  {{ localization.newObject.save[lang] }}
                </button>
              </div>
            </div>
            <dropzone
              v-show="action == 'import'" id="myVueDropzone"
              :url="url"
              v-on:vdropzone-success="showSuccess"
              :dropzone-options="customOptionsObject"
              :max-file-size-in-m-b="1000"
            >
              <!-- Optional parameters if any! -->
            </dropzone>
            <message class="is-6"
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
          <div class="card-footer has-text-centered">
          </div>
        </div>
      </div>
    <button class="modal-close is-large" @click="close()"></button>
  </div>
</template>

<script>
import Message from './Helpers/Message'
import Dropzone from 'vue2-dropzone'

import localization from '../assets/json/lang.json'
import apiConf from '../../matchIdConfig/backend.json'
let api = apiConf.api

export default {
  components: {
    Message,
    Dropzone
  },
  props: {
    type: String,
    action: String
  },
  data () {
    return {
      error: {
        display: false,
        type: 'success',
        message: ''
      },
      project: '',
      localization: localization,
      lang: localization.default,
      customOptionsObject: {
        language: localization.newObject.dropzoneDict[this.lang]
      },
      name: null
    }
  },
  computed: {
    url: function () {
      if (this.type === 'dataset') {
        return api.url + 'upload/'
      }
      return api.url + 'upload/'
    //   else if (this.type === 'recipe') {
    //     return api.url + 'conf/' + this.project + '/recipes/'
    //   } else if (this.type === 'project') {
    //     var name = this.name === null ? 'defaut_project' : this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    //     return api.url + 'conf/' + name + '/'
    //   }
    }
  },
  methods: {
    showSuccess: function (file) {
      if (this.type === 'dataset') {
        this.saveObject(file.upload.filename)
      }
    },
    close: function () {
      this.$emit('close')
      this.error = {
        display: false,
        type: 'success',
        message: ''
      }
      this.name = null
    },
    saveObject: function (name) {
      var vue = this
      var table = name
      name = name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      var url
      var method
      var data
      var yaml
      console.log(this.project + '/' + name)
      if (this.type === 'project') {
        url = api.url + 'conf/' + name + '/'
        method = 'put'
      } else if (this.type === 'dataset') {
        url = api.url + 'conf/' + this.project + '/datasets/' + name + '.yml'
        method = 'post'
        yaml = `datasets:
  {name}:
    connector: upload
    table: {table}
    type: read_csv
    sep: "\\\\s+|,|;"
    encoding: "utf8"
`
        yaml = yaml.replace(/\{name\}/mg, name)
        yaml = yaml.replace(/\{table\}/mg, table)
        data = {
          yaml: yaml
        }
      } else if (this.type === 'recipe') {
        url = api.url + 'conf/' + this.project + '/recipes/' + name + '.yml'
        method = 'post'
        yaml = `recipes:
  {}:
    input: replace_input
    output: replace_output
    steps:
      - eval:
          - new_col: sha1(row)
`
        yaml = yaml.replace(/\{\}/mg, name)
        data = {
          yaml: yaml
        }
      }
      if (url !== undefined && method !== undefined) {
        this.$http[method](url, data)
          .then(
            response => {
              vue.error = {
                display: 'true',
                type: 'success',
                message: response.body
              }
            },
            response => {
              vue.error = {
                display: 'true',
                type: 'danger',
                message: response.body
              }
            }
        )
      }
    }
  },
  mounted () {
    let vue = this

    window.bus.$on('langChange', function (value) {
      vue.lang = value
    })

    window.bus.$on('projectChange', function (value) {
      vue.project = value
    })
  }
}
</script>
