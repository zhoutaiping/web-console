<template>
  <yd-card
    horizontal
    title="源站设置"
  >
    <template slot="tips">指定回源地址和监听端口，支持回源到IP及域名</template>
    <yd-alert>
      <p>http 协议默认开 80、8080 端口，https 协议默认开 443、8443 端口，不可更改使用<template v-if="!['baishan'].includes(appEnv)">，开通<b>TCP安全加速</b>可支持其他端口</template></p>
      <p>除 80、8080 和 443、8443 端口指定协议外，其他允许使用的非标端口具有优先占用原则</p>
      <p v-if="appName==='westone'">回源到 IP 请填写服务器 IP 地址，回源到域名请填写对应域名（支持一条域名并且不能是源站域名本身及不能是接入我司防护内的域名）</p>
      <p v-else>回源到 IP 请填写服务器 IP 地址，回源到域名请填写对应域名</p>
      <p>使用HTTPS协议请上传 SSL&TLS 并开启 HTTPS，否则将影响站点正常访问</p>
      <p>不支持端口：{{ forbiddenPorts }}</p>
    </yd-alert>
    <TableOriginSettings @forbiddenPorts="handleUpdateSettings" />
  </yd-card>
</template>

<script>
import TableOriginSettings from './components/TableOriginSettings'

export default {
  name: 'OriginSetting',

  components: {
    TableOriginSettings
  },

  data() {
    return {
      forbiddenPorts: ''
    }
  },

  methods: {
    handleUpdateSettings(data) {
      this.forbiddenPorts = data.join(', ')
    }
  }
}
</script>
