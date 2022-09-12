<style lang="scss">
.PopoverNotice {
  margin-left: 20px;

  &__title {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    line-height: 48px;
    color: #333;
    padding: 0 12px;

    &--active {
      background: rgba(0, 0, 0, 0.02);
      color: $--color-primary;
    }

    .el-badge__content.is-fixed {
      top: 12px;
    }

    &:hover {
      color: $--color-primary;
    }
  }

  &__popper {
    padding: 0px;
    margin-top: 0px !important;

    .null {
      text-align: center;
      line-height: 50px;
      color: #999;
    }

    .footer {
      border-top: 1px solid $--border-color-base;

      a {
        display: block;
        font-size: 13px;
        text-align: center;
        line-height: 40px;
      }
    }

    .list {
      margin-bottom: 0px;
    }

    .item {
      &:not(:last-child) {
        border-bottom: 1px solid #eee;
      }

      &.is-highlight {
        font-weight: 600;
      }

      a {
        display: block;
        padding: 8px 12px;

        .text {
          &--title {
            font-size: 13px;
            margin-bottom: 5px;
            color: #333;
          }

          &--time {
            color: #999;
          }
        }

        &:hover {
          .text {
            &--title {
              color: $--color-primary;
            }
          }
        }
      }
    }
  }
}
</style>
<template>
  <div :class="b()">
    <el-popover
      v-model="visible"
      :popper-class="b('popper')"
      :open-delay="50"
      :close-delay="50"
      :visible-arrow="false"
      trigger="hover"
      width="300"
      transition=" "
      @hide="active = false"
      @show="onShow"
    >
      <ul
        v-if="list.length"
        class="list"
      >
        <li
          v-for="(item, index) in list"
          :class="{'is-highlight': item.read_flag === '0'}"
          :key="index"
          class="item"
          @click="visible = false"
        >
          <router-link :to="`/console/message-center/messageList/detail/${item.id}`">
            <div class="text--title">{{ item.msg_title }}</div>
            <div class="text--time">{{ item.notice_time }}</div>
          </router-link>
        </li>
      </ul>
      <div
        v-else
        class="null"
      >暂无消息</div>
      <div class="footer">
        <router-link to="/console/message-center">
          查看更多
        </router-link>
      </div>
      <template slot="reference">
        <span :class="b('title', [active? 'active' : ''])">
          <el-badge
            :value="total"
            :hidden="total === 0"
          >
            <i class="ya-iconfont ya-xiaoxi" />
          </el-badge>
        </span>
      </template>
    </el-popover>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'PopoverNotice',

  data() {
    return {
      total: 0,
      visible: false,
      active: false,
      list: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const data = await this.Fetch.get('V4/overview.home.getUnread.message.number')
      const total = Number(data.total)
      this.total = total > 99 ? 99 : total
    },

    async onShow() {
      this.active = true
      const data = await this.Fetch.get('V4/messagecenter.getmessagelist')
      this.list = data.list.splice(0, 5)
    }
  }
})
</script>
