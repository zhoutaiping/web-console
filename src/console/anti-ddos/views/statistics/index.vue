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
          name: 'anti-ddos.router.statisticsAttack'
        },
        {
          name: 'anti-ddos.router.statisticsAnalyze'
        },
        {
          name: 'anti-ddos.router.statisticsDevice'
        },
        {
          name: 'anti-ddos.router.monitorAttackLog'
        }
      ]
    }
  }
}
</script>
