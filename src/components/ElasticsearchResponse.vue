<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('close')"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-content">
            <tree-view :data="filteredData(data)" :options="{maxDepth: 3}"></tree-view>
          </div>
        </div>
      </div>
    <button class="modal-close is-large" @click="$emit('close')"></button>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeView from 'vue-json-tree-view'

import viewConf from '../../matchIdConfig/json/view.json'

Vue.use(TreeView)

export default {
  props: {
    'data': {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      viewConf: viewConf
    }
  },
  methods: {
    filteredData (data) {
      if (viewConf.fields.names.length) {
        if (viewConf.fields.operation === 'included') {
          Object.keys(data).map((v) => {
            !viewConf.fields.names.includes(v) ? delete data[v] : null
          })
        } else if (viewConf.fields.operation === 'excluded') {
          viewConf.fields.names.forEach((v) => {
            delete data[v]
          })
        }
      }

      return data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
