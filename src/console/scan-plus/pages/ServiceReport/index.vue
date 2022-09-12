<template>
  <console-page-layout :tabs="navbar">
    <router-view />
  </console-page-layout>
</template>

<script>
export default {
  data() {
    return {
      navbar: [
        {
          name: 'scan-plus.router.serviceReport__reportList'
        },
        {
          name: 'scan-plus.router.serviceReport__taskList'
        }
      ]
    }
  }
}
</script>
