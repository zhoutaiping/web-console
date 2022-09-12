<template>
  <router-view />
</template>

<script>
import moduleMixins from '@/mixins/module'
import config from './config'

export default {
  mixins: [moduleMixins],

  data() {
    return {
      config,
      complete: null
    }
  },

  watch: {
    $route(val) {
      if (this.complete === false) {
        this.$router.push({
          name: 'zero-trust.router.serviceCertification'
        })
      }
    }
  },

  created() {
    this.checkStatus()
  },

  methods: {
    async checkStatus() {
      const { complete } = await this.Fetch.get('V4/zero.trust.member.status')
      this.complete = complete === 1
      if (!this.complete) {
        this.$router.push({
          name: 'zero-trust.router.serviceCertification'
        })
      }
    }
  }
}
</script>
