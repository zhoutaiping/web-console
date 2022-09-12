<template>
  <ConsolePageLayout>
    <div slot="header">
      <navbar-page
        v-if="navbar.map(_ => _.name).includes($route.name)"
        :data="navbar"
      />
    </div>
    <router-view />
  </ConsolePageLayout>
</template>

<script>

export default {
  data() {
    return {
      navbar: [
        {
          name: 'cloud-speed.router.taskList__operateLogBatch'
        },
        {
          name: 'cloud-speed.router.taskList__cleanCacheLog'
        },
        {
          name: 'cloud-speed.router.taskList__cachePreheatLog'
        }
      ]
    }
  }
}
</script>
