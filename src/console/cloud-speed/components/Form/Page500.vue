<template>
  <div>
    <DmAlert>
      当启用自定义 HTML 模式，可以通过编辑 HTML 代码自定义 500 页面，代码中不能包含 JS
    </DmAlert>
    <el-form
      v-if="form.status === 'custom'"
      ref="Form"
      :model="form"
      :rules="formRules"
    >
      <el-form-item prop="content">
        <el-input
          v-model="form.content"
          :autosize="{ minRows: 10, maxRows: 20}"
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
import SELECT from '../../constant/select'

const STATUS_DEFAULT = 'origin'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: SELECT.PAGE_500
      },
      formDefault: {
        status: STATUS_DEFAULT,
        content: '',
        type: STATUS_DEFAULT
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

      return {
        ...this.form,
        type: this.form.status
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
