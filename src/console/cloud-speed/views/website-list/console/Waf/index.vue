<template>
  <yd-card-list>
    <CardWAF
      v-if="info.ready"
      id="CardWaf"
      :edit-confirm="!!info.cdntpl_id"
      :is-init="!!info.ready"
      :support="true"
    />
    <CardWAFSSL
      v-if="visibleSSL"
      :edit-confirm="info.hasTpl"
      :info="info"
      :is-init="!!info.ready"
      :support="true"
    />
  </yd-card-list>
</template>

<script>
import domainMixins from '@/mixins/domain'
import CardWAF from './components/CardWAF'
import CardWAFSSL from './components/CardWAFSSL'

export default {
  components: {
    CardWAF,
    CardWAFSSL
  },

  mixins: [domainMixins],

  props: {
    info: Object,
    packageConfig: Array
  },

  data() {
    return {
      visibleSSL: false
    }
  },

  computed: {
    loading() {
      return this.domainSettingsLoading || !this.info.ready
    }
  },

  mounted() {
    this.domainFetchSettings(['ssl_acl'])
    this.fetchSettings()
  },

  methods: {
    async fetchSettings() {
      const res = await this.Fetch.get('sso/V4/getOriginLoginUserInfo')
      this.visibleSSL = Boolean(Number(res.fromadmin))
    }
  }
}
</script>
