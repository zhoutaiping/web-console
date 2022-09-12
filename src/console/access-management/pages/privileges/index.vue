<template>
  <console-page-layout>
    <template v-if="tabs.map(_ => _.name).includes($route.name)">
      <NavbarPage
        slot="header"
        :data="tabs"
      />
    </template>
    <router-view />
  </console-page-layout>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          name: 'access-management.router.privileges__system'
        },
        {
          name: 'access-management.router.privileges__custom'
        }
      ]
    }
  }
}
</script>
