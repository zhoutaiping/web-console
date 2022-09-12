<template>
  <div>
    <template v-if="form.back_source_host === 'diy'">
      <el-form
        ref="Form"
        :model="form"
        :rules="formRules"
        label-position="left"
        label-width="120px"
        class="margin-top"
      >
        <el-form-item
          label="自定义域名"
          prop="diy_host"
        >
          <el-input
            v-model="form.diy_host"
            style="width: 200px"
            placeholder="www.demo.com"
          />
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import RULE from '@/utils/verify'
import baseMixins from './base'
function validatorValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    if (RULE.domain.test(value) || RULE.domainWithPort.test(value)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  return _validator
}
export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: [
          {
            'value': 'default',
            'label': '默认'
          },
          {
            'value': 'diy',
            'label': '自定义'
          }
        ]
      },
      formDefault: {
        back_source_host: 'default',
        diy_host: ''
      },
      formRules: {
        diy_host: {
          required: true,
          validator: validatorValue(),
          message: '格式有误',
          trigger: 'blur'
        }
      }
    }
  },

  methods: {
    setStatus(value) {
      console.log(value)
      this.form.status = value
      this.form.back_source_host = value
    },

    setForm(form = {}) {
      this.form = {
        ...this.formDefault,
        ...form
      }
    },

    getForm() {
      this.$refs.Form && this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      return {
        ...this.form
        // _policy: this.form.status
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
