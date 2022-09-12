<template>
  <div>
    <el-form
      v-if="form.status === 'on'"
      ref="Form"
      :model="data"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item
        v-if="isBatch"
        label="添加方式"
      >
        <yd-form-radio
          v-model="formBatch._pmode"
          :radios="SELECT.EDIT_TYPE_M2"
        />
      </el-form-item>
      <el-form-item label="防盗链设置">
        <yd-form-radio
          v-model="mode"
          :radios="addReserved(selectType, 'keep', isBatch)"
        />
      </el-form-item>
      <el-form-item
        v-if="['white', 'black'].includes(mode)"
        prop="data"
      >
        <InputMultiple
          v-model="data.data"
          style="width: 300px; margin-right: 12px; display: inline-block"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import InputMultiple from '@/components/Input/InputMultiple'
import RULE from '@/utils/verify'
import { SUFFIX_LIST } from '@/constants/suffix'
import { addReserved } from '@/utils/form'
import baseMixins from './base'
import SELECT from '../../constant/select'

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

  mixins: [baseMixins],

  data() {
    return {
      SELECT,
      config: {
        selectStatus: [
          {
            label: 'OFF',
            value: 'off'
          },
          {
            label: 'ON',
            value: 'on'
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
      form: {},
      formDefault: {
        status: 'off'
      },
      formBatch: {
        _pmode: 'append'
      },
      mode: 'white',
      data: {
        id: '',
        logic: '',
        data: []
      },
      rules: {
        data: [{ validator: refererVaildate, trigger: 'blur' }]
      }
    }
  },

  methods: {
    setForm(form = {}) {
      const ruleData = form.policy
      const data = {
        logic: 'not_equals',
        data: []
      }
      if (ruleData && ruleData.rules && ruleData.rules.length) {
        const { rules } = ruleData
        data.id = ruleData.id

        const itemData = rules[0]
        const { logic } = itemData
        this.mode = logic === 'not_equals' ? 'white' : 'black'

        data.logic = logic
        data.data = itemData.data
      }
      this.data = data
      this.form = {
        ...this.formDefault,
        ...form
      }
    },

    setStatus(value) {
      this.form.status = value
    },

    formatRuleData(form) {
      return {
        policy: {
          action: 'deny',
          type: 'plus',
          sort: 0,
          rules: [
            {
              data: form.data,
              logic: this.mode === 'white' ? 'not_equals' : 'equals',
              rule_type: 'referer_domain'
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
    },

    async getForm() {
      if (this.$refs.Form) {
        this.$refs.Form.validate((valid) => {
          if (!valid) throw new Error()
        })
      }

      return {
        ...this.form,
        ...this.formatRuleData(this.data),
        ...this.isBatch ? this.formBatch : {}
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
