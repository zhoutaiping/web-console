<style lang="scss">
.ColumnDevice {
  .item {
    width: 24px;
    height: 18px;
    line-height: 18px;
    color: #fff;
    border-radius: 2px;
    text-align: center;
    float: left;
    margin-right: 6px;
    font-size: 12px;
    cursor: pointer;

    &--fade {
      opacity: 0.2;
    }
    &--danger {
      background-color: rgb(255, 21, 0);
    }
    &--primary {
      background-color: rgb(45, 144, 230);
    }
  }
}
</style>

<template>
  <div :class="b()">
    <el-tooltip
      v-for="(item, index) in list"
      :content="`${item.label}：${value[item.value] || 0}个`"
      :key="index"
      placement="top"
    >
      <div
        :class="[{'item--fade': value[item.value] == 0 || !value[item.value] }, `item--${item.color}`]"
        class="item"
      >
        {{ value[item.value] || 0 }}
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnDevice',

  props: {
    value: {}
  },

  data() {
    return {
      list: [
        {
          label: '离线设备',
          value: 'offline',
          color: 'danger'
        },
        {
          label: '在线设备',
          value: 'online',
          color: 'primary'
        }
      ]
    }
  }
})
</script>
