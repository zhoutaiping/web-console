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
          name: 'anti-ddos.router.monitorAttack'
        },
        {
          name: 'anti-ddos.router.monitorCluster'
        }
      ]
    }
  }
}
</script>
