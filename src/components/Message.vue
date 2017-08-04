<template>
  <div class="container messageWrapper">
    <article :class="messageType(type)">
      <div class="message-header">
        <p>
          <span class="icon"><i :class="['fa', 'fa-' + iconType(type)]"></i></span>
          <slot name="header"></slot>
        </p>
      </div>
      <div class="message-body">
        <slot></slot>
      </div>
    </article>
  </div>
</template>

<script>
  export default {
    props: {
      type: String
    },
    data () {
      return {
        icons: {
          normal: '',
          primary: 'arrow-circle-right',
          info: 'info-circle',
          success: 'check-circle',
          warning: 'exclamation-circle',
          danger: 'times-circle'
        }
      }
    },
    methods: {
      messageType (type) {
        return type ? 'message is-' + type : 'message'
      },
      iconType (type) {
        return this.icons[type]
      }
    }
  }
</script>

<style scoped lang="less">
.messageWrapper {
  margin-top: 20px;
  background-color: #fff;
}
</style>
