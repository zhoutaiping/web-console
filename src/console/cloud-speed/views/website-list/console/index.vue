<template>
  <ConsolePageLayout :tabs="tabOptions">
    <DmAlert v-if="domainInfo.hasTpl">
      该业务已绑定至配置模板：<strong>{{ domainInfo.cdntpl_name }}</strong>，模板中存在防护配置无法同步至该网站，且修改配置会自动解除与模板的绑定关系
    </DmAlert>
    <router-view
      v-if="domainInfoReady && domainPlanInfoReady"
      :info="domainInfo"
      :package-config="domainPlanConfig"
    />
    <teamplate v-else>
      <CardItemForm loading style="height: 200px" />
      <CardItemForm loading style="height: 200px" />
    </teamplate>
  </ConsolePageLayout>
</template>

<script>
import domainMixins from '@/mixins/domain'
import wafMixins from '@/console/red-guard/mixins/waf'

export default {
  mixins: [domainMixins, wafMixins],

  data() {
    return {
      tabOptions: [
        {
          name: 'cloud-speed.router.websiteList__console__backsource'
        },
        {
          name: 'cloud-speed.router.websiteList__console__perform'
        },
        {
          name: 'cloud-speed.router.websiteList__console__pages'
        },
        {
          title: '应用安全',
          name: 'cloud-speed.router.websiteList__applicationSecurity'
        },
        {
          title: '内容安全',
          name: 'cloud-speed.router.websiteList__contentSecurity'
        },
        {
          title: '业务安全',
          name: 'cloud-speed.router.websiteList__businessSecurity'
        },
        {
          title: '精准访问控制',
          name: 'cloud-speed.router.websiteList__waf'
        },
        {
          title: '网络安全',
          name: 'cloud-speed.router.websiteList__networkSecurity'
        }
      ]
    }
  },

  async created() {
    const domainId = this.$route.params.id
    this.DOMAIN_SET_ID(domainId)
    this.domainFetchInfo()
    this.domainFetchPlanInfo()
    this.WAF_SET_DOMAIN_ID(domainId)
    this.wafFetchSettings({ domainId, type: 'plus' })
  }
}
</script>
