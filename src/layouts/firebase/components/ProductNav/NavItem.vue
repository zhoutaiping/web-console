<style lang="scss">
.NavItem {
  font-size: 14px;
  display: block;
  padding: 0px 20px;
  display: flex;
  cursor: pointer;
  height: 50px;
  align-items: center;

  &--active {
    font-weight: 600;
    color: $--color-primary;
    background: $--color-primary-light-9;

    .NavItem {
      &__title {
        color: $--color-primary;
      }

      .arrow {
        color: $--color-primary;
      }
    }
  }

  &:hover {
    color: $--color-primary;

    .NavItem {
      &__title {
        color: $--color-primary;
      }

      .arrow {
        color: $--color-primary;
      }
    }
  }

  &__icon {
    display: inline-block;
    width: 14px;
    font-size: 18px;
    text-align: center;
    margin-right: 14px;
  }

  &__title {
    flex: 1;
    color: $--color-text-regular;
    font-size: 13px;
  }

  &__arrow {
    font-size: 12px;
    text-align: right;
    display: inline-block;
    color: $--color-text-secondary;
  }
}
</style>

<template>
  <div
    :class="b({ active })"
    @click="handleClick"
  >
    <i
      v-if="icon"
      :class="[icon, b('icon')]"
      class="ya-iconfont"
    />
    <span :class="b('title')">
      {{ title }}
    </span>
    <i
      :class="b('arrow')"
      class="el-icon-arrow-right"
    />
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'NavItem',

  props: {
    icon: String,
    title: String,
    active: Boolean,
    to: Object
  },

  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
})
</script>
