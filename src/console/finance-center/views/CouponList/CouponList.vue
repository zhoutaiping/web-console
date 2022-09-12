<template>
  <console-page-layout>
    <ComboTable
      :total="orderTotal"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @on-size-change="getCouponList"
      @on-current-change="getCouponList"
    >
      <div slot="body">
        <DmTable
          min-height
          class="margin-bottom"
        >
          <el-table :data="couponList">
            <el-table-column
              prop="name"
              label="名称"
            />
            <el-table-column
              prop="code"
              label="优惠码"
              width="100"
            />
            <el-table-column
              :formatter="formatAmount"
              prop="amount"
              label="优惠"
              align="right"
            />
            <el-table-column
              :formatter="formatMinAmout"
              prop="min_order_amount"
              label="最低消费额/元"
              min-width="110"
              align="right"
            />
            <el-table-column
              prop="order_code"
              label="绑定订单号"
              min-width="200"
            />
            <el-table-column
              prop="start_date"
              label="生效时间"
              width="95"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.start_date.split(' ')[0] }}
                <br>
                {{ scope.row.start_date.split(' ')[1] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="end_date"
              label="过期时间"
              width="95"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.end_date.split(' ')[0] }}
                <br>
                {{ scope.row.end_date.split(' ')[1] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="use_range"
              label="使用范围"
              min-width="80"
              align="right"
            />
            <el-table-column
              prop="use_status_desc"
              label="使用状态"
              align="right"
              min-width="80"
            >
              <template slot-scope="scope">
                <i
                  v-if="scope.row.use_status_desc === '已过期'"
                  class="fail-dot"
                />
                <i
                  v-if="scope.row.use_status_desc === '已使用'"
                  class="succceed-dot"
                />
                <i
                  v-if="scope.row.use_status_desc === '未使用'"
                  class="process-dot"
                />
                <span>{{ scope.row.use_status_desc }}</span>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </div>
    </ComboTable>
  </console-page-layout>
</template>

<script>
import ComboTable from '@/components/ComboTable/ComboTable'
import {
  mapActions
} from 'vuex'

export default {
  components: {
    ComboTable
  },

  data() {
    return {
      pageSizes: [5, 10, 20],
      pageSize: 5
    }
  },
  computed: {
    couponList() {
      return this.$store.state.coupon.list
    },
    orderTotal() {
      return this.$store.state.coupon.total
    }
  },
  created() {
    this.getCouponList(1, this.pageSize)
  },
  methods: {
    ...mapActions([
      'getCouponByPage'
    ]),
    getCouponList(current, size) {
      this.getCouponByPage({
        page: current,
        per_page: size
      })
    },
    formatAmount(row) {
      const amount = Number(row.amount).toFixed(2)
      if (row.type === 'F') {
        return `${amount} 元`
      } else if (row.type === 'P') {
        return `${amount * 10} 折`
      } else {
        throw new Error('lack of type')
      }
    },
    formatMinAmout(row) {
      const minOrderMmount = Number(row.min_order_amount).toFixed(2)
      if (isNaN(minOrderMmount)) {
        return row.min_order_amount
      } else {
        return minOrderMmount
      }
    }
  }
}
</script>
