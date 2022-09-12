<template>
  <div class="yd-panel">
    <h3 v-if="title" class="yd-panel__title">{{ title }}</h3>
    <div class="yd-panel__content">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>
<style lang="scss" scoped>
.yd-panel {
  margin-bottom: 20px;
  &__title {
    font-size: 14px;
    border-left: 2px solid $--color-primary;
    padding-left: 15px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  &__desc {
    margin-bottom: 17px;
    font-size: 14px;
  }
  a {
    cursor: pointer;
    color: $--color-primary;
  }
  &__content {
    background: #fff;
    padding: 15px;
  }
}
</style>

<style lang="scss">
.yd-panel {
  .el-form-item__label {
    color: #000;
  }
}
</style>
