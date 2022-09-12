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
          label="手机号码"
          prop="mobile"
        >
          <el-input
            v-model="form.mobile"
            placeholder="手机号码"
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
            @click="fetchPhoneCode()"
          >发送验证码</ButtonCap>
        </el-form-item>
      </template>
      <!--  修改手机号码 -->
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
            @click="fetchOldPhoneCode()"
          >发送验证码</ButtonCap>
        </el-form-item>
        <el-divider/>
        <el-form-item
          label="新手机号"
          prop="newMobile"
        >
          <el-input
            v-model="form.newMobile"
            placeholder="新手机号"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="验证码">
          <el-input
            v-model="form.newMobileCaptcha"
            placeholder="验证码"
            style="width: 100px; margin-right: 8px"
          />
          <ButtonCap
            ref="ButtonCapNew"
            type="primary"
            plain
            @click="fetchNewPhoneCode()"
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
        // 绑定手机
        mobile: '',
        captcha: '',
        // 修改手机
        username: '',
        oldCaptcha: '',
        newMobile: '',
        newMobileCaptcha: ''
      },
      rules: {
        newMobile: [{
          require: true,
          trigger: 'blur'
        }]
      }
    }
  },

  methods: {
    beforeOpen(form) {
      const mode = form.bindMobile === 1 ? 'Edit' : 'Create'
      this.mode = mode
      this.title = mode === 'Create' ? '绑定手机' : '修改手机号码'
    },

    async fetchPhoneCode() {
      const form = {
        mobile: this.form.mobile
      }
      try {
        await this.Fetch.post(`sso/V4/bindMobileSendCap`, qs.stringify(form))
      } catch (e) {
        return
      }
      this.$refs.ButtonCap.startTimer()
      this.Message('ACTION_SUCCESS')
    },

    async fetchOldPhoneCode() {
      const form = {
        username: this.form.username
      }
      try {
        await this.Fetch.post(`sso/V4/modifyMobileSendOldCap`, qs.stringify(form))
      } catch (e) {
        return
      }
      this.$refs.ButtonCapOld.startTimer()
      this.Message('ACTION_SUCCESS')
    },

    async fetchNewPhoneCode() {
      const form = {
        newMobile: this.form.newMobile
      }
      try {
        await this.Fetch.post(`sso/V4/modifyMobileSendNewMobileCap`, qs.stringify(form))
      } catch (e) {
        return
      }
      this.$refs.ButtonCapNew.startTimer()
      this.Message('ACTION_SUCCESS')
    },

    async fetchSubmit() {
      if (this.mode === 'Create') {
        const form = {
          mobile: this.form.mobile,
          captcha: this.form.captcha
        }
        await this.Fetch.post(`sso/V4/bindMobile`, qs.stringify(form))
      } else {
        const form = {
          username: this.form.username,
          oldCaptcha: this.form.oldCaptcha,
          newMobile: this.form.newMobile,
          newMobileCaptcha: this.form.newMobileCaptcha
        }
        await this.Fetch.post(`sso/V4/modifyMobile`, qs.stringify(form))
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
