<template>
  <div>
    <DmAlert>
      当启用自定义HTML模式，可以通过编辑HTML代码自定义拦截页面，代码中不能包含JS
    </DmAlert>
    <el-form
      v-if="form.status === 'custom'"
      ref="Form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item prop="content">
        <el-input
          :autosize="{ minRows: 10, maxRows: 20}"
          v-model="form.content"
          type="textarea"
          placeholder="<h1></h1>"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import baseMixins from './base'

const STATUS_DEFAULT = 'default'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: [
          {
            value: 'default',
            label: '默认__companyEN__页面'
          },
          {
            value: 'custom',
            label: '自定义HTML'
          }
        ]
      },
      formDefault: {
        status: STATUS_DEFAULT,
        content: ''
      },
      formRules: {
        content: { required: true, message: '请输入' }
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
        status: form.type,
        ...form
      }
    },

    async getForm() {
      this.$refs.Form && this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const status = this.form.status === 'default' ? 'off' : 'on'
      return {
        ...this.form,
        type: this.form.status,
        status
      }
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch),
        statusDefault: STATUS_DEFAULT,
        statusEnv: 'type'
      })
    }
  }
}
</script>
