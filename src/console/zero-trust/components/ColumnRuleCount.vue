<style lang="scss">
.ColumnRuleCount {
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
    &--deny {
      background-color: rgb(255, 21, 0);
    }
    &--allow {
      background-color: $--color-success;
    }
    &--bypass {
      background-color: rgb(45, 144, 230);
    }
  }
}
</style>

<template>
  <div :class="b()">
    <el-tooltip
      v-for="(item, index) in list"
      :content="`${item.label}：${$props[item.value] || 0}条`"
      :key="index"
      placement="top"
    >
      <div
        :class="[{'item--fade': $props[item.value] == 0 || !$props[item.value] }, `item--${item.value}`]"
        class="item"
        @click="$emit('click')"
      >
        {{ $props[item.value] > 999 ? 999 : $props[item.value] || 0 }}
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnRuleCount',

  props: {
    allow: {},
    bypass: {},
    deny: {}
  },

  data() {
    return {
      list: [
        {
          label: '允许',
          value: 'allow'
        },
        {
          label: '绕过',
          value: 'bypass'
        },
        {
          label: '拒绝',
          value: 'deny'
        }
      ]
    }
  }
})
</script>
