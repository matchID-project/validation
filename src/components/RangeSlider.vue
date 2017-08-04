<template>
  <div id="slider"></div>
</template>

<script>
  var noUiSlider = require('nouislider')

  export default {
    props: {
      config: {
        type: Object,
        required: true
      },
      values: {
        type: Array,
        required: true
      },
      color: {
        type: String,
        required: false,
        default: 'has-background-red'
      },
      id: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        slider: null
      }
    },
    watch: {
      values () {
        this.slider.noUiSlider.set(this.values)
      }
    },
    mounted () {
      this.slider = document.getElementById('slider')

      this.config.start = this.values

      noUiSlider.create(this.slider, this.config)

      this.slider.querySelector('.noUi-connect').classList.add(this.color)

      this.slider.noUiSlider.on('change', (valueRange) => {
        this.$emit('updateRangeSlider', valueRange)
      })
    }
  }
</script>

<style lang="scss">
  @import '~nouislider/distribute/nouislider.min.css';

  .noUi-target {
    margin-top:12px;
  }
  .noUi-horizontal {
    height: 12px;
    .noUi-handle {
      width: 15px;
      height: 15px;
      left: -5px;
      top: -3px;
    }
  }

  .noUi-handle {
    border-radius: 15px;,
    &:after, &:before {
      content: normal;
    }
  }
</style>
