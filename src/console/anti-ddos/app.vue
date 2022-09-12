<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import adsStore from './store/ads'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('ads', adsStore)
  },

  destroyed() {
    this.$store.unregisterModule('ads')
  }
}
</script>
