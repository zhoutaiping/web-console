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
          name: 'security-operations.router.serviceReport__reportList'
        },
        {
          name: 'security-operations.router.serviceReport__taskList'
        }
      ]
    }
  }
}
</script>
