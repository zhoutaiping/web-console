<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label=""
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item
        label="Token 名称"
        prop="token_name"
      >
        <el-input
          v-model="form.token_name"
          placeholder="Token 名称"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item
        v-if="mode === 'Create'"
        label="过期时间"
        prop="expire_flag"
      >
        <yd-form-select
          v-model="form.expire_flag"
          :selects="Selects.expire_flag"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label="过期提醒方式">
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.expire_notice_email"
        >邮件</el-checkbox>
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.expire_notice_sms"
        >短信</el-checkbox>
      </el-form-item>
      <FormItemNotice ref="FormItemNotice" />
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import FormItemNotice from '@/components/FormItem/FormItemNotice'

export default createDialog({
  components: { FormItemNotice },

  data() {
    return {
      formDefault: {
        token_name: '',
        expire_notice_email: 0,
        expire_notice_sms: 0,
        expire_flag: 4
      },
      Selects: {
        expire_flag: [
          {
            label: '一个月',
            value: 1
          },
          {
            label: '三个月',
            value: 2
          },
          {
            label: '六个月',
            value: 3
          },
          {
            label: '一年',
            value: 4
          }
        ]
      },
      formRules: {
        token_name: { required: true, message: '请输入' }
      },
      submitRes: {}
    }
  },

  methods: {
    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.mode = form.api_token_id ? 'Edit' : 'Create'
      if (this.mode === 'Edit') {
        this.fetchInfo()
      } else {
        this.$refs.FormItemNotice.resetForm()
      }
    },

    async fetchInfo() {
      const res = await this.Fetch.get('V4/zero.trust.api.token.info', {
        api_token_id: this.form.api_token_id
      })
      this.form.expire_notice_email = res.expire_notice_email
      this.form.expire_notice_sms = res.expire_notice_sms
      this.$refs.FormItemNotice.setForm({
        alert_receivers: res.receivers_list.filter(_ => _.checked).map(_ => _.value)
      })
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const formNotice = this.$refs.FormItemNotice.getForm()
      const form = {
        ...this.form,
        ...formNotice
      }
      let res
      try {
        if (this.mode === 'Create') {
          res = await this.Fetch.post('V4/zero.trust.api.token.add', form)
        } else {
          await this.Fetch.post(`V4/zero.trust.api.token.save`, form)
        }
      } catch (e) {
        throw new Error()
      }
      this.submitRes = res
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      if (this.mode === 'Create') this.$emit('show-client', this.submitRes)
      this.handleClose()
    }
  }
})
</script>
