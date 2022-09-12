<template>
  <yd-dialog
    v-loading
    :class="b()"
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    aside
    aside-type="top"
  >
    <div>
      <FormItemAction>
        将来自移动终端的请求自动重定向到指定的URL
        <yd-form-select
          slot="action"
          v-model="form.status"
          :selects="addReserved(SELECT.SWITCH_M2)"
        />
      </FormItemAction>
      <yd-alert style="margin-top: 12px">
        输入跳转后的URL，以http(https)开头
      </yd-alert>
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item
          v-if="form.status === 'on'"
          label="跳转后 URL"
          prop="jump_url"
        >
          <el-input
            v-model="form.jump_url"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button
        type="text"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="loadingSubmit"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import FormItemAction from '@/components/FormItem/FormItemAction'
import diloagBatch from '../../../../mixins/dialog-batch'
import { validator } from '@/utils/validator'
import RULE from '@/utils/verify'

const FORM = {
  status: '__KEEP__',
  jump_url: ''
}

export default create({
  name: 'dialogMobile',

  mixins: [diloagBatch],

  components: { FormItemAction },

  data() {
    return {
      title: '移动端跳转',
      open: false,
      form: {},
      loadingSubmit: false,
      formRules: {
        jump_url: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validator(RULE.defaultUrl) }
        ]
      }
    }
  },

  methods: {
    handleOpen() {
      this.form = deepClone(FORM)
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        const form = deepClone(this.form)
        if (form.status === '__KEEP__') {
          this.handleClose()
          return
        }
        form._policy = form.status

        const data = {
          id: 'mobile_jump',
          name: 'dialogMobile',
          form
        }
        this.$emit('submit', data)
      })
    }
  }
})
</script>
