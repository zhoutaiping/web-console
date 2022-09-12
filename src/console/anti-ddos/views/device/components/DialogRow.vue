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
      :model="form"
      label-width="140px"
      label-position="right"
    >
      <el-form-item
        label="设备IP"
        prop="ip"
      >
        <el-input
          v-model="form.ip"
          placeholder="0.0.0.0"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item
        label="是否启用"
        prop="title"
      >
        <el-switch v-model="form.status" />
      </el-form-item>
      <el-form-item label="CPU使用率(%)">
        <el-input-number
          v-model="form.alarmCpu"
          :min="0"
          :max="100"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="内存使用率(%)">
        <el-input-number
          v-model="form.alarmRam"
          :min="0"
          :max="100"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="网卡故障">
        <el-switch v-model="form.alarmNetCard" />
      </el-form-item>
      <el-form-item label="告警方式">
        <yd-form-checkbox
          :checks="selectAlarmType"
          v-model="form.alarmType"
        />
      </el-form-item>
      <el-form-item
        label="告警联系人"
        prop="alarmReceiver"
      >
        <yd-form-select
          :selects="adsSelectReceiver"
          v-model="form.alarmReceiver"
          multiple
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="note"
      >
        <el-input
          v-model="form.note"
          placeholder="备注"
          style="width: 180px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import adsMixins from '../../../mixins/ads'

export default createDialog({
  mixins: [adsMixins],

  data() {
    return {
      selectAlarmType: [
        {
          label: '邮件',
          value: 'mail'
        },
        {
          label: '短信',
          value: 'sms'
        }
      ],
      formDefault: {
        ip: '',
        status: true,
        note: '',
        alarmNetCard: false,
        alarmCpu: 90,
        alarmRam: 90,
        alarmType: [],
        alarmReceiver: []
      }
    }
  },

  methods: {
    beforeOpen(form) {
      this.adsFetchReceiverList()
      if (form.clusterId) {
        form.alarmType = form.alarmType && form.alarmType.split(',') || []
        form.alarmReceiver = form.alarmReceiver && form.alarmReceiver.split(',') || []
      }
    },

    initOptions(form, options) {
      this.mode = form.clusterId ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      const form = {
        ...this.form,
        clusterId: this.$route.params.id,
        alarmType: this.form.alarmType.join(','),
        alarmReceiver: this.form.alarmReceiver.join(',')
      }
      try {
        if (this.mode === 'Create') {
          await this.$Ads.post('admin/device/saveApi', {
            ...form,
            saveType: 'add'
          })
        } else {
          await this.$Ads.post('admin/device/saveApi', {
            ...form,
            saveType: 'update'
          })
        }
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
