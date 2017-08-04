<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="navbar-item logo">
          matchID
        </div>
        <div class="navbar-item is-hidden-desktop">
          <span class="icon">
            <i class="fa" :class="[errorMarker ? 'fa-times has-text-danger' : 'fa-check has-text-primary']"></i>
          </span>
        </div>
        <a
          class="navbar-item is-hidden-desktop"
          :class="{'has-text-danger mID-unclickable' : errorMarker}"
          v-show="validationDisplay"
          @click="statisticsRender"
        >
          <i class="fa fa-bar-chart-o mID-margin-right-8" aria-hidden="true"></i> {{ localization.navbar.statistics[lang] }}
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link is-active">
              <span class="icon"><i class="fa fa-globe"></i></span>
            </a>
            <div class="navbar-dropdown">
              <a
                class="navbar-item"
                v-for="aLang in langs"
                :key="aLang.key"
                :class="{'is-active' : aLang === lang}"
                @click="changeLang(aLang)"
              >
                {{ aLang.toUpperCase() }}
              </a>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <span class="icon">
              <i class="fa" :class="[errorMarker ? 'fa-times has-text-danger' : 'fa-check has-text-primary']"></i>
            </span>
          </div>
          <a class="navbar-item" @click="keyboardRender">
            <span class="icon">
              <i class="fa fa-keyboard-o"></i>
            </span>
          </a>
          <a
            class="navbar-item"
            :class="{'has-text-danger mID-unclickable' : errorMarker}"
            v-show="validationDisplay"
            @click="statisticsRender"
          >
            <i class="fa fa-bar-chart-o mID-margin-right-8" aria-hidden="true"></i> {{ localization.navbar.statistics[lang] }}
          </a>
        </div>
      </div>
    </nav>

    <statistics
      v-show="validationDisplay && statisticsShow"
      @close="statisticsShow = false"
      :dataResults="statisticsResults"
    ></statistics>

    <keyboard
      v-show="keyboardShow"
      :validationDisplay="validationDisplay"
      @close="keyboardShow = false"
    ></keyboard>
  </div>
</template>

<script>
import localization from '../../matchIdConfig/json/lang.json'
import validationConf from '../../matchIdConfig/json/validation.json'

import Statistics from './Statistics'
import Keyboard from './Keyboard'
import es from '../assets/js/es'

export default {
  components: {
    Statistics,
    Keyboard
  },
  data () {
    return {
      isHamburgerActive: false,
      errorMarker: false,
      statisticsShow: false,
      keyboardShow: false,
      validationDisplay: validationConf.display,
      localization: localization,
      langs: localization.available,
      lang: localization.default,
      statisticsResults: {}
    }
  },
  methods: {
    toggleMobile () {
      this.isHamburgerActive = !this.isHamburgerActive
    },
    keyboardRender () {
      this.keyboardShow = true
    },
    statisticsRender () {
      this.statisticsShow = true

      this.getStatistics()
    },
    getStatistics () {
      let self = this
      es.getStatistics().then(function (response) {
        self.statisticsResults = Object.assign({}, self.statisticsResults, response)
      }, function (error) {
        console.log(error)
      })
    },
    changeLang (aLang) {
      this.lang = aLang

      window.bus.$emit('langChange', this.lang)
    }
  },
  mounted () {
    let self = this
    window.bus.$on('errorConnection', function (value) {
      self.errorMarker = value
    })

    this.changeLang(this.lang)

    window.bus.$on('langChange', function (value) {
      self.lang = value
    })
  }
}
</script>

<style scoped lang="less">
.nav {
  height: 2.75rem;
  > .container {
    min-height: 2.75rem;
  }
}
.nav-toggle {
  height: 2.75rem;
}
</style>
