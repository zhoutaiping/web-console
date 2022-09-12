<template>
  <div>
    <DmAlert>
      <p>可根据业务需求，允许或禁止特定区域的终端用户对网站资源的访问。</p>
      <p>开启白名单后只允许白名单中地区访问，开启黑名单后只禁止黑名单中 地区访问域名。</p>
      <p>支持按国家、省市维度进行配置</p>
    </DmAlert>
    <el-form
      v-show="form.status === 'on'"
      ref="Form"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <!-- <el-form-item
        v-if="isBatch"
        label="添加方式"
      >
        <yd-form-radio
          v-model="formBatch._pmode"
          :radios="SELECT.EDIT_TYPE_M2"
        />
      </el-form-item> -->
      <el-form-item label="屏蔽模式">
        <yd-form-radio
          v-model="mode"
          :radios="addReserved(selectType, 'keep', isBatch)"
          @change="handleChangeMode"
        />
      </el-form-item>
      <el-form-item label="选择区域">
        <InputArea
          v-model="data.data"
          style="width: 400px; display: inline-block; margin-right: 12px"
        />
      </el-form-item>
      <el-form-item label="启用访问时间控制">
        <el-checkbox v-model="enableTime" />
      </el-form-item>
      <el-form-item
        v-if="enableTime"
        label="选择时间"
      >
        <InputWeekTime
          v-model="data.timeData"
          style="margin-right: 12px; display: inline-block"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import SelectRegion from '@/components/Select/SelectRegion'
import InputArea from '@/components/Input/InputArea'
import InputWeekTime from '@/components/Input/InputWeekTime'
import baseMixins from './base'
import SELECT from '../../constant/select'

export default {
  components: { SelectRegion, InputArea, InputWeekTime },

  mixins: [baseMixins],

  data() {
    return {
      SELECT,
      config: {
        selectStatus: [
          {
            value: 'off',
            label: 'OFF'
          },
          {
            value: 'on',
            label: 'ON'
          }
        ]
      },
      selectType: [
        {
          label: '白名单模式',
          value: 'white'
        },
        {
          label: '黑名单模式',
          value: 'black'
        }
      ],
      mode: 'white',
      enableTime: false,
      data: {
        id: '',
        data: [],
        timeData: {
          weeks: [],
          req_time: ''
        }
      },
      form: {},
      formDefault: {
        status: 'off'
      },
      formBatch: {
        _pmode: 'append'
      }
    }
  },

  created() {
    this.initConfig()
    this.setForm()
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    setForm(form = {}) {
      const ruleData = form.policy
      const data = {
        id: '',
        logic: 'not_belongs',
        data: [],
        timeData: {
          weeks: [],
          req_time: ''
        }
      }

      if (ruleData) {
        const { rules = [] } = ruleData
        data.id = ruleData.id

        rules.forEach(item => {
          const { rule_type, logic } = item
          this.mode = logic === 'not_belongs' ? 'white' : 'black'
          data.logic = logic
          if (rule_type === 'region') {
            data.data = item.data
          } else {
            data.timeData = item.data
            this.enableTime = true
          }
        })
      }
      this.data = data

      this.form = {
        ...this.formDefault,
        ...form
      }
    },
    // 切换黑白模式
    async handleChangeMode() {
      const data = this.data
      data.logic = this.mode === 'white' ? 'not_belongs' : 'belongs'
    },

    formatRuleData(form) {
      const data = {
        action: 'deny',
        type: 'plus',
        sort: 0,
        rules: [
          {
            data: form.data,
            logic: form.logic,
            rule_type: 'region'
          }
        ]
      }

      if (this.enableTime) {
        data.rules.push({
          data: form.timeData,
          logic: form.logic,
          rule_type: 'req_time'
        })
      }
      return data
    },

    async getForm() {
      if (this.$refs.Form) {
        this.$refs.Form.validate((valid) => {
          if (!valid) throw new Error()
        })
      }

      return {
        ...this.form,
        policy: this.formatRuleData(this.data)
      }
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
