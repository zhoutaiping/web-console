<template>
  <div>
    <DmAlert>
      输入跳转后的URL，以http(https)开头
    </DmAlert>
    <template v-if="form.status === 'on'">
      <el-form
        ref="Form"
        :model="form"
        :rules="formRules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          label="跳转后 URL"
          prop="jump_url"
        >
          <el-input
            v-model="form.jump_url"
            placeholder="请输入内容"
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
import SELECT from '../../constant/select'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: SELECT.SWITCH_M2
      },
      formDefault: {
        status: 'off',
        jump_url: ''
      },
      formRules: {
        jump_url: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validator(RULE.defaultUrl) }
        ]
      }
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
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
        ...this.form,
        _policy: this.form.status
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
