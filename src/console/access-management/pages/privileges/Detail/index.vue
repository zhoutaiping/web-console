<template>
  <console-page-layout :tabs="tabs">
    <router-view />
  </console-page-layout>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          name: 'access-management.router.privileges__custom__id__manage'
        },
        {
          name: 'access-management.router.privileges__custom__id__permission'
        }
      ]
    }
  }
}
</script>
