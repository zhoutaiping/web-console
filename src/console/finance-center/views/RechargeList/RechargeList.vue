<template>
  <console-page-layout>
    <DmToolbar>
      <div>
        当前账户余额：<span class="balance">{{ balance }}</span>元
        <el-button
          type="primary"
          style="margin-left:10px;"
          @click="handleRecharge"
        >充值</el-button>
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            prop="out_trade_no"
            label="流水号"
            min-width="150"
          />
          <el-table-column
            label="下单时间"
            min-width="180"
            prop="created_at"
          />
          <el-table-column
            label="交易时间"
            prop="gmt_payment"
            min-width="180"
          />
          <el-table-column
            label="金额"
            min-width="150"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.total_fee }} 元
            </template>
          </el-table-column>
          <el-table-column label="支付方式">
            <template slot-scope="scope">
              <span>{{ recharge_type_text[scope.row.recharge_type] || '其他' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="120"
            align="right"
          >
            <template slot-scope="scope">
              <div v-if="showPayStatusBtn(scope,0)">
                <i
                  v-if="scope.row.recharge_type === '1'"
                  class="again-dot"
                />
                <el-button
                  v-if="scope.row.recharge_type === '1'"
                  type="text"
                  size="small"
                  @click="continueToPay(scope.row)"
                >继续充值</el-button>
                <span
                  v-if="scope.row.recharge_type === '1'"
                  class="separator"
                />
                <i
                  v-if="scope.row.recharge_type === '2'"
                  class="fail-dot"
                />
                <span v-if="scope.row.recharge_type === '1'">待支付</span>
                <span v-if="scope.row.recharge_type === '2'">已过期</span>
                <span v-if="scope.row.recharge_type === '3'">待支付</span>
              </div>
              <div v-if="showPayStatusBtn(scope,1)">
                <i class="succceed-dot" />
                <span>已支付</span>
              </div>
              <div v-if="showPayStatusBtn(scope,2)">
                <i class="fail-dot" />
                <span>已过期</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <PayConfig :page-type="'rechargePage'" />
  </console-page-layout>
</template>

<script>
import PayConfig from '../Dialogs/PayConfig'
import { mapActions } from 'vuex'
import consoleData from '@/mixins/consoleData'

export default {
  components: {
    PayConfig
  },

  mixins: [consoleData],

  data() {
    return {
      // bindParams: { platform: 2 },
      API_INDEX: 'V4/finance.recharge.rechargeList',
      recharge_type_text: {
        '1': '支付宝',
        '2': '微信',
        '3': '网银[宝付]'
      }
    }
  },
  computed: {
    balance() {
      return this.$store.state.recharge.balance
    }
  },

  created() {
    this.getUserBalance()
  },

  mounted() {
    const startIndex = window.location.hash.indexOf('?') + 1
    if (startIndex > 0) {
      const searchArray = window.location.hash.substring(startIndex).split('=')
      if (searchArray[0] === 'recharge' && searchArray[1] === '1') {
        this.triggerPayConfigVisible(true)
      }
    }
  },

  methods: {
    ...mapActions([
      'getRechargeByPage',
      'getUserBalance',
      'triggerPayConfigVisible'
    ]),

    showPayStatusBtn(scope, code) {
      const status = Number(scope.row.status)
      if (status === code) {
        return true
      }
    },

    handleRecharge() {
      this.triggerPayConfigVisible(true)
    },

    continueToPay(row) {
      if (row.request_url) {
        window.open(row.request_url)
      }
    }
  }
}
</script>

<style lang='postcss' scoped>
.balance {
  margin-right: 10px;
  color: #0099ff;
  font-size: 2rem;
}
.separator {
  display: inline-block;
  margin-left: 7px;
  margin-right: 7px;
  width: 1px;
  height: 12px;
  vertical-align: middle;
  background-color: #666;
}
</style>
