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
          name: 'taichi-app.router.explorer__manage'
        },
        {
          name: 'taichi-app.router.explorer__logs'
        }
      ]
    }
  }
}
</script>
