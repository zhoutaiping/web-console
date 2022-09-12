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
          title: '服务信息',
          name: 'security-operations.router.scan__scanWeb__service-info'
        },
        {
          title: '扫描列表',
          name: 'security-operations.router.scan__scanWeb__list'
        },
        {
          title: '配置列表',
          name: 'security-operations.router.scan__scanWeb__setting'
        }
      ]
    }
  }
}
</script>
