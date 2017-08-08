<template>
  <div class="progress-container is-flex">
    <progress :class="['progress', 'is-' + colorProgress(value), size ? `is-${size}` : '']" :value="value" :max="max"></progress>
    <span v-show="showLabel">{{value}}</span>
  </div>
</template>

<script>
import scoresConf from '../../matchIdConfig/json/scores.json'

export default {
  props: {
    size: String,
    value: {
      type: Number,
      required: true,
      default: 0
    },
    max: {
      type: Number,
      required: true,
      default: 0
    },
    showLabel: Boolean
  },
  methods: {
    colorProgress (value) {
      if (value >= scoresConf.colors.success) {
        return 'success'
      } else if (value >= scoresConf.colors.info) {
        return 'info'
      } else if (value >= scoresConf.colors.warning) {
        return 'warning'
      } else if (value >= scoresConf.colors.danger) {
        return 'danger'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.progress-container {
  align-items: center;
  .progress {
    margin-bottom: 0 !important;
  }
  .progress + span {
    min-width: 36px;
    text-align: right;
  }
}
</style>
