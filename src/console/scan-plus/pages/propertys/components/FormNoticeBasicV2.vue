<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-position="top"
    label-width="100px"
  >
    <DmAlert class="margin-top">
      通知冷却时间：同URL下同类型事件将在设置时间段内不重复告警
    </DmAlert>
    <el-form-item
      prop="alarmType"
      label="告警方式"
    >
      <yd-form-checkbox
        :checks="NOTICE_TYPE"
        v-model="form.alarmType"
        @change="handleChangeAlarmType"
      />
    </el-form-item>
    <el-form-item
      v-show="form.alarmType.length"
      label="每日最大通知次数"
    >
      <el-input-number
        v-model="form.dayMaxNoticeNum"
        :min="0"
        :max="10000"
        :precision="0"
        :controls="false"
      /> <span>（0 为不限制次数）</span>
    </el-form-item>
    <el-form-item class="item-box">
      <span
        slot="label"
        style="font-size:14px;"
      >通知冷却时间</span>
      <el-form-item
        label="篡改监控"
        class="item-box-inline"
      >
        <el-input-number
          v-model="form.tamperCoolingTime"
          :disabled="!pform.tamper"
          :min="0"
          :max="10000"
          :precision="0"
          :controls="false"
        /> <span>小时</span>
      </el-form-item>
      <el-form-item
        label="敏感词监控"
        class="item-box-inline"
      >
        <el-input-number
          v-model="form.sensitiveWordCoolingTime"
          :disabled="!pform.sensitiveWord"
          :min="0"
          :max="10000"
          :precision="0"
          :controls="false"
        /> <span>小时</span>
      </el-form-item>
      <el-form-item
        label="关键词监控"
        class="item-box-inline"
      >
        <el-input-number
          v-model="form.keywordCoolingTime"
          :disabled="!pform.keyword"
          :min="0"
          :max="10000"
          :precision="0"
          :controls="false"
        /> <span>小时</span>
      </el-form-item>
      <el-form-item
        label="恶意链接监控"
        class="item-box-inline"
      >
        <el-input-number
          v-model="form.darkChainCoolingTime"
          :disabled="!pform.darkChain"
          :min="0"
          :max="10000"
          :controls="false"
        /> <span>小时</span>
      </el-form-item>
      <el-form-item
        label="异常状态码监控"
        class="item-box-inline"
      >
        <el-input-number
          v-model="form.statusCodeCoolingTime"
          :disabled="!pform.statusCode"
          :min="0"
          :max="10000"
          :controls="false"
        /> <span>小时</span>
      </el-form-item>
      <el-form-item
        label="风险外链监控"
        class="item-box-inline"
      >
        <el-input-number
          v-model="form.outerInspectCoolingTime"
          :min="0"
          :disabled="!pform.outerInspect"
          :max="10000"
          :controls="false"
        /> <span>小时</span>
      </el-form-item>
    </el-form-item>
    <el-form-item
      label="消息接收人"
      prop="alarmReceiver"
    >
      <SelectMultiple
        v-model="form.alarmReceiver"
        :checks="selectNumber"
        :default-check="false"
        width="300px"
        item-name="用户"
      />
    </el-form-item>
    <el-form-item
      prop="notDisturbTime"
      label="免打扰时间"
    >
      <el-time-picker
        v-model="notDisturbTime"
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
import form from '../../../../../mixins/form'

export default {
  components: { SelectMultiple },

  props: {
    uuid: String,
    pform: Object
  },

  data() {
    return {
      LABEL,
      rules: {},
      notDisturbTime: [],
      NOTICE_TYPE: [
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
        alarmType: [],
        alarmReceiver: [],
        dayMaxNoticeNum: 5,
        tamperCoolingTime: 0,
        sensitiveWordCoolingTime: 0,
        keywordCoolingTime: 0,
        darkChainCoolingTime: 0,
        statusCodeCoolingTime: 0,
        outerInspectCoolingTime: 0
      },
      form: {},
      selectNumber: []
    }
  },
  watch: {
    pform: {
      handler(val) {
        if (!val.tamper) this.form.tamperCoolingTime = 0
        if (!val.sensitiveWord) this.form.sensitiveWordCoolingTime = 0
        if (!val.keyword) this.form.keywordCoolingTime = 0
        if (!val.statusCode) this.form.statusCodeCoolingTime = 0
        if (!val.darkChain) this.form.darkChainCoolingTime = 0
        if (!val.outerInspect) this.form.outerInspectCoolingTime = 0
      },
      deep: true
    }
  },
  created() {
    this.init()
    this.form = deepClone(this.formDefault)
    this.notDisturbTime = ['', '']
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
    handleChangeAlarmType() {
      if (this.form.alarmType.length === 0) {
        this.form.dayMaxNoticeNum = 5
      }
    },
    restForm() {
      this.form = deepClone(this.formDefault)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    setForm(form) {
      this.restForm()
      if (form.freeTimeStart && form.freeTimeEnd) {
        this.notDisturbTime = [form.freeTimeStart, form.freeTimeEnd]
      }
      Object.assign(this.form, form)
    },

    getForm() {
      this.$refs.form.validate(valid => {
        if (!valid) throw new Error()
      })
      const [freeTimeStart, freeTimeEnd] = this.notDisturbTime || []
      const form = {
        ...this.form,
        freeTimeStart,
        freeTimeEnd
      }
      return form
    }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  margin-bottom: 0;
}
.item-box-inline {
  display: inline-block;
  width: 50%;
  span {
    margin-left: 10px;
  }
}
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
