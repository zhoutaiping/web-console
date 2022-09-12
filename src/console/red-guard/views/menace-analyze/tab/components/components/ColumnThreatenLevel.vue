<template>
  <span>
    <span v-if="value==='高'" class="color--danger">高</span>
    <span v-if="value==='中'" class="color--warning">中</span>
    <span v-if="value==='低'" style="color: #f7d441">低</span>
  </span>
</template>

<script>
export default {
  props: {
    value: String
  }
}
</script>
