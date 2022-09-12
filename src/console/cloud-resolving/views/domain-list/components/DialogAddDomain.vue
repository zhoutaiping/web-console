<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="500px"
    title="添加域名"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item
        label="请输入你要解析的域名"
        prop="domain"
      >
        <el-input
          v-model="form.domain"
          placeholder="demo.com"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import Rules from '@/utils/verify'

export default createDialog({
  data() {
    return {
      formDefault: {
        domain: ''
      },
      rules: {
        domain: {
          required: true,
          pattern: Rules.domain,
          message: '域名格式不正确'
        }
      }
    }
  },

  methods: {
    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = this.form
      try {
        await this.Fetch.post('V4/CloudDns.Domain.DnsDomain.add', form)
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
