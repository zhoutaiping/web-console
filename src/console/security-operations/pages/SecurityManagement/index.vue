<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      navbar: [
        {
          name: 'security-operations.router.serviceReport'
        },
        {
          name: 'security-operations.router.logs'
        },
        {
          name: 'security-operations.router.ipList'
        }
      ]
    }
  }
}
</script>
