<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'

import mealStore from './store/meal'
import packagesStore from './store/packages'
import wafStore from './store/waf'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('meal', mealStore)
    this.$store.registerModule('packages', packagesStore)
    this.$store.registerModule('sdkWaf', wafStore)
  },

  destroyed() {
    this.$store.unregisterModule('meal')
    this.$store.unregisterModule('packages')
    this.$store.unregisterModule('sdkWaf')
  }
}
</script>
