<template>
  <console-page-layout :tabs="navbarView">
    <router-view />
  </console-page-layout>
</template>

<script>
export default {
  name: 'ProtectionRules',

  data() {
    return {
      navbar: [
        {
          title: '七层转发规则',
          name: 'cloud-wall.router.protectionRules__configLayer7Rule'
        },
        {
          title: '四层转发规则',
          name: 'cloud-wall.router.protectionRules__configLayer4Rule'
        }
      ]
    }
  },

  computed: {
    navbarView() {
      const list = this.navbar.map(_ => _.name)
      if (list.includes(this.$route.name)) {
        return this.navbar
      } else {
        return []
      }
    }
  }
}
</script>
