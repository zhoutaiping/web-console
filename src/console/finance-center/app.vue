<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'

import dialogStore from './store/dialog'
import rechargeStore from './store/recharge'
import orderStore from './store/order'
import invoiceStore from './store/invoice'
import couponStore from './store/coupon'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children
    }
  },

  created() {
    this.$store.registerModule('dialog', dialogStore)
    this.$store.registerModule('recharge', rechargeStore)
    this.$store.registerModule('order', orderStore)
    this.$store.registerModule('invoice', invoiceStore)
    this.$store.registerModule('coupon', couponStore)
  },

  destroyed() {
    this.$store.unregisterModule('dialog')
    this.$store.unregisterModule('recharge')
    this.$store.unregisterModule('order')
    this.$store.unregisterModule('invoice')
    this.$store.unregisterModule('coupon')
  }
}
</script>
