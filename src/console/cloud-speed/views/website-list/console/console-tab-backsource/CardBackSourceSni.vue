<template>
  <yd-card
    horizontal
    title="回源 SNI"
  >
    <template slot="tips">当业务源站IP绑定多个域名且CDN节点以HTTPS协议访问源站时，必须指定访问的具体域名</template>
    <yd-form-select
      slot="action"
      :selects="selectStatus"
      v-model="form.back_source_sni"
      @change="handleUpdateStatus"
    />
    <el-form
      v-if="form.back_source_sni === 'diy'"
      ref="Form"
      label-position="left"
      label-width="120px"
      :model="form"
      :rules="formRules"
    >
      <el-form-item
        label="自定义SNI"
        prop="proxy_sni"
      >
        <el-input
          v-model="form.proxy_sni"
          style="width: 200px"
          placeholder="自定义SNI"
          @blur="handleUpdateSni"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import RULE from '@/utils/verify'
import { validator } from '@/utils/validator'
import panelMixins from '../panelMixins'

export default {
  name: 'BackSourceSni',

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'back_source_sni',
      selectStatus: [
        {
          label: 'OFF',
          value: 'off'
        },
        {
          label: '自定义',
          value: 'diy'
        }
      ],
      formRules: {
        proxy_sni: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validator(RULE.domain) }
        ]
      },
      formDefault: {
        back_source_sni: 'off',
        proxy_sni: ''
      },
    }
  },

  methods: {
    async handleUpdateSni() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })
      this.fetchUpdate()
    },
    async handleUpdateStatus(value) {
      if (value === 'diy' && !this.form.proxy_sni) {
        return
      } else {
        this.fetchUpdate()
      }
    }
  }
}
</script>
