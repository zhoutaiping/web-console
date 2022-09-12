<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import wafStore from './store/modules/waf'
import reportStore from '@/console/cloud-speed/store/modules/report'
import selectStore from '@/store/modules/select'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('select', selectStore)
    this.$store.registerModule('waf', wafStore)
    this.$store.registerModule('report', reportStore)
  },

  destroyed() {
    this.$store.unregisterModule('select')
    this.$store.unregisterModule('waf')
    this.$store.unregisterModule('report')
  }
}
</script>

