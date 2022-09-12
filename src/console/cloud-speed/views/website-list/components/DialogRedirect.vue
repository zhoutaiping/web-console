<template>
  <div>
    <DialogForm
      ref="Dialog"
      v-model="form"
      :rules="rules"
      :form-default="formDefault"
      title="显隐性转发"
      cancel-button-type="text"
      aside
      @submit="handleSubmit"
    >
      <template slot="header">
        <yd-alert>
          <p>显隐性转发：将请求自动重定向到指定的URL</p>
          <p>1. 显性转发： 从一个地址 301 重定向到另一个地址</p>
          <p>2. 隐性转发： 类似于显性转发，区别在于隐性转发不会改变地址栏中的域名，开启HTTPS后不支持跳转到非HTTPS URL</p>
          <p>3. 跳转后的URL，以http（https）开头</p>
        </yd-alert>
        <el-alert
          title="开启后控制台功能将不再生效"
          type="warning"
          show-icon
        />
      </template>
      <div
        style="margin-top: 24px"
      >
        <el-form-item label="转发方式">
          <yd-form-radio
            :radios="REDIRECT_TYPE"
            v-model="form._status"
          />
        </el-form-item>
        <el-form-item
          v-if="form._status !== 'off'"
          label="跳转后的URL"
          prop="jump_to"
        >
          <el-input
            v-model="form.jump_to"
            style="width: 300px"
            placeholder="跳转后的url，以http（https）开头"
          />
        </el-form-item>
      </div>
    </DialogForm>
  </div>
</template>

<script>
import DialogForm from '@/components/Dialog/DialogForm'
import consoleDialog from '@/mixins/consoleDialog'

const REDIRECT_TYPE = [
  {
    label: '关闭',
    value: 'off'
  },
  {
    label: '显性转发',
    value: 'explicit'
  },
  {
    label: '隐性转发',
    value: 'implicit'
  }
]
export default {
  components: { DialogForm },

  mixins: [consoleDialog],

  data() {
    return {
      REDIRECT_TYPE,
      rules: {
        // jump_to: [{ validator: validator(RULE.defaultUrl, '地址有误') }]
      },
      formDefault: {
        _status: 'off',
        jump_to: ''
      },
      form: {}
    }
  },

  methods: {
    resetSubmitLoading() {
      this.$refs.Dialog.submitLoading = false
    },

    handleSubmit() {
      this.$emit('submit', this.form)
    }
  }
}
</script>
