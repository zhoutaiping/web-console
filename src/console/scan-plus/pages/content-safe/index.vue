<template>
  <ConsolePageLayout :tabs="navbar">
    <router-view />
  </ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      mealList: [],
      navbar: [
        {
          title: '监测列表',
          name: 'security-operations.router.scan__contentSafe__list'
        },
        {
          title: '事件列表',
          name: 'security-operations.router.scan__contentSafe__event'
        }
      ]
    }
  }
}
</script>
