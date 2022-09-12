<template>
  <yd-card
    horizontal
    title="移动端跳转"
  >
    <template slot="tips">将来自移动终端的请求自动重定向到指定的URL</template>
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="handleUpdateStatus()"
    />
    <yd-alert>输入跳转后的URL，以http(https)开头</yd-alert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <el-form-item
        label="跳转后 URL"
        prop="jump_url"
      >
        <el-input
          v-model="form.jump_url"
          placeholder="http://www.demo.com"
          style="width: 280px"
          @blur="handleUpdateUrl"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import RULE from '@/utils/verify'
import SelectSwitch from '@/components/Select/SelectSwitch'
import panelMixins from '../panelMixins'

export default {
  name: 'MobileJump',

  components: { SelectSwitch },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'mobile_jump',
      formDefault: {
        status: '',
        jump_url: ''
      },
      rules: {
        jump_url: {
          required: true,
          pattern: RULE.defaultUrl,
          message: '格式有误',
          trigger: 'blur'
        }
      }
    }
  },

  methods: {
    async handleUpdateStatus() {
      const form = this.form
      if (form.status === 'on' && !form.jump_url) return
      this.fetchUpdate()
    },

    async handleUpdateUrl() {
      this.$refs.Form.validate(valid => {
        if (!valid) return
        this.fetchUpdate()
      })
    }
  }
}
</script>
