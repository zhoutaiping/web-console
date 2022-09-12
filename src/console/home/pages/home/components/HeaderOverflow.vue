<style lang="scss">
.HeaderOverflow {
  display: flex;
  padding: 30px 20px;
  margin-top: -16px;
  margin-left: -16px;
  margin-right: -16px;
  background: #fff;

  .s-button {
    display: inline-block;
    color: $--color-primary;
    font-size: 12px;
  }

  .ya-qr {
    display: inline-block;
    height: 14px;
    font-size: 14px;
    margin-right: 12px;
    color: $--color-text-regular;
  }

  .qrText {
    font-size: 12px;
    color: $--color-text-regular;
  }

  .title {
    color: $--color-text-regular;
  }

  .money {
    font-size: 20px;
    margin-right: 40px;
    color: $--color-primary;
  }

  &__body {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__right {
    display: flex;
    align-items: center;
  }
}

.popoverQR {
  img {
    width: 150px;
  }
}
</style>

<template>
  <div :class="b()">
    <div :class="b('body')">
      <span class="title">
        账户余额（元）：
      </span>
      <span class="money">{{ balance }}</span>
      <router-link
        to="/console/finance-center/rechargeList"
        style="margin-right: 12px"
      >
        <el-button
          type="primary"
          plain
        >充值</el-button>
      </router-link>
      <router-link
        class="s-button"
        to="/console/finance-center/rechargeList"
      >
        充值管理
      </router-link>
      <el-divider direction="vertical" />
      <router-link
        class="s-button"
        to="/console/finance-center/invoiceOrder"
      >
        订单管理
      </router-link>
      <el-divider direction="vertical" />
      <router-link
        class="s-button"
        to="/console/finance-center/invoiceList"
      >
        发票管理
      </router-link>
    </div>
    <div :class="b('right')">
      <template v-if="moduleSettings.home.wxPopover && moduleSettings.home.wxPopover.length">
        <i class="ya-qr ya-iconfont" />
        <span
          v-for="(item, index) in moduleSettings.home.wxPopover"
          :key="index"
        >
          <el-divider v-if="index > 0" direction="vertical" />
          <el-popover
            popper-class="popoverQR"
            placement="bottom"
            trigger="hover"
          >
            <img
              :src="item.src"
              class="wechat"
              alt="wechat"
            >
            <a
              slot="reference"
              class="qrText"
            >{{ item.title }}</a>
          </el-popover>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'HeaderOverflow',

  data() {
    return {
      balance: '-'
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const data = await this.Fetch.get('V4/finance.recharge.getMemberBalance')
      this.balance = data.balance
    }
  }
})
</script>
