<template>
  <div id="app">
    <header>
      <match-id-navigation></match-id-navigation>
    </header>

    <router-view></router-view>

  </div>
</template>

<script>
import matchIdNavigation from './components/Navigation'
import Vue from 'vue'
import VueCodeMirror from 'vue-codemirror'
import ClientTable from 'vue-tables-2'

Vue.use(VueCodeMirror)
Vue.use(ClientTable)

window.bus = new Vue()

export default {
  name: 'app',
  components: {
    matchIdNavigation
  }
}
</script>

<style lang="scss" src="./assets/scss/style.scss"></style>
