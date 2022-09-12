<template>
  <div class="yd-input-safe-code">
    <div id="code-safe" :data-clipboard-text="value" class="code">{{ value }}
      <i class="btn-copy icon-copy iconfont" @click="handleCopy"/>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

export default {

  components: {},
  props: {
    value: String
  },

  data() {
    return {}
  },

  computed: {},

  methods: {
    handleCopy() {
      const clipboard = new Clipboard('#code-safe')
      clipboard.on('success', e => {
        this.$message.success('复制成功')
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message.warning('您的浏览器不支持复制，请手动复制')
        clipboard.destroy()
      })
    }
  }
}
</script>
<style lang="scss">
.yd-input-safe-code {
  .code {
    display: inline-block;
    position: relative;
    font-size: 24px;
    letter-spacing: 1px;
  }
  .btn-copy {
    cursor: pointer;
    transition: 0.3s;
    position: absolute;
    right: -20px;
    top: 10px;
    opacity: 0.7;
    color: $--color-primary;
    font-size: 13px;
    &:hover {
      color: $--color-primary;
    }
  }
}
</style>
