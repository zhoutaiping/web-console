<template>
  <ConsolePageLayout :tabs="navbar">
    <router-view />
  </ConsolePageLayout>
</template>

<script>
import wafMixins from '@/console/taichi-app/mixins/waf'
import packageMixins from '../../mixins/packages'

export default {
  mixins: [wafMixins, packageMixins],

  data() {
    return {
      navbar: [
        {
          title: 'CC攻击统计',
          name: 'taichi-app.router.report__cc'
        },
        {
          title: '访问分析',
          name: 'taichi-app.router.report__visit'
        },
        {
          title: '业务安全分析',
          name: 'taichi-app.router.report__waf'
        }
      ]
    }
  },

  created() {
    this.wafFetchSettings()
    this.packageFetchList()
  }
}
</script>
