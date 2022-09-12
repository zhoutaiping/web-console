<style lang="scss">
.PopoverAccount {
  margin-left: 20px;

  &__title {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    line-height: 48px;
    color: #333;

    &:hover {
      color: $--color-primary;
    }
  }

  &__popover {
    padding: 0px;
    margin-top: 0px !important;

    .footer {
      border-top: 1px solid $--border-color-base;

      a {
        display: block;
        font-size: 13px;
        text-align: center;
        line-height: 40px;
      }
    }

    .item {
      a {
        display: block;
        font-size: 13px;
        line-height: 34px;
        color: #333;
        padding: 0 10px;

        i {
          font-style: normal;
        }

        &:hover {
          color: $--color-primary;
        }
      }
    }

    .NavbarList {
      margin-bottom: 0px;
    }
  }
}
</style>
<template>
  <div :class="b()">
    <el-popover
      v-model="visible"
      :popper-class="b('popover')"
      :open-delay="50"
      :close-delay="50"
      :visible-arrow="false"
      trigger="hover"
      width="200"
      transition=" "
      @hide="active = false"
      @show="active = true"
    >
      <ul class="NavbarList">
        <li
          v-for="(item, index) in navs"
          v-show="userInfo.userType === 'child' ? item.visibleChild : true"
          :key="index"
          class="item"
          @click="visible = false"
        >
          <router-link
            :to="item.href"
            class="inner"
          >
            <i
              :class="item.icon"
              class="yundun-fe"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <div class="footer"><a @click="loginOut">退出管理控制台</a></div>
      <template slot="reference">
        <span :class="b('title')">
          {{ userInfo.userType === 'child' ? userInfo.user_name : userInfo.email || userInfo.user_name }}
          <i class="el-icon-caret-bottom" />
        </span>
      </template>
    </el-popover>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
export default create({
  name: 'PopoverAccount',

  data() {
    return {
      visible: false,
      active: false,
      navs: [
        {
          icon: 'yicon-icon_zhanghao',
          text: '用户中心',
          href: '/console/user-center/basicinfo',
          visibleChild: true
        },
        {
          icon: 'yicon-anquan',
          text: '安全设置',
          href: '/console/user-center/safeConfig'
        },
        {
          icon: 'yicon-icon_renwujincheng',
          text: '登录日志',
          href: '/console/user-center/logs/login'
        }
      ]
    }
  }
})
</script>
