<style lang="scss">
.FeHeader {
  z-index: 111;
  display: block;
  min-width: 820px;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px 0 rgba(9, 18, 26, 0.06),
    0 4px 8px 0 rgba(39, 56, 73, 0.08);

  .HeaderAvatar {
    cursor: pointer;
    line-height: 38px;
    display: flex;
    align-items: center;
    font-size: 14px;

    .el-avatar {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }

  &__body {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .right {
    display: flex;
    align-items: center;
  }

  .itemGroup {
    margin: 0 -12px;
  }

  .toggleSidebar{
    padding: 0 12px;
    color: rgba(0, 0, 0, 0.62);
    font-size: 14px;
  }

  .item {
    padding: 0 12px;
    color: rgba(0, 0, 0, 0.62);
    font-size: 13px;

    &:hover {
      color: $--color-primary;
    }

    i {
      font-size: 16px;
      margin-right: 6px;
    }
  }
}
</style>

<template>
  <el-header
    :class="b()"
    height="48px"
  >
    <div :class="b('body')">
      <div class="itemGroup">
        <slot />
      </div>
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </el-header>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'FeHeader'
})
</script>
