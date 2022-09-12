<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="500px"
    title="设置"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-position="right"
      label-width="120px"
    >
      <el-form-item
        label="通知方式"
        prop="name"
      >
        <yd-form-checkbox
          v-model="form.notice_type"
          :checks="Select.RemindType"
        />
      </el-form-item>
      <el-form-item
        label="消息接收人"
        prop="name"
      >
        <SelectMultiple
          v-model="form.notice_receive"
          :checks="selectNumber"
          :default-check="false"
          width="300px"
          item-name="接收人"
        />
      </el-form-item>
      <el-form-item
        label="通知时间"
        prop="name"
      >
        <yd-form-select
          v-model="noticeType"
          :selects="Select.NoticTime"
          style="width: 100px; margin-right: 12px"
          @change="handleChangeNoticeTime"
        />
        <yd-form-select
          v-if="noticeType === 'Week'"
          v-model="form.notice_time"
          :selects="Select.Week"
          style="width: 100px"

        />
        <p v-if="['Week', 'Day'].includes(noticeType)">默认每天早上9点发送通知</p>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import SelectMultiple from '@/components/Select/SelectMultiple'
import Select from '../select'

export default createDialog({
  components: { SelectMultiple },

  data() {
    return {
      Select,
      noticeType: '',
      formDefault: {},
      formRules: {}
    }
  },

  methods: {
    async initOptions(form, options) {
      await this.fetchNumber()
      if (['Hour', 'Day'].includes(form.notice_time)) {
        this.noticeType = form.notice_time
      } else {
        this.noticeType = 'Week'
      }
    },

    async fetchNumber() {
      const data = await this.Fetch.get('V4/cloud.monitor.alertSetting.config')
      this.selectNumber = data.receivers_list.map(_ => {
        return {
          value: _.value,
          label: _.name
        }
      })
    },

    handleChangeNoticeTime(val) {
      if (val === 'Week') {
        this.form.notice_time = 'Mon'
      }
    },

    async fetchSubmit() {
      const form = {
        ...this.form
      }

      if (this.noticeType !== 'Week') {
        form.notice_time = this.noticeType
      }
      await this.Fetch.post('V4/soc.notice.set', form)
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
