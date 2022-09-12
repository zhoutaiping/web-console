<template>
  <ConsolePageLayout>
    <div slot="header">
      <navbar-page :data="navbar" />
    </div>
    <router-view />
  </ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      navbar: [
        {
          name: 'cloud-speed.router.cleanCache'
        },
        {
          name: 'cloud-speed.router.cachePreheat'
        }
      ]
    }
  }
}
</script>
