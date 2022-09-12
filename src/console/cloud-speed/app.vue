<template>
  <div v-if="moduleLabel['cloud-speed']">
    <router-view />
  </div>
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import batchStore from './store/modules/batch'
import reportStore from './store/modules/report'
import wafStore from '@/console/red-guard/store/modules/waf'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  async created() {
    this.$store.registerModule('batch', batchStore)
    this.$store.registerModule('cdnReport', reportStore)
    this.$store.registerModule('waf', wafStore)
    this.fetchModuleLabel('cloud-speed')
  },

  destroyed() {
    this.$store.unregisterModule('cdnReport')
    this.$store.unregisterModule('batch')
    this.$store.unregisterModule('waf')
  }
}
</script>
