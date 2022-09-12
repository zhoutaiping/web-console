<template>
  <yd-card-list>
    <CardCloudWaf
      v-if="domainPlanInfo.meal_flag"
      :is-init="info.ready"
      :edit-confirm="info.hasTpl"
      :info="info"
      :is-support="true"
    />
    <CardWebshell
      :edit-confirm="info.hasTpl"
      :info="info"
      :is-init="info.ready"
      :is-support="true"
    />
    <CardWebHoney
      :edit-confirm="info.hasTpl"
      :info="info"
      :is-init="info.ready"
      :is-support="packageConfig.includes('honeypot')"
    />
    <CardWafIntercept
      :edit-confirm="info.hasTpl"
      :info="info"
      :is-init="info.ready"
      :is-support="true"
    />
  </yd-card-list>
</template>

<script>
import domainMixins from '@/mixins/domain'
import CardCloudWaf from './components/CardCloudWaf'
import CardWebshell from './components/CardWebshell'
import CardWebHoney from './components/CardWebHoney'
import CardWafIntercept from './components/CardWafIntercept'
import CardSettingItem from '../../../../components/CardSettingItem'

export default {
  components: {
    CardCloudWaf,
    CardWebshell,
    CardWebHoney,
    CardWafIntercept,
    CardSettingItem
  },

  mixins: [domainMixins],

  props: {
    info: Object,
    packageConfig: Array
  },

  computed: {
    loading() {
      return this.domainSettingsLoading || !this.info.ready
    }
  },

  mounted() {
    this.domainFetchSettings(['cloud_waf', 'web_honeypot', 'waf_block_diy_page'])
  }
}
</script>
