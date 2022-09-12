<template>
  <ConsolePageLayout :tabs="tabOptions">
    <router-view />
  </ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      tabOptions: [
        {
          name: 'user-center.router.logs__login'
        },
        {
          name: 'user-center.router.logs__operation'
        }
      ]
    }
  }
}
</script>
