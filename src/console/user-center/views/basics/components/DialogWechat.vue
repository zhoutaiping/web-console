<style lang="scss" scoped>
.DialogWechat {
  text-align: center;
  .el-image {
    width: 200px;
  }

  p {
    font-size: 14px;
  }
}
</style>

<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    width="500px"
    title="绑定微信"
    @close="handleSubmit"
  >
    <div class="DialogWechat">
      <el-image src="https://yundun-statics.yundun.com/FpFEy0vtp9ykfw4ATu8Gml7gWFLn" />
      <p>请扫描二维码绑定</p>
    </div>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      formDefault: {
        qq: ''
      },
      rules: {
        qq: [{
          require: true,
          trigger: 'blur'
        }]
      }
    }
  },

  methods: {
    beforeOpen(form) {},

    async handleSubmit() {
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
