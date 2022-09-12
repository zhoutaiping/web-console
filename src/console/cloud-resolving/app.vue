<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import dnsMixins from './store/dns'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('dns', dnsMixins)
  },

  destroyed() {
    this.$store.unregisterModule('dns')
  }
}
</script>
