<style lang="scss">
.FeMenuItem {
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

    &.router-link-active {
      .FeMenuItem {
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
      :to="{path: url}"
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
          {{ titleView }}
        </span>
      </template>
    </router-link>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'FeMenuItem',

  props: {
    name: String,
    title: String,
    icon: String,
    url: String
  },

  computed: {
    titleView() {
      return this.title ? this.title : this.$t(this.name)
    },

    collapse() {
      return this.$store.state.app.collapse
    }
  }
})
</script>
