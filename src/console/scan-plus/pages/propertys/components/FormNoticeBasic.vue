<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-position="top"
    label-width="100px"
  >
    <el-form-item
      prop="alert_type"
      label="告警方式"
    >
      <yd-form-checkbox
        :checks="LABEL.NOTICE_TYPE"
        v-model="form.alert_type"
        border
      />
    </el-form-item>
    <el-form-item
      label="消息接收人"
      prop="alert_receivers"
    >
      <SelectMultiple
        v-model="form.alert_receivers"
        :checks="selectNumber"
        :default-check="false"
        width= "300px"
        item-name="用户"
      />
    </el-form-item>
    <el-form-item
      prop="notDisturbTime"
      label="免打扰时间"
    >
      <el-time-picker
        v-model="form.notDisturbTimeRaw"
        style="width: 200px"
        is-range
        format="HH:mm"
        value-format="HH:mm"
        placeholder="请选择免打扰时间范畴"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import LABEL from '../../../constants/label'
import { deepClone } from '@/utils'
import SelectMultiple from '@/components/Select/SelectMultiple'

export default {
  components: { SelectMultiple },

  props: {
    uuid: String
  },

  data() {
    return {
      LABEL,
      rules: {},
      formDefault: {
        alert_type: [],
        alert_receivers: [],
        notDisturbTimeRaw: ''
      },
      form: {},
      selectNumber: []
    }
  },

  created() {
    this.init()
    this.form = deepClone(this.formDefault)
  },

  methods: {
    async init() {
      const data = await this.Fetch.get('V4/cloud.monitor.alertSetting.config')
      this.selectNumber = data.receivers_list.map(_ => {
        return {
          value: _.value,
          label: _.name
        }
      })
    },

    restForm() {
      this.form = deepClone(this.formDefault)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    setForm(form) {
      this.restForm()
      Object.assign(this.form, form)
    },

    getForm() {
      this.$refs.form.validate(valid => {
        if (!valid) throw new Error()
      })
      const [not_disturb_start_time, not_disturb_end_time] = this.form.notDisturbTimeRaw || []
      const form = {
        ...this.form,
        not_disturb_start_time,
        not_disturb_end_time
      }
      return form
    }
  }
}
</script>
