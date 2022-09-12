<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import wallStore from './store/modules/wall'
import cwReportStore from './store/cwReport'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('wall', wallStore)
    this.$store.registerModule('cwReport', cwReportStore)
    this.$store.dispatch('getWallConfig')
  },

  destroyed() {
    this.$store.unregisterModule('wall')
    this.$store.unregisterModule('cwReport')
  }
}
</script>

