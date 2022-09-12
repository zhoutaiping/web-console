<template>
  <div
    v-if="row"
    :class="b()"
  >
    <span
      v-if="row.status === '1'"
      class="color--success"
    >
      正常
    </span>
    <span
      v-if="row.status === '2'"
      class="color--warning"
    >
      锁定
    </span>
    <span
      v-else-if="row.status === '3'"
      class="color--danger"
    >
      管理员暂停
    </span>
    <span
      v-if="row.status === '4'"
      class="color--warning"
    >
      过户中
    </span>

  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnDomainStatus',

  props: {
    row: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
})
</script>
