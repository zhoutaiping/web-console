<template>
  <yd-card>
    <yd-form-select
      slot="action"
      :selects="STATUS_TYPE"
      v-model="form.status"
    />
    <template slot="tips">
      <p>保护网站资源不被外部盗用</p>
    </template>
    <el-form
      v-show="form.status === 'on'"
      ref="Form"
      :model="data"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="防盗链设置">
        <el-radio-group
          v-model="mode"
          @change="handleChangeMode"
        >
          <el-radio label="white">白名单模式</el-radio>
          <el-radio label="black">黑名单模式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="data">
        <InputMultiple
          v-model="data.data"
          style="width: 300px; margin-right: 12px; display: inline-block"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import InputMultiple from '@/components/Input/InputMultiple'
import RULE from '@/utils/verify'
import { SUFFIX_LIST } from '@/constants/suffix'

function refererVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  value.forEach(item => {
    if (!RULE.domainWithPan.test(item) && !RULE.domain.test(item)) {
      callback(new Error('格式不正确'))
    }
  })
  callback()
}

export default {
  components: {
    InputMultiple
  },

  data() {
    return {
      validType: 'domain',
      STATUS_TYPE: [
        {
          label: 'OFF',
          value: 'off'
        },
        {
          label: 'ON',
          value: 'on'
        }
      ],
      form: {
        status: 'off'
      },
      mode: 'white',
      data: {
        id: '',
        logic: 'not_equals',
        data: []
      },
      rules: {
        data: [{ validator: refererVaildate, trigger: 'blur' }]
      }
    }
  },

  methods: {
    setForm(form) {
      this.form.status = form.status || 'off'
      const ruleData = form.policy
      const data = {
        logic: 'not_equals',
        data: []
      }
      if (ruleData) {
        const { rules } = ruleData
        data.id = ruleData.id

        const itemData = rules[0]
        const { logic } = itemData
        this.mode = logic === 'not_equals' ? 'white' : 'black'

        data.logic = logic
        data.data = itemData.data
      }
      this.data = data
    },

    async handleChangeMode() {
      const data = this.data
      data.logic = this.mode === 'white' ? 'not_equals' : 'equals'
    },

    formatRuleData(form) {
      const data = {
        policy: {
          action: 'deny',
          type: 'plus',
          rules: [
            {
              data: form.data,
              logic: form.logic,
              rule_type: 'referer_domain',
              sort: 99
            },
            {
              data: { len: 0 },
              logic: 'len_greater_than',
              rule_type: 'referer'
            },
            {
              // data: SUFFIX_LIST.filter(_ => _.key !== 'web').map(_ => _.list).reduce((total, item) => total + item).split(','),
              data: SUFFIX_LIST.filter(_ => _.key !== 'web').map(_ => _.list).reduce((total, item) => total + ',' + item).split(','),
              logic: 'equals',
              rule_type: 'postfix'
            }
          ]
        }
      }
      return data
    },

    getForm() {
      if (this.$refs.Form) {
        this.$refs.Form.validate((valid) => {
          if (!valid) throw new Error()
        })
      }

      return {
        ...this.formatRuleData(this.data),
        ...this.form
      }
    }
  }
}
</script>
