<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import messageList from './store/messageList'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('messageList', messageList)
  },

  destroyed() {
    this.$store.unregisterModule('messageList')
  }
}
</script>
