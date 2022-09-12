<style lang="scss" scoped>
.show404 {
  img {
    width: 100%;
  }
}
</style>

<template>
  <div>
    <DmAlert>
      启用源站错误页面，当出错时直接返回源站错误页面<br> 当启用自定义 HTML 模式，可以通过编辑 HTML 代码来自定义 404 页面，代码中不能包含 JS
    </DmAlert>
    <el-form
      v-if="form.status === 'custom'"
      ref="Form"
      :model="form"
      :rules="formRules">
      <el-form-item prop="content">
        <el-input
          v-model="form.content"
          :rows="8"
          type="textarea"
          placeholder="<h1></h1>"
        />
      </el-form-item>
    </el-form>
    <div v-if="form.status === 'app404'">
      <div class="show404">
        <img
          src="../../../../assets/images/console/404.png"
          alt="404"
        >
      </div>
    </div>
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
        selectStatus: SELECT.PAGE_404
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
