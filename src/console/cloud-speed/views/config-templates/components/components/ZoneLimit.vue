<template>
  <yd-card>
    <p slot="tips">可根据业务需求，允许或禁止特定区域的终端用户对网站资源的访问</p>
    <yd-form-select
      slot="action"
      v-model="form.status"
      :selects="STATUS_TYPE"
    />
    <DmAlert>
      <p>可根据业务需求，允许或禁止特定区域的终端用户对网站资源的访问。</p>
      <p>开启白名单后只允许白名单中地区访问，开启黑名单后只禁止黑名单中 地区访问域名。</p>
      <p>支持按国家、省市维度进行配置</p>
    </DmAlert>
    <el-form
      v-show="form.status !== 'off'"
      ref="Form"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="屏蔽模式">
        <el-radio-group
          v-model="mode"
          @change="handleChangeMode"
        >
          <el-radio label="white">白名单模式</el-radio>
          <el-radio label="black">黑名单模式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择区域">
        <InputArea
          v-model="data.data"
          style="width: 400px; display: inline-block; margin-right: 12px"
        />
      </el-form-item>
      <!--  -->
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
  </yd-card>
</template>

<script>
import SelectRegion from '@/components/Select/SelectRegion'
import InputArea from '@/components/Input/InputArea'
import InputWeekTime from '@/components/Input/InputWeekTime'

export default {
  components: { SelectRegion, InputArea, InputWeekTime },

  data() {
    return {
      STATUS_TYPE: [
        {
          value: 'off',
          label: 'OFF'
        },
        {
          value: 'on',
          label: 'ON'
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
      form: {
        status: 'off'
      }
    }
  },

  methods: {
    setForm(form) {
      this.form.status = form.status ? form.status : 'off'
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
        rules: [
          {
            data: form.data,
            logic: form.logic,
            rule_type: 'region',
            sort: 99
          }
        ]
      }

      if (this.enableTime) {
        data.rules.push({
          data: form.timeData,
          logic: form.logic,
          rule_type: 'req_time',
          sort: 99
        })
      }
      return data
    },

    getForm() {
      return {
        policy: this.formatRuleData(this.data),
        ...this.form
      }
    }
  }
}
</script>
