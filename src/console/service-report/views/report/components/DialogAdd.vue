<template>
  <yd-dialog
    v-loading
    :class="b()"
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    aside
    aside-type="top"
  >
    <yd-alert style="margin-top: 12px">
      服务套餐中的套餐名称均为用户自定义名称，且保持实时更新。<br >
      内容集合：默认为同一内容集合内的内容做整合分析，若需针对某些内容进行单独的分析。<br >
      请点击“+”为服务类型新增内容集合。
    </yd-alert>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="top"
    >
      <el-form-item
        label="报告名称"
        prop="report_name"
      >
        <el-input
          id="report_name"
          v-model="form.report_name"
          :disabled="form.task"
          style="width: 220px; margin-right: 12px"
          placeholder="报告名称"
        />
        <el-checkbox
          v-model="form.task"
          @change="initPickerOptions"
        >转为每日定时计划</el-checkbox>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="form.task_name"
          :disabled="!form.task"
          style="width: 220px"
          placeholder="选填"
        />
      </el-form-item>
      <el-form-item
        id="daterange"
        :label="form.task ? `指定区间（可选区间：${daterangeTips}）` : '指定区间'"
        prop="daterange"
      >
        <el-date-picker
          v-model="form.daterange"
          :picker-options="pickerOptions"
          :default-time="pickerDefaultTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        />
      </el-form-item>
      <el-form-item
        label="报告内容"
        required
      >
        <FormReportList
          ref="formReportList"
          v-model="form.params"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="text"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import moment from 'moment'
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import DmTable from '@/components/Dm/DmTable'
import Label from '../../../constants/label'
import FormReportList from '../../../components/FormReportList'

const FORM = {
  report_name: '',
  daterange: '',
  task: false,
  task_name: '立即生成',
  startTime: '',
  endTime: '',
  params: {
    webaqjs: [],
    // hwws: [],
    tjkd: []
  }
}

function validateDaterange(startTime, endTime) {
  startTime = Number(startTime)
  endTime = Number(endTime)

  return function(rule, value, callback) {
    const [startVal, endVal] = value
    if (startVal < startTime - 1000) callback(new Error('超出可选区间'))
    if (endVal > endTime) callback(new Error('超出可选区间'))
    callback()
  }
}

export default create({
  name: 'DialogAdd',

  components: { DmTable, FormReportList },

  data() {
    return {
      loading: false,
      Label,
      title: '立即生成',
      open: false,
      daterangeTips: '',
      form: {},
      formRules: {},
      pickerDefaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: {}
    }
  },

  watch: {
    'form.task': function(val) {
      this.form.task_name = val ? '' : '立即生成'
    }
  },

  methods: {
    initReoprtName() {
      const time = moment().format('YYYY-MM-DD HH:mm:ss')
      return `${time}-立即生成`
    },

    initPickerOptions(task) {
      this.formRules.daterange = [
        { type: 'array', required: true, trigger: 'blur', message: '请选择区间' }
      ]

      if (task) {
        const startM = moment().subtract(25, 'hours')
        const endM = moment().subtract(1, 'hours')

        const startTime = startM.format('HH:mm:ss')
        const endTime = endM.format('HH:mm:ss')

        const endDate = endM.format('YYYY-MM-DD')
        const startDate = startM.format('YYYY-MM-DD')

        const endX = endM.format('x')
        const startX = startM.format('x')

        this.daterangeTips = `${startDate} ${startTime} 至 ${endDate} ${endTime}`
        this.pickerDefaultTime = [startTime, endTime]
        this.formRules.daterange.push({
          validator: validateDaterange(startX, endX), trigger: 'blur'
        })
      } else {
        this.pickerDefaultTime = ['00:00:00', '23:59:59']
      }

      this.pickerOptions = Object.assign({}, this.pickerOptionsStart, {
        disabledDate: time => {
          const curDate = Date.now()
          const curDate_2 = new Date('2019-04-01 00:00:00').getTime() // 201090401 到当天（服务报告-立即开通-需求 2019-11-18 改）
          if (task) {
            return time.getTime() > curDate || time.getTime() < curDate - 2 * 8.64e7
          } else {
            // return time.getTime() > curDate || time.getTime() < curDate - 30 * 8.64e7 // 当前前一个月到现在
            return time.getTime() > curDate || time.getTime() < curDate_2 // 20190401 到现在
          }
        }
      })
    },

    handleSubmit() {
      const form = deepClone(this.form)
      if (!this.$refs.formReportList.checkForm()) return
      this.$refs.form.validate((valid, error) => {
        if (valid) {
          form.type = form.task ? 1 : 2
          delete form.task

          if (!form.report_name) form.report_name = this.initReoprtName()

          const [start_time, end_time] = form.daterange
          form.params = JSON.stringify(this.$refs.formReportList.getForm())
          form.start_time = Number(start_time / 1000)
          form.end_time = Number(end_time / 1000)
          delete form.daterange
          this.$emit('submit', form)
        }
      })
    },

    handleOpen(form) {
      this.form = Object.assign(deepClone(FORM), form)
      this.$refs.formReportList && this.$refs.formReportList.initItem()
      this.$nextTick(() => this.$refs.form.clearValidate())
      this.initPickerOptions()
      this.open = true
    },

    handleClose() {
      this.open = false
    }
  }
})
</script>
