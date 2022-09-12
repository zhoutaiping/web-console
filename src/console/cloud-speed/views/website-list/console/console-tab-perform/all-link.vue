<template>
  <yd-card
    horizontal
    title="全链路优化"
  >
    <template slot="tips">通过大数据网络感知智能调度、TCP优化、路由优化、保障访客--节点网络--源站最佳链路</template>
    <el-select
      slot="action"
      v-model="status"
      disabled
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </yd-card>
</template>

<script>
export default {
  name: 'AllLink',

  data() {
    return {
      status: 'on',
      options: [{
        value: 'on',
        label: 'ON'
      }, {
        value: 'off',
        label: 'OFF'
      }]
    }
  }
}
</script>
