<template>
  <ConsolePageLayout :tabs="navbar">
    <router-view />
    <DmBottomAction v-if="$route.name !== 'anti-ddos.router.settings__id__waf'">
      <el-button
        :loading="saveLoading"
        type="primary"
        @click="hanldeSave"
      >保存</el-button>
    </DmBottomAction>
  </ConsolePageLayout>
</template>

<script>
import DmBottomAction from '@/components/Dm/DmBottomAction'
import adsMixins from '../../mixins/ads'

export default {
  components: { DmBottomAction },

  mixins: [adsMixins],

  data() {
    return {
      saveLoading: false,
      navbar: [
        {
          name: 'anti-ddos.router.settings__id__tcp'
        },
        {
          name: 'anti-ddos.router.settings__id__udp'
        },
        {
          name: 'anti-ddos.router.settings__id__icmp'
        },
        {
          name: 'anti-ddos.router.settings__id__dns'
        },
        {
          name: 'anti-ddos.router.settings__id__other'
        },
        {
          name: 'anti-ddos.router.settings__id__bwlist'
        },
        {
          name: 'anti-ddos.router.settings__id__geo'
        },
        {
          name: 'anti-ddos.router.settings__id__threat'
        },
        {
          name: 'anti-ddos.router.settings__id__waf'
        }
      ]
    }
  },

  mounted() {
    this.ADS_SET_SETTINGS({ uuid: this.$route.params.id, defenseGroupId: this.$route.query.defenseGroupId })
    this.adsFetchSettings(this.$route.params.id)
  },

  methods: {
    async hanldeSave() {
      this.saveLoading = true
      const vm = this
      try {
        await this.adsFetchSaveSettings({ vm })
      } catch (e) {
        return
      } finally {
        this.saveLoading = false
      }
    }
  }
}
</script>
