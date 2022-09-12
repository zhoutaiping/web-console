<template>
  <!-- 异步加载 -->
  <yd-card
    horizontal
    title="异步加载"
  >
    <template slot="tips">使页面的渲染不再因为加载长时间运行的脚本而被阻断</template>
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
  name: 'AjaxLoad',

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
