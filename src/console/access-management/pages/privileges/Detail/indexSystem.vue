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
          name: 'access-management.router.privileges__system__id__permission'
        }
      ]
    }
  }
}
</script>
