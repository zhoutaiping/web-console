<style lang="scss" scoped>
.columnRatio {
  word-break: normal;

  .el-progress{

  }
}
</style>

<template>
  <div :class="b()">
    <el-progress
      :text-inside="true"
      :stroke-width="18"
      :percentage="value"
    />
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'columnRatio',

  props: {
    value: [String, Number]
  }
})
</script>
