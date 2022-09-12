<style lang="scss" scoped>
.StatusAccess{
  font-size: 12px;
  padding: 2px 8px;
  color: #FFF;
  border-radius: 4px;
  margin-right: 8px;

  &--fail{
    background: #AAA;
  }

  &--success{
    background: $--color-success;
  }
}
</style>

<template>
  <span
    v-if="success"
    class="StatusAccess StatusAccess--success"
  >已接入</span>
  <span
    v-else
    class="StatusAccess StatusAccess--fail"
  >未接入</span>
</template>

<script>
export default {
  props: {
    success: Boolean
  }
}
</script>
