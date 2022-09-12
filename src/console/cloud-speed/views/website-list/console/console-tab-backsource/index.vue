<template>
  <yd-card-list>
    <!-- 回源设置 -->
    <origin-setting />
    <!--  -->
    <origin-host />
    <CardBackSourceSni />
    <!-- 移动端跳转 -->
    <origin-range />
    <!--  回源请求时长 回源健康检查 回源保持长连接-->
    <origin-domain-proxy-conf />
  </yd-card-list>
</template>

<script>
import OriginSetting from './origin-setting'
import OriginHost from './origin-host'
import OriginRange from './origin-range'
import OriginDomainProxyConf from './origin-domain-proxy-conf'
import CardBackSourceSni from './CardBackSourceSni'
import domainMixins from '@/mixins/domain'

export default {
  components: {
    OriginHost,
    OriginSetting,
    OriginRange,
    OriginDomainProxyConf,
    CardBackSourceSni
  },

  mixins: [domainMixins],

  mounted() {
    this.domainFetchSettings(['back_source_host', 'domain_proxy_conf', 'slice', 'back_source_sni'])
  }
}
</script>
