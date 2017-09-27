<template>
  <div id="navigationWrapper">
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="navbar-item logo">
          matchID
        </div>
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
      <nav-dataprep></nav-dataprep>
    </nav>
  </div>
</template>

<script>
import localization from '../assets/json/lang.json'

import NavDataprep from './NavDataprep'

export default {
  components: {
    NavDataprep
  },
  data () {
    return {
      langs: localization.available,
      lang: localization.default
    }
  },
  methods: {
    changeLang (aLang) {
      this.lang = aLang
      window.bus.$emit('langChange', this.lang)
    }
  },
  mounted () {
    let self = this
    this.changeLang(this.lang)
    window.bus.$on('langChange', function (value) {
      self.lang = value
    })
  }
}
</script>

<style scoped lang="scss">
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
