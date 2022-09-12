<template>
  <yd-card
    horizontal
    title="支持TLS版本"
  >
    <SelectSwitch
      slot="action"
      :value="status"
      on-value="on"
      off-value="off"
      @change="fetchUpdateStatus"
    />
    <template slot="tips">安全传输层协议（TLS）用于在两个通信应用程序之间提供保密性和数据完整性</template>
    <yd-alert>
      <p>TLS版本从低到高有四种，请结合安全性和客户端兼容性谨慎配置</p>
      <p>SSLv3：存在严重的安全漏洞，仅兼容非常古老的客户端，强烈不推荐使用</p>
      <p>TLSv1.0：有一定安全风险，已不符合PCI DSS合规判定标准</p>
      <p>TLSv1.1：2006年发布，修复TLSv1.0若干漏洞，并且引入了TLS 扩展</p>
      <p>TLSv1.2：加强了密码套件的扩展性，更好的安全性，更快的密码学算法，支持HTTP 2，目前广泛使用的版本</p>
    </yd-alert>
    <el-form
      :model="form"
      label-position="right"
      label-width="120px"
    >
      <el-form-item label="支持的最小TLS版本">
        <yd-form-select
          :selects="MIN_VERSION"
          v-model="form.min_version"
          @change="fetchUpdate"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import panelMixins from '../panelMixins'
import SELECT from '../../../../constant/select'
export default {
  name: 'TSL',

  components: { SelectSwitch },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'min_version',
      formDefault: {
        status: 'off',
        min_version: 'TLSv1.0'
      },
      selectCA: [],
      form: {},
      MIN_VERSION: SELECT.MIN_VERSION
    }
  },

  computed: {
    status() {
      const { status } = this.form
      return status || 'off'
    }
  },

  watch: {
    domainSettings: {
      deep: true,
      handler() {
        const data = this.domainSettings['min_version'] || {}
        this.form = {
          ...this.formDefault,
          ...data
        }
      }
    }
  },

  methods: {

    fetchUpdateStatus(status) {
      const form = this.form
      form.status = status === 'off' ? 'off' : 'on'
      this.fetchUpdate()
    },

    async fetchUpdate() {
      const send = this.form
      try {
        await this.domainSaveSettings({ 'min_version': send })
      } catch (e) {
        return
      }
      this.domainFetchSettings('min_version')
      this.Message('ACTION_SUCCESS')
    }
  }
}
</script>

