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
          name: 'security-operations.router.logs__download'
        },
        {
          name: 'security-operations.router.logs__template'
        }
      ]
    }
  }
}
</script>
