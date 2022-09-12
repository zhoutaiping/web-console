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
          name: 'security-operations.router.scan__propertys'
        },
        {
          name: 'security-operations.router.scan__contentSafe'
        },
        {
          name: 'security-operations.router.scan__usabilityMonitor'
        },
        // {
        //   name: 'security-operations.router.scan__dnsMointor'
        // },
        {
          name: 'security-operations.router.scan__scanWeb'
        },
        {
          name: 'security-operations.router.scan__packages'
        }
      ]
    }
  }
}
</script>
