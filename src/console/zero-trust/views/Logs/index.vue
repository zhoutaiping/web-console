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
          name: 'zero-trust.router.logs__operate'
        },
        {
          name: 'zero-trust.router.logs__access'
        },
        {
          name: 'zero-trust.router.logs__visit'
        }
      ]
    }
  }
}
</script>
