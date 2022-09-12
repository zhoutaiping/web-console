<template>
  <yd-card-list>
    <CardDefenseRefer
      v-if="!wafLoadingSettings"
      :is-init="!!info.ready"
      :edit-confirm="!!info.cdntpl_id"
      :is-support="true"
    />
    <CardZoneLimit
      v-if="!wafLoadingSettings"
      :is-init="!!info.ready"
      :edit-confirm="!!info.cdntpl_id"
      :is-support="true"
    />
    <CardSourceSafe
      :is-init="!!info.ready"
      :edit-confirm="!!info.cdntpl_id"
      :is-support="true"
    />
    <CardDefenseCC
      :is-init="!!info.ready"
      :edit-confirm="!!info.cdntpl_id"
      :is-support="true"
    />
    <CardIpAnalysis
      v-if="!wafLoadingSettings"
      :is-init="!!info.ready"
      :edit-confirm="!!info.cdntpl_id"
      :is-support="true"
    />
    <CardGuestAuth
      :is-init="!!info.ready"
      :edit-confirm="!!info.cdntpl_id"
      :is-support="packageConfig.includes('guest_auth')"
    />
    <CardBot
      v-if="!wafLoadingSettings"
      :is-init="!!info.ready"
      :edit-confirm="!!info.cdntpl_id"
      :is-support="packageConfig.includes('BOTBehaviorManagement')"
    />
  </yd-card-list>
</template>

<script>
import domainMixins from '@/mixins/domain'
import wafMixins from '@/console/red-guard/mixins/waf'
import CardSourceSafe from './components/CardSourceSafe'
import CardDefenseRefer from './components/CardDefenseRefer'
import CardZoneLimit from './components/CardZoneLimit'
import CardDefenseCC from './components/CardDefenseCC'
import CardGuestAuth from './components/CardGuestAuth'
import CardBot from './components/CardBot'
import CardIpAnalysis from './components/CardIpAnalysis'

export default {
  components: {
    CardSourceSafe,
    CardDefenseRefer,
    CardZoneLimit,
    CardDefenseCC,
    CardGuestAuth,
    CardBot,
    CardIpAnalysis
  },

  mixins: [domainMixins, wafMixins],

  props: {
    info: Object,
    packageConfig: Array
  },

  created() {
    this.wafFetchGroupList()
    this.domainFetchSettings(['anti_cc', 'source_site_protect', 'guest_auth'])
  }
}
</script>
