<template>
  <yd-card
    horizontal
    title="回源 HOST"
  >
    <template slot="tips">
      自定义性能优化节点取源站数据时所需访问的 WEB 服务器域名
    </template>
    <yd-form-select
      slot="action"
      :selects="moduleLabel['cloud-speed'].originHostOptions"
      v-model="form.back_source_host"
      @change="handleUpdateStatus"
    />
    <yd-alert>默认回源 HOST 为域名本身</yd-alert>
    <el-form
      v-if="form.back_source_host === 'diy'"
      ref="Form"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <el-form-item
        label="自定义域名"
        prop="diy_host"
      >
        <el-input
          v-model="form.diy_host"
          style="width: 200px"
          placeholder="www.demo.com"
          @blur="handleUpdateHost"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import RULE from '@/utils/verify'
import panelMixins from '../panelMixins'
function validatorValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    if (RULE.domain.test(value) || RULE.domainWithPort.test(value)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  return _validator
}
export default {
  name: 'OriginHost',

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'back_source_host',
      formDefault: {
        back_source_host: 'default',
        diy_host: ''
      },
      rules: {
        diy_host: {
          required: true,
          validator: validatorValue(),
          message: '格式有误',
          trigger: 'blur'
        }
      }
    }
  },

  methods: {
    async handleUpdateStatus(value) {
      const data = this.settings
      if (value === 'diy' && !data.diy_host) {
        return
      }
      this.fetchUpdate()
    },

    async handleUpdateHost() {
      this.$refs.Form.validate(valid => {
        if (!valid) return
        this.fetchUpdate()
      })
    }
  }
}
</script>
