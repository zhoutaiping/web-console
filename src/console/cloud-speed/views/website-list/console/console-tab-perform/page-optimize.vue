<template>
  <yd-card
    horizontal
    title="页面优化"
  >
    <template slot="tips">自动裁掉脚本文件中不必要的字符，动态减小网页文件尺寸的技术。优化后在保证网页显示不变的同时，节约传输内容，提高访问速度</template>
    <el-select
      slot="action"
      :disabled="true"
      v-model="status"
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
  name: 'PageOptimize',

  data() {
    return {
      options: [{
        value: 'on',
        label: 'ON'
      }, {
        value: 'off',
        label: 'OFF'
      }],
      status: 'on'
    }
  }
}
</script>
