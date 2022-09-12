<template>
  <ConsolePageLayout :tabs="navbar">
    <router-view />
  </ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      navbar: [
        {
          name: 'anti-ddos.router.bwlistStatic'
        },
        {
          name: 'anti-ddos.router.bwlistDynamic'
        },
        {
          name: 'anti-ddos.router.bwlistLogs'
        }
      ]
    }
  }
}
</script>
