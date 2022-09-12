<template>
  <div>
    <template v-if="form.back_source_sni === 'diy'">
      <el-form
        ref="Form"
        :model="form"
        :rules="formRules"
        label-position="left"
        label-width="120px"
        class="margin-top"
      >
        <el-form-item
          label="自定义SNI"
          prop="proxy_sni"
        >
          <el-input
            style="width: 200px"
            placeholder="自定义SNI"
            v-model="form.proxy_sni"
          />
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import { validator } from '@/utils/validator'
import RULE from '@/utils/verify'
import baseMixins from './base'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: [
          {
            label: 'OFF',
            value: 'off'
          },
          {
            label: '自定义',
            value: 'diy'
          }
        ]
      },
      formDefault: {
        back_source_sni: 'off',
        proxy_sni: ''
      },
      formRules: {
        proxy_sni: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validator(RULE.domain) }
        ]
      },
    }
  },

  methods: {
    setStatus(value) {
      console.log(value)
      this.form.status = value
      this.form.back_source_sni = value
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
