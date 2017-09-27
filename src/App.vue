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
import Tooltip from 'vue-directive-tooltip'
// import 'vue-directive-tooltip/css/index.css'

Vue.use(Tooltip)
Vue.use(VueCodeMirror)

window.bus = new Vue()

export default {
  name: 'app',
  components: {
    matchIdNavigation
  }
}
</script>

<style lang="scss" src="./assets/scss/style.scss"></style>
