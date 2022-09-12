<style lang="scss">
.fe-layout-theme1 {
  background: rgb(242, 242, 242);
  height: 100vh;

  .el-main {
    padding: 16px;
  }

  .AsideMenu {
    background-color: #fff;

    .title {
      padding-left: 16px;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      font-weight: 600;
      color: #000;
    }

    &__list {
      margin: 0;
      padding: 0;
    }

    &__item {
      list-style: none;

      a {
        display: block;
        padding-left: 16px;
        line-height: 40px;
        color: #333;
        font-size: 12px;
        text-decoration: none;

        &.router-link-active {
          font-weight: 600;
          background: rgb(242, 242, 242) !important;
        }

        &:hover {
          background: rgba(0, 0, 0, 0.02);
        }
      }
    }
  }
}
</style>

<template>
  <el-container class="fe-layout-theme1">
    <FeAside />
    <el-container>
      <FeHeader>
        <!-- <router-link
          class="item"
          to="/console/home"
        ><i class="ya-kongzhitai ya-iconfont" />总览</router-link> -->
        <ProductNav
          v-if="appAssets.productNav"
          style="margin-left: 8px"
        />
        <template slot="right">
          <PopoverNotice style="margin-right: 20px" />
          <div class="itemGroup">
            <a
              v-if="appAssets.beforeKF"
              class="item"
              @click="Help.openServicePanel(appAssets.beforeKF)"
            >
              <i class="ya-iconfont ya-customerservice-fill" />
              售前咨询
            </a>
            <a
              v-if="appAssets.afterKF"
              class="item"
              @click="Help.openServicePanel(appAssets.afterKF)"
            >
              <i class="ya-iconfont ya-wrench-fill" />
              售后客服
            </a>
            <a
              v-if="appAssets.tel"
              class="item"
            >
              <i class="ya-iconfont ya-phone-fill" />
              {{ appAssets.tel }}
            </a>
          </div>
          <PopoverAccount />
        </template>
      </FeHeader>
      <el-main style="padding: 0px">
        <!-- v-show="moduleReady" -->
        <el-container
          style="height: 100%"
        >
          <!-- 小目录 -->
          <el-aside
            v-if="menus && menus.length && !config.hiddenMenus"
            width="160px"
            class="AsideMenu"
          >
            <h3 class="title">{{ config.title ? config.title : $t(config.name) }}</h3>
            <ul class="AsideMenu__list">
              <li
                v-for="(item, index) in menus"
                v-if="!item.hidden"
                :key="index"
                class="AsideMenu__item"
              >
                <router-link :to="{name: item.name}">
                  <template v-if="item.meta && item.meta.title">
                    {{ item.meta.title }}
                  </template>
                  <template v-else>
                    {{ $t(item.name) }}
                  </template>
                </router-link>
              </li>
            </ul>
          </el-aside>
          <!-- Main -->
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-main>
      <el-footer height="0px" />
    </el-container>
  </el-container>
</template>

<script>
import FeAside from './Console/FeAside/FeAside'
import FeHeader from './Console/FeHeader/FeHeader'
import PopoverNotice from './components/PopoverNotice'
import PopoverAccount from './components/PopoverAccount'
import ProductNav from './components/ProductNav/ProductNav'

export default {
  name: 'ConsoleLayout',

  components: { FeAside, FeHeader, PopoverNotice, PopoverAccount, ProductNav },

  computed: {
    id() {
      return this.$store.state.app.moduleId
    },
    config() {
      return this.$store.state.app.moduleConfig
    },
    menus() {
      return this.$store.state.app.moduleMenus
    },
    moduleReady() {
      return this.$store.state.app.moduleReady
    }
  }
}
</script>
