<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="800px"
    aside
    title="单点登录页面定制"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-position="left"
      label-width="100px"
    >
      <el-form-item
        label="上传 Logo"
        prop="name"
      >
        <InputUploadIcon
          v-model="form.login_design_logo"
          default-value="https://yundun-statics.yundun.com/baishshanyundun-logo.svg"
          file-key="zero_trust_login_design_logo"
        />
      </el-form-item>
      <el-form-item
        label="标题"
        prop="name"
      >
        <el-input
          v-model="form.login_design_title"
          style="width: 200px"
          placeholder="标题"
        />
      </el-form-item>
      <el-form-item
        label="标题颜色"
        prop="name"
      >
        <SelectColor v-model="form.login_design_text_color" />
      </el-form-item>
      <!-- <el-form-item
        label="背景色"
        prop="name"
      >
        <SelectColor v-model="form.login_design_background_color" />
      </el-form-item> -->
      <el-form-item
        label="背景图"
        prop="name"
      >
        <InputUploadBg
          v-model="form.login_design_background_pic"
          default-value="https://yundunarticle.yundun.com/zero-trust-login-bg.jpg"
          file-key="login_design_background_pic"
        />
      </el-form-item>
    </el-form>
    <el-form label-position="top">
      <el-form-item label="页面预览">
        <LoginPagePreview :data="form" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="text"
          @click="handleReset"
        >恢复默认设置</el-button>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import SelectColor from '@/components/Select/SelectColor'
import InputUploadIcon from '@/components/Input/InputUploadIcon'
import InputUploadBg from '@/components/Input/InputUploadBg'
import LoginPagePreview from './LoginPagePreview'

export default createDialog({
  components: { SelectColor, InputUploadIcon, InputUploadBg, LoginPagePreview },

  data() {
    return {
      formDefault: {
        sso_id: '',
        login_design_logo: 'https://yundun-statics.yundun.com/baishshanyundun-logo.svg',
        login_design_background_pic: 'https://yundunarticle.yundun.com/zero-trust-login-bg.jpg',
        login_design_title: '云盾sso',
        login_design_background_color: '#2991FA',
        login_design_text_color: '#333333'
      }
    }
  },

  methods: {
    async handleReset() {
      const data = await this.Fetch.post('V4/zero.trust.member.sso.save.design.conf', {
        sso_id: this.form.sso_id
      })

      Object.assign(this.form, data)
      this.fetchData()
      // this.Message('ACTION_SUCCESS')
    },

    async fetchData() {
      const res = await this.Fetch.get('V4/zero.trust.member.sso.info')
      this.form = Object.assign(this.form, res)
    },

    async fetchSubmit() {
      try {
        await this.Fetch.post('V4/zero.trust.member.sso.save.design.conf', this.form)
      } catch (e) {
        throw new Error()
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
