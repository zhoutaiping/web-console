<template>
  <div>
    <span
      v-if="value === Label.status_var.STATUS_NOT_STARTED"
      class="color--warning">未开始</span>
    <span
      v-else-if="value === Label.status_var.STATUS_PROGRESS"
      class="color--primary">进行中</span>
    <span
      v-else-if="value === Label.status_var.STATUS_COMPLETE"
      class="color--success">已完成</span>
    <span
      v-else-if="value === Label.status_var.STATUS_FAIL"
      class="color--danger">失败</span>
    <span
      v-else-if="value === Label.status_var.STATUS_CANCELLED"
      class="color--danger">已取消</span>
  </div>
</template>

<script>
import Label from '../constants/label'

export default {
  props: {
    value: Number
  },

  data() {
    return {
      Label
    }
  }
}
</script>
