<template>
  <yd-dialog :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape" :title="title" :visible.sync="visible" class="yd-dialog">
    <slot/>
    <div class="yd-dialog__footer">
      <slot name="footer"/>
    </div>
  </yd-dialog>
</template>

<script>
export default {

  components: {},
  props: {
    title: String,
    visible: Boolean
  },

  data() {
    return {
      closeOnClickModal: false, // 是否可以通过点击 modal 关闭 Dialog
      closeOnPressEscape: false // 是否可以通过按下 ESC 关闭 Dialo
    }
  },

  computed: {},

  methods: {}
}
</script>

<style lang="scss">
.yd-dialog {
  .yd-dialog {
    border-radius: 0px !important;
  }
  .yd-dialog__header {
    .yd-dialog__close {
      font-size: 10px;
    }
  }
  .yd-input-safe-code{
    text-align: center;
    margin: 20px auto;
  }
}
</style>
