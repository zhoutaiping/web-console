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
          name: 'zero-trust.router.serviceCertification__sso'
        },
        {
          name: 'zero-trust.router.serviceCertification__iam'
        },
        {
          name: 'zero-trust.router.serviceCertification__apiToken'
        }
      ]
    }
  }
}
</script>
