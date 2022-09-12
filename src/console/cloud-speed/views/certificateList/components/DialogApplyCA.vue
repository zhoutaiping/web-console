<template>
  <DmDialog
    ref="Dialog"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    width="600px"
    title="申购证书"
    submit-text="确定"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 申请证书前请保证域名已接入 WEB 安全加速<br >
      2. 如您需要为泛域名申购证书，请确保泛域名的主域名已接入 DNS 安全加速<br >
      3. 免费证书只支持 Let‘s Encrypt 的域名型证书，有效期为 3 个月，到期自动续签<br >
      4. 证书申购成功后请勿修改域名接入状态，否则会影响证书续期
    </DmAlert>
    <el-form
      label-width="100px"
      label-position="right"
    >
      <el-form-item
        :error="error"
        label="域名"
      >
        <el-input
          v-model="form.domain"
          style="width: 280px"
          placeholder="www.demo.com"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      formDefault: {
        domain: ''
      },
      error: ''
    }
  },

  methods: {
    initOptions() {
      this.error = ''
    },

    async fetchSubmit() {
      try {
        await this.Fetch.post('V4/Web.ca.apply.add', {
          domain: [this.form.domain]
        })
      } catch (e) {
        this.error = e.status.message
        throw new Error()
      }

      this.error = ''
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
