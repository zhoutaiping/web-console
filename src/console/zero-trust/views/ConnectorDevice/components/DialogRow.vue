<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="设备"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :rules="formRules"
      :model="form"
      label-width="120px"
    >
      <el-form-item
        label="设备名称"
        prop="device_name"
      >
        <el-input
          v-model="form.device_name"
          style="width: 200px"
          placeholder="设备名称"
        />
      </el-form-item>
      <el-form-item
        label="设备类型"
        prop="device_name"
      >
        <yd-form-select
          v-model="form.device_type"
          :selects="Selects.device_type"
          :disabled="mode === 'Edit'"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="告警通知">
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.online_notice"
        >上线通知</el-checkbox>
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.offline_notice"
        >离线通知</el-checkbox>
      </el-form-item>
      <el-form-item label="告警方式">
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.notice_sms"
        >短信</el-checkbox>
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.notice_email"
        >邮件</el-checkbox>
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
        device_name: '',
        device_type: '',
        online_notice: 0,
        offline_notice: 0,
        notice_email: 0,
        notice_sms: 0
      },
      formRules: {
        device_name: { required: true, message: '请输入' },
        device_type: { required: true, message: '请选择' }
      },
      Selects: {
        device_type: [
          // {
          //   label: '腾讯云',
          //   value: 'tencent'
          // },
          // {
          //   label: 'VMware',
          //   value: 'vmware'
          // },
          {
            label: 'Docker',
            value: 'docker'
          }
        ]
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.mode = form.device_id ? 'Edit' : 'Create'

      if (this.mode === 'Edit') {
        this.fetchInfo()
      } else {
        this.$refs.FormItemNotice.resetForm()
      }
    },

    async fetchInfo() {
      const data = await this.Fetch.post('V4/zero.trust.connector.device.info', { device_id: this.form.device_id })
      this.form.device_type = data.device_type
      this.form.online_notice = data.online_notice
      this.form.offline_notice = data.offline_notice
      this.form.notice_email = data.notice_email
      this.form.notice_sms = data.notice_sms
      this.$refs.FormItemNotice.setForm({
        alert_receivers: data.receivers_list.filter(_ => _.checked).map(_ => _.value)
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
      if (this.mode === 'Create') {
        await this.Fetch.post('V4/zero.trust.connector.device.add', form)
      } else {
        await this.Fetch.post('V4/zero.trust.connector.device.save', form)
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
