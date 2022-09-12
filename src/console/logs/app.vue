<template>
  <router-view />
</template>

<script>
import config from './config'

export default {
  created() {
    this.$store.dispatch('initModule', {
      config
    })
  }
}
</script>
