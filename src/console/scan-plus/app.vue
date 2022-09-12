<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import consoleStore from './store/modules/console'

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
