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
          title: '监控列表',
          name: 'security-operations.router.scan__usabilityMonitor__list'
        },
        {
          title: '故障列表',
          name: 'security-operations.router.scan__usabilityMonitor__event'
        }
      ]
    }
  }
}
</script>
