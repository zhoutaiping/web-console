<template>
  <console-page-layout>
    <ComboTable
      :total="orderTotal"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @on-size-change="getOrderList"
      @on-current-change="getOrderList"
    >
      <div slot="body">
        <DmTable
          min-height
          class="margin-bottom"
        >
          <el-table :data="orderList">
            <el-table-column
              prop="order_code"
              label="订单编号"
              min-width="200"
            />
            <el-table-column
              :formatter="formatProductName"
              prop="product_name"
              label="产品"
            />
            <el-table-column
              :formatter="formatMealName"
              prop="meal_name"
              label="套餐"
              min-width="80"
            />
            <el-table-column
              :formatter="formatType"
              prop="type"
              label="类型"
            />
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="95"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.created_at.split(' ')[0] }}
                <br>
                {{ scope.row.created_at.split(' ')[1] }}
              </template>
            </el-table-column>
            <el-table-column
              :formatter="formatPayPrice"
              prop="amount"
              label="实付金额/元"
              width="100"
              align="right"
            />
            <el-table-column
              prop="status"
              label="状态"
              class-name="status"
            >
              <template slot-scope="scope">
                <div>
                  <i
                    v-if="scope.row.status === '0'"
                    class="fail-dot"
                  />
                  <i
                    v-if="scope.row.status === '1'"
                    class="succceed-dot"
                  />
                  <i
                    v-if="scope.row.status === '2' || scope.row.status === '3'"
                    class="again-dot"
                  />
                  <i
                    v-if="scope.row.status === '4'"
                    class="process-dot"
                  />
                  <span>{{ order_status_list[scope.row.status] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="pay_time"
              label="支付时间"
              width="95"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.pay_time.split(' ')[0] }}
                <br>
                {{ scope.row.pay_time.split(' ')[1] }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="right"
              min-width="120"
            >
              <template slot-scope="scope">
                <template v-if="showOperator(scope,0)">
                  <el-popover
                    ref="popover5"
                    v-model="cancelTipArray[scope.$index]"
                    placement="top"
                    width="80"
                  >
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="dbCancel(scope)"
                      >取消</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleCancel(scope)"
                      >确定</el-button>
                    </div>
                  </el-popover>
                  <el-button
                    v-popover:popover5
                    type="text"
                  >撤销订单</el-button>
                  <span class="separator" />
                </template>
                <template v-if="showOperator(scope,0)">
                  <el-button
                    type="text"
                    @click="handlePay(scope)"
                  >支付</el-button>
                  <span class="separator" />
                </template>
                <template v-if="showOperator(scope,1)">
                  <el-button
                    type="text"
                    @click="handleApply(scope)"
                  >申请发票</el-button>
                  <span class="separator" />
                </template>
                <template v-if="showOperator(scope,2)">
                  <i class="succceed-dot" />
                  <el-button
                    type="text"
                    @click="showInvoiceHref(scope)"
                  >发票已申请</el-button>
                  <span class="separator" />
                </template>
                <router-link
                  :to="{
                    name: 'finance-center.router.orderList__id',
                    params: {
                      id: scope.row.id
                    },
                    query: {
                      id: scope.row.id,
                      status: scope.row.status
                    }
                }">
                  <el-button type="text">详情</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </div>
    </ComboTable>
    <InvoiceConfig />
  </console-page-layout>
</template>

<script>
import ComboTable from '@/components/ComboTable/ComboTable'
import InvoiceConfig from './Dialogs/InvoiceConfig'
import formatText from '@/utils/formatText'
import {
  mapActions
} from 'vuex'

export default {
  components: {
    ComboTable,
    InvoiceConfig
  },
  data() {
    return {
      cancelTipArray: [],
      pageSizes: [5, 10, 20],
      pageSize: 5,
      // only for cache
      product_list: [],
      meal_list: [],
      // packageType
      order_meal_type_list: [],
      // product list
      product_meal_list: [],
      // order status
      order_status_list: []
    }
  },
  computed: {
    orderList() {
      this.$store.state.order.list.forEach((item, index, arr) => {
        if (item.status === 0) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.cancelTipArray.push(false)
        }
      })
      return this.$store.state.order.list
    },
    orderTotal() {
      return this.$store.state.order.total
    },
    changeOrderList() {
      return this.$store.state.order.changeOrderList
    }
  },
  watch: {
    changeOrderList(val) {
      if (val) {
        window.location.reload()
      }
    }
  },
  created() {
    this.getOrderList(1, this.pageSize)
  },
  methods: {
    ...mapActions([
      'getOrderByPage',
      'cancelOrderByCode',
      'triggerInvoiceConfigVisible'
    ]),
    getOrderList(current, size) {
      this.getOrderByPage({
        page: current,
        per_page: size
      }).then(response => {
        const data = response.data.data
        const { list, total } = data
        this.$store.commit({
          type: 'RECEIVE_ORDER_BY_PAGE',
          list
        })
        this.$store.commit({
          type: 'RECEIVE_ORDER_TOTAL',
          total
        })
        this.order_meal_type_list = data.order_meal_type_list
        this.product_list = data.product_meal_list.product_list
        this.meal_list = data.product_meal_list.meal_list
        this.order_status_list = data.order_status_list
      })
    },
    showOperator(scope, code) {
      const status = Number(scope.row.status)
      const applyInvoice = Number(scope.row.apply_invoice)
      if (status === 0 && code === 0) {
        return true
      } else if (status === 1 && applyInvoice === 0 && code === 1) {
        return true
      } else if (status === 1 && applyInvoice === 1 && code === 2) {
        return true
      } else {
        return false
      }
    },
    handleCancel(scope) {
      this.cancelTipArray.splice(scope.$index, 1, false)
      this.cancelOrderByCode({
        order_code: scope.row.order_code
      }).then(() => {
        this.getOrderList(1, this.pageSize)
      })
    },
    dbCancel(scope) {
      this.cancelTipArray.splice(scope.$index, 1, false)
    },
    handlePay(scope) {
      const coupon_code = scope.row.coupon_code
      this.$router.push({
        name: 'finance-center.router.orderList.pay',
        query: {
          order_code: scope.row.order_code,
          coupon_code
        }
      })
    },
    handleApply(scope) {
      const code = scope.row.order_code
      this.$store.commit({
        type: 'RECEIVE_ORDER_CODE',
        code
      })
      this.triggerInvoiceConfigVisible(true)
    },
    showInvoiceHref(scope) {
      const order_code = scope.row.order_code
      this.$router.push({
        name: 'finance-center.router.invoiceList',
        query: {
          order_code
        }
      })
    },
    formatProductName(row) {
      const productFlag = row.product_flag
      return this.product_list[productFlag]
    },
    formatMealName(row) {
      const mealFlag = row.meal_flag
      return this.meal_list[mealFlag]
    },
    formatType(row) {
      const orderMealType = row.order_meal_type
      return this.order_meal_type_list[orderMealType]
    },
    formatMoney(val) {
      return formatText('money', val)
    },
    formatPayPrice(row) {
      return `${row.pay_price}`
    }
  }
}
</script>

<style lang="scss" scoped>
.item,
.iteminfo {
  display: inline-block;
  vertical-align: middle;
}
.item {
  min-width: 5em;
  /*padding-right: 1em;*/
}
.discount {
  margin-left: -0.4em;
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

<style>
.status.is-leaf .cell {
  padding-left: 24px;
}
.el-button.el-button--text {
  line-height: 16px;
  height: 16px;
}
</style>
