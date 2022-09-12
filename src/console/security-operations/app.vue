<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import consoleStore from '@/console/scan-plus/store/modules/console'
import router from './router'
import config from './config'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('console', consoleStore)
  },

  destroyed() {
    // this.$store.unregisterModule('console')
  }
}
</script>
