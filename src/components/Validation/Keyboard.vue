<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('close')"></div>
      <div class="modal-content">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <i class="fa fa-keyboard-o mID-margin-right-8" aria-hidden="true"></i>
              {{ localization.navbar.keyboard.title[lang] }}
            </div>
            <div class="card-header-icon">
              <button class="delete" @click="$emit('close')"></button>
            </div>
          </div>
          <div class="card-content">
            <div class="box">
              <div class="columns level">
                <div class="column is-one-third has-text-centered">
                  <span class="tag is-medium">Ctrl</span>
                  <span class="tag is-medium is-white">+</span>
                  <span class="tag is-medium">Alt</span>
                </div>
                <div class="column is-two-thirds" v-html="localization.navbar.keyboard.activate_deactivate[lang]"></div>
              </div>
            </div>
            <div class="level">
              <h5 class="subtitle">{{localization.navbar.keyboard.only_when_activated[lang]}}</h5>
            </div>
            <div class="box" v-show="validationDisplay">
              <div class="columns level">
                <div class="column is-one-third has-text-centered">
                  <span class="tag is-medium">a</span>
                </div>
                <div class="column is-two-thirds" v-html="localization.navbar.keyboard.change_decision[lang]"></div>
              </div>
            </div>
            <div class="box" v-show="validationDisplay">
              <div class="columns level">
                <div class="column is-one-third has-text-centered">
                  <span class="tag is-medium">e</span>
                </div>
                <div class="column is-two-thirds" v-html="localization.navbar.keyboard.change_indecision[lang]"></div>
              </div>
            </div>
            <div class="box" v-show="validationDisplay">
              <div class="columns level">
                <div class="column is-one-third has-text-centered">
                  <span class="tag is-medium">Space</span>
                </div>
                <div class="column is-two-thirds" v-html="localization.navbar.keyboard.validate[lang]"></div>
              </div>
            </div>
            <div class="box">
              <div class="columns level">
                <div class="column is-one-third has-text-centered">
                  <span class="tag is-medium">
                    <span class="icon is-small"><i class="fa fa-arrow-up"></i></span>
                  </span>
                  <span class="tag is-medium is-white">/</span>
                  <span class="tag is-medium">
                    <span class="icon is-small"><i class="fa fa-arrow-down"></i></span>
                  </span>
                </div>
                <div class="column is-two-thirds" v-html="localization.navbar.keyboard.previous_next[lang]"></div>
              </div>
            </div>
            <div class="box">
              <div class="columns level">
                <div class="column is-one-third has-text-centered">
                  <span class="tag is-medium">i</span>
                </div>
                <div class="column is-two-thirds" v-html="localization.navbar.keyboard.reload_random[lang]"></div>
              </div>
            </div>
            <div class="box">
              <div class="columns level">
                <div class="column is-one-third has-text-centered">
                  <span class="tag is-medium">d</span>
                </div>
                <div class="column is-two-thirds" v-html="localization.navbar.keyboard.json_view[lang]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <button class="modal-close is-large" @click="$emit('close')"></button>
  </div>
</template>

<script>
import localization from '../../assets/json/lang.json'

export default {
  props: {
    'validationDisplay': {
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
      localization: localization,
      lang: localization.default
    }
  },
  mounted () {
    let self = this
    window.bus.$on('langChange', function (value) {
      self.lang = value
    })
  }
}
</script>
