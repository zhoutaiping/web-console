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
          title: '监控列表',
          name: 'scan-plus.router.dns-monitor__list'
        },
        {
          title: '数据报表',
          name: 'scan-plus.router.dns-monitor__report'
        }
      ]
    }
  }
}
</script>
