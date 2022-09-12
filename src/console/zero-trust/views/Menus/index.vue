<template>
  <ConsolePageLayout>
    <template v-if="navbar.map(_ => _.name).includes($route.name)">
      <NavbarPage
        slot="header"
        :data="navbar"
      />
    </template>
    <router-view />
  </ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      navbar: [
        {
          name: 'zero-trust.router.menus__userTree'
        }
        // {
        //   name: 'zero-trust.router.menus__userGroup'
        // }
      ]
    }
  }
}
</script>
