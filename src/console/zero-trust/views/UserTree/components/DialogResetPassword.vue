<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="450px"
    title="重置密码"
    submit-text="确认"
    @submit="handleSubmit"
  >
    是否向用户
    <el-input
      v-model="form.email"
      style="width: 180px; margin: 0 12px"
      disabled
    />发送邮件以重置密码？
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      id: '',
      treeData: [],
      formDefault: {
        email: '',
        enabled: true,
        groups: null,
        mobile: '',
        name: '',
        remarks: ''
      }
    }
  },

  methods: {
    async initOptions(form, options) {
      const { id } = form
      this.mode = id ? 'Edit' : 'Create'
      this.id = id
    },

    async fetchSubmit() {
      await this.Fetch.post('V4/zero.trust.yunad.user.send.notice', {
        email: this.form.email,
        userId: this.form.id
      })
    },

    async handleSubmit(form) {
      this.$emit('init')
      this.$message.success('发送成功')
      this.handleClose()
    }
  }
})
</script>
