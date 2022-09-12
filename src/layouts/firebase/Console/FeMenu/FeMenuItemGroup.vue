<style lang="scss">
.FeMenuItemGroup {
  border-bottom: 1px solid $--color-aside-border;

  &__header {
    display: block;
    cursor: pointer;
    position: relative;
    padding: 18px 20px;

    &.router-link-active {
      .FeMenuItemGroup {
        &__icon {
          color: $--color-primary;
        }

        &__title {
          color: $--color-aside-menu-text-active;
        }
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.06);

      .FeMenuItemGroup {
        &__icon {
          color: $--color-primary;
        }

        &__title {
          color: $--color-aside-menu-text-active;
        }
      }
    }
  }

  &__title {
    font-size: 14px;
    color: $--color-aside-menu-text-active;
  }

  &__body {
    max-height: 0px;
    opacity: 0;
    transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1),
      max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    margin-top: 4px;
    color: $--color-aside-menu-text-default;
    opacity: 1;
    transition: 0.3s;
  }

  &__icon {
    display: inline-block;
    color: $--color-aside-menu-icon-default;
    font-size: 13px;
    line-height: 38px;
    width: 16px;
    margin-right: 10px;
    margin-left: 20px;
    text-align: center;
  }

  &__arrow {
    opacity: 0;
    position: absolute;
    right: 15px;
    top: 19px;
    transition: 0.3s;
    font-size: 13px;
    transform: rotate(180deg);
    color: $--color-aside-menu-icon-default;
  }

  &--open {
    background: rgba(255, 255, 255, 0.03);

    .FeMenuItemGroup {
      &__header {
        padding-bottom: 0px;

        &:hover {
          .FeMenuItemGroup__arrow {
            opacity: 1;
          }
        }
      }

      &__desc {
        opacity: 0;
      }

      &__body {
        opacity: 1;
        padding-bottom: 12px;
        max-height: 800px;
      }

      &__arrow {
        transform: rotate(0deg);
      }
    }
  }
}
</style>

<template>
  <div :class="b([open ? 'open' : '', rootMenu.collapse ? 'collapse' : ''])">
    <div
      :class="b('header')"
      @click="handleClick"
    >
      <el-tooltip
        :content="titleView"
        :disabled="!collapse"
        placement="right"
        effect="light"
      >
        <i
          v-if="icon"
          :class="[b('icon'), icon]"
          class="ya-iconfont"
        />
      </el-tooltip>
      <template v-if="collapse">
        <!--  -->
      </template>
      <template v-else>
        <span :class="b('title')">{{ titleView }}</span>
        <i
          v-if="!url"
          :class="b('arrow')"
          class="el-icon-arrow-up"
        />
      </template>
      <div :class="b('desc')">
        {{ desc }}
      </div>
    </div>
    <div :class="b('body')">
      <div v-show="open">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import emitter from '@/mixins/emitter'

export default create({
  componentName: 'FeMenuItemGroup',

  name: 'FeMenuItemGroup',

  mixins: [emitter],

  inject: ['rootMenu'],

  props: {
    name: String,
    title: String,
    icon: String,
    index: [String, Number],
    url: String,
    desc: String
  },

  computed: {
    titleView() {
      return this.title ? this.title : this.$t(`${this.name}.title`)
    },

    open() {
      return this.rootMenu.openedMenus.indexOf(this.index) > -1
    },

    collapse() {
      return this.rootMenu.collapse
    }
  },

  methods: {
    handleClick() {
      if (this.url) return
      this.dispatch('FeMenu', 'menu-group-click', this)
    }
  }
})
</script>
