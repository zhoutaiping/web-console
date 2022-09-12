<template>
  <div :class="b()">
    <template v-if="data.length">
      <div
        v-for="(item, index) in data"
        :key="index"
      >
        <el-tooltip
          :content="item.tips"
          :disabled="!item.tips"
          effect="dark"
          placement="right"
        >
          <el-link>
            <yd-badge :status="item.health ? 'success' : 'danger'" /> {{ item.ip }}
          </el-link>
        </el-tooltip>
      </div>
    </template>
    <template v-else>
      无设备
    </template>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnDevice',

  props: {
    data: Array
  }
})
</script>
