<template>
  <div :class="b()">
    <template v-if="Number(row.property_status) === 0">
      <a class="color--danger" @click="handleClick">点击认证</a>
    </template>
    <template v-else>
      <p class="color--success">已认证</p>
    </template>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnAuthentication',

  props: {
    row: Object
  },

  methods: {
    handleClick() {
      this.$emit('click', this.row)
    }
  }
})
</script>
