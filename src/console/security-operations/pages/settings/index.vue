<template>
  <ConsolePageLayout>
    <router-view />
  </ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      navbar: [
        {
          name: 'security-operations.router.scan__productSettings__Notice'
        },
        {
          name: 'security-operations.router.scan__productSettings__Packages'
        }
      ]
    }
  }
}
</script>
