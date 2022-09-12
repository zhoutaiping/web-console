<template>
  <div :class="b()">
    <span
      v-if="row.anti_status === 0"
      class="color--warning"
    >
      未开启
    </span>
    <span
      v-if="row.anti_status === 1"
      class="color--success"
    >
      防御中
    </span>
    <span
      v-if="row.anti_status === 2"
      class="color--danger"
    >
      已过期
    </span>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import column from '@/mixins/column'

export default create({
  name: 'ColumnAntiStatus',

  mixins: [column]
})
</script>
