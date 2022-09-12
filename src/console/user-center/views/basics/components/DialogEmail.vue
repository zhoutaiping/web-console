<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :title="title"
    width="500px"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <template v-if="mode === 'Create'">
        <el-form-item
          label="邮箱"
          prop="mobile"
        >
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="验证码">
          <el-input
            v-model="form.captcha"
            placeholder="验证码"
            style="width: 100px; margin-right: 8px"
          />
          <ButtonCap
            ref="ButtonCap"
            type="primary"
            plain
            @click="fetchEmailCode()"
          >发送验证码</ButtonCap>
        </el-form-item>
      </template>
      <!--  修改 -->
      <template v-else>
        <el-form-item
          label="原手机或邮箱"
          prop="username"
        >
          <el-input
            v-model="form.username"
            placeholder="原手机或邮箱"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="验证码">
          <el-input
            v-model="form.oldCaptcha"
            placeholder="验证码"
            style="width: 100px; margin-right: 8px"
          />
          <ButtonCap
            ref="ButtonCapOld"
            type="primary"
            plain
            @click="fetchOldEmailCode()"
          >发送验证码</ButtonCap>
        </el-form-item>
        <el-divider/>
        <el-form-item
          label="新邮箱"
          prop="newEmail"
        >
          <el-input
            v-model="form.newEmail"
            placeholder="新邮箱"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="验证码">
          <el-input
            v-model="form.newEmailCaptcha"
            placeholder="验证码"
            style="width: 100px; margin-right: 8px"
          />
          <ButtonCap
            ref="ButtonCapNew"
            type="primary"
            plain
            @click="fetchNewEmailCode()"
          >发送验证码</ButtonCap>
        </el-form-item>
      </template>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import ButtonCap from '@/components/Button/ButtonCap'
import qs from 'qs'

export default createDialog({
  components: { ButtonCap },

  data() {
    return {
      title: '',
      formDefault: {
        // 绑定
        email: '',
        captcha: '',
        // 修改
        username: '',
        oldCaptcha: '',
        newEmail: '',
        newEmailCaptcha: ''
      },
      rules: {
        // email: [{
        //   require: true,
        //   trigger: 'blur'
        // }]
      }
    }
  },

  methods: {
    beforeOpen(form) {
      const mode = form.bindEmail === 1 ? 'Edit' : 'Create'
      this.mode = mode
      this.title = mode === 'Create' ? '绑定邮箱' : '修改邮箱'
      if (mode === 'Create') {
        this.$nextTick(() => {
          this.form.email = ''
        })
      }
    },

    async fetchEmailCode() {
      const form = {
        email: this.form.email
      }
      try {
        await this.Fetch.post(`sso/V4/bindEmailSendCap`, qs.stringify(form))
      } catch (e) {
        return
      }
      this.$refs.ButtonCap.startTimer()
      this.Message('ACTION_SUCCESS')
    },

    async fetchOldEmailCode() {
      const form = {
        username: this.form.username
      }
      try {
        await this.Fetch.post(`sso/V4/modifyEmailSendOldCap`, qs.stringify(form))
      } catch (e) {
        return
      }
      this.$refs.ButtonCapOld.startTimer()
      this.Message('ACTION_SUCCESS')
    },

    async fetchNewEmailCode() {
      const form = {
        newEmail: this.form.newEmail
      }
      try {
        await this.Fetch.post(`sso/V4/modifyEmailSendNewEmailCap`, qs.stringify(form))
      } catch (e) {
        return
      }
      this.$refs.ButtonCapNew.startTimer()
      this.Message('ACTION_SUCCESS')
    },

    async fetchSubmit() {
      if (this.mode === 'Create') {
        const form = {
          email: this.form.email,
          captcha: this.form.captcha
        }
        await this.Fetch.post(`sso/V4/bindEmail`, qs.stringify(form))
      } else {
        const form = {
          username: this.form.username,
          oldCaptcha: this.form.oldCaptcha,
          newEmail: this.form.newEmail,
          newEmailCaptcha: this.form.newEmailCaptcha
        }
        await this.Fetch.post(`sso/V4/modifyEmail`, qs.stringify(form))
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
