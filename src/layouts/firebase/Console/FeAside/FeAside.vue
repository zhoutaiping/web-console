<style lang="scss">
.FeAside {
  overflow: hidden;
  background: rgb(40, 40, 40);

  .logo {
    display: block;
    height: 48px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    text-align: left;
    background: $--color-primary;
    border-bottom: 1px solid $--color-aside-border;

    img {
      vertical-align: top;
      height: 40px;
      margin-top: 4px;
    }
  }

  .ANavItem {
    border-bottom: 1px solid $--color-aside-border;
    font-size: 14px;
    padding: 0 20px;
    display: block;
    line-height: 54px;
    color: $--color-aside-menu-text-default;

    &__icon {
      width: 16px;
      font-size: 16px;
      color: $--color-aside-menu-text-default !important;
      margin-right: 8px;
    }

    &__title {
      font-style: normal;
      font-weight: 600;
      color: $--color-aside-menu-text-default !important;
    }

    &.router-link-active {
      .ANavItem {
        &__icon {
          color: $--color-primary-light-3 !important;
        }

        &__title {
          color: $--color-primary-light-3 !important;
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
  <el-aside
    :class="b()"
    :width="$store.state.app.collapse ? '64px' : '185px'"
  >
    <a
      :style="{'background-color': appAssets.logoBackground}"
      class="logo"
      href="/"
    >
      <img
        :src="logoSrc"
        alt=""
      >
    </a>
    <yd-scroll style="height: 100%; padding-bottom: 50px">
      <router-link
        class="ANavItem"
        to="/console/home"
      >
        <i class="ANavItem__icon ya-kongzhitai ya-iconfont" />
        <i class="ANavItem__title">
          总览
        </i>
      </router-link>
      <FeMenu
        :default-openeds="defaultOpeneds"
        :collapse="$store.state.app.collapse"
      >
        <template v-for="(item, index) in list">
          <template v-if="item.times || item.children">
            <FeMenuItemGroup
              :index="item.name"
              :key="index"
              :title="item.title"
              :name="item.name"
              :url="item.url"
              :desc="item.desc"
            >
              <FeMenuItem
                v-for="(item, index) in item.items"
                :key="index"
                :url="item.url"
                :title="item.title"
                :name="item.name"
                :icon="item.icon"
              />
              <FeMenuChildren
                v-for="(item, index) in item.children"
                :key="item"
                :name="item"
              />
            </FeMenuItemGroup>
          </template>
          <template v-else>
            <router-link
              :key="index"
              :to="{
                name: item.name
              }"
              class="ANavItem"
            >
              <i class="ANavItem__title">
                {{ $t(item.name) }}
              </i>
            </router-link>
          </template>
        </template>
      </FeMenu>
    </yd-scroll>
  </el-aside>
</template>

<script>
import create from '@/utils/create-basic'
import FeMenu from '../FeMenu/FeMenu'
import FeMenuItem from '../FeMenu/FeMenuItem'
import FeMenuChildren from '../FeMenu/FeMenuChildren'
import FeMenuItemGroup from '../FeMenu/FeMenuItemGroup'

export default create({
  name: 'FeAside',

  components: { FeMenu, FeMenuItem, FeMenuChildren, FeMenuItemGroup },

  computed: {
    assets() {
      return this.$store.getters.assets
    },

    logoSrc() {
      return this.$store.state.app.collapse ? this.assets.logoConsoleC : this.assets.logoConsole
    },

    list() {
      const list = this.$store.getters.sidebarView
      list.forEach(item => {
        if (item.items && item.items.length) {
          item.desc = item.items.map(_ => this.$t(_.name)).join(', ')
        }
        if (item.children && item.children.length) {
          item.desc = item.children.map(name => this.$t(name)).join(', ')
        }
      })
      return list
    },

    defaultOpeneds() {
      return this.$store.state.app.defaultOpeneds
    }
  },

  created() {
    this.$store.dispatch('initSidebar', { path: this.$route.path, pathName: this.$route.name })
  }
})
</script>
