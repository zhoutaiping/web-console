<template>
  <ConsolePageLayout>
    <div slot="header">
      <navbar-page :data="navbar" />
    </div>
    <router-view />
  </ConsolePageLayout>
</template>

<script>
import { getUserstore } from '@/utils/auth'
export default {
  data() {
    return {
      // navbar: [
      //   {
      //     name: 'cloud-speed.router.websiteList'
      //   },
      //   {
      //     name: 'cloud-speed.router.businessList__websiteGroup'
      //   }
      // ]
    }
  },
  computed: {
    navbar() {
      const { userType } = getUserstore()

      return userType === 'child' ? [
        {
          name: 'cloud-speed.router.websiteList'
        }]
        : [
          {
            name: 'cloud-speed.router.websiteList'
          },
          {
            name: 'cloud-speed.router.businessList__websiteGroup'
          }
        ]
    }
  }
}
</script>
