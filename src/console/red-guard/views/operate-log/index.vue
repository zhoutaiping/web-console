<template>
  <console-page-layout :tabs="navbar">
    <router-view />
  </console-page-layout>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  inject: ['ModuleId'],

  name: 'page',

  data() {
    return {
      navbar: [
        {
          name: `${this.ModuleId}.router.operateLogApplicationWall`
        },
        {
          name: `${this.ModuleId}.router.operateLogAccurateAccessControl`
        }
      ]
    }
  }
})
</script>
