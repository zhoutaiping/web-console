<style lang="scss">
.Breadcrumb {
  font-size: 14px;
}
</style>

<template>
  <el-breadcrumb
    class="Breadcrumb"
  >
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumb"
      :key="index"
      :to="{ name: item.name }"
    >{{ item.title ? item.title : $t(item.name) }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
const SOC_MAP = {
  'scan-plus.router.settings': {
    title: '产品设置'
  },
  'scan-plus.router.packages': {
    title: '产品设置'
  }
}

export default {
  name: 'Breadcrumb',

  computed: {
    breadcrumb() {
      let list = this.$route.matched.filter(_ => _.meta.breadcrumb !== false)

      list = list.map(_ => {
        return {
          title: _.meta.title,
          name: _.name
        }
      })

      if (SOC_MAP[this.$route.name]) {
        list[0] = SOC_MAP[this.$route.name]
      }
      return list
    }
  }
}
</script>
