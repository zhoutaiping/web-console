<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import accessStore from './store/modules/access'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('access', accessStore)
  },

  destroyed() {
    this.$store.unregisterModule('access')
  }
}
</script>
