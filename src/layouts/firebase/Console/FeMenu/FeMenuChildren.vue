<style lang="scss">
.FeMenuChildren {
  display: block;

  &__icon {
    display: inline-block;
    color: $--color-aside-menu-icon-default;
    font-size: 16px;
    width: 16px;
    margin-right: 14px;
    margin-left: 20px;
    text-align: center;
    line-height: 38px;
  }

  &__title {
    display: inline-block;
    line-height: 24px;
    font-size: 13px;
    font-weight: 600;
    color: $--color-aside-menu-text-default;
  }

  &__core {
    display: block;
    padding: 0px 16px;
    padding-left: 0px;
    transition:  .3s cubic-bezier(0.4, 0, 0.2, 1);

    &.router-link-active {
      .FeMenuChildren {
        &__icon {
          color: $--color-primary-light-3 !important;
        }

        &__title {
          color: $--color-primary-light-3;
        }
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }
}
</style>

<template>
  <div :class="b()">
    <router-link
      :class="b('core')"
      :to="{name: name}"
    >
      <template v-if="collapse">
        <el-tooltip
          :content="titleView"
          effect="light"
          placement="left"
        >
          <i
            :class="[b('icon'), icon ? icon : 'ya-dot']"
            class="ya-iconfont"
          />
        </el-tooltip>
      </template>
      <template v-else>
        <i
          :class="[b('icon'), icon ? icon : 'ya-dot']"
          class="ya-iconfont"
        />
        <span :class="b('title')">
          {{ $t(name) }}
        </span>
      </template>
    </router-link>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'FeMenuChildren',

  props: {
    icon: String,
    name: String
  },

  computed: {
    titleView() {
      return this.$t(this.name)
    },
    collapse() {
      return this.$store.state.app.collapse
    }
  }
})
</script>
