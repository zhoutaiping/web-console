<template>
  <console-page-layout>
    <ComboTable
      :total="invoiceTotal"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @on-size-change="getInvoiceList"
      @on-current-change="getInvoiceList"
    >
      <div slot="header_right">
        <el-input
          v-model="keyword"
          :on-icon-click="handleFilter"
          class="filter"
          icon="search"
          placeholder="请输入需要筛选的发票信息"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div slot="body">
        <DmTable
          :loading="isLoaded"
          min-height
          class="margin-top margin-bottom"
        >
          <el-table :data="invoiceList">
            <el-table-column
              :formatter="formatInvoiceCode"
              prop="invoice_code"
              label="发票单号"
              min-width="200"
            />
            <el-table-column
              prop="order_code"
              label="对应订单号"
              min-width="200"
            />
            <el-table-column
              prop="product_flag_desc"
              label="订单所属套餐"
              min-width="120"
            />
            <el-table-column
              prop="price"
              label="发票金额/元"
              width="100"
              align="right"
            />
            <el-table-column
              label="发票申请时间"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.created_at.split(' ')[0] }}
                <br>
                {{ scope.row.created_at.split(' ')[1] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status_desc"
              label="状态"
            />
            <el-table-column
              label="操作"
              align="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="showInvoiceDetails(scope.row)"
                >发票详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </div>
    </ComboTable>
    <InvoiceInfo />
  </console-page-layout>
</template>

<script>
import ComboTable from '@/components/ComboTable/ComboTable'
import InvoiceInfo from './Dialogs/invoiceInfo'
import {
  mapActions
} from 'vuex'

export default {
  components: {
    InvoiceInfo,
    ComboTable
  },

  data() {
    return {
      // state manage
      pageSizes: [5, 10, 20],
      pageSize: 5,
      resetPage: true,
      keyword: ''
    }
  },
  computed: {
    invoiceList() {
      return this.$store.state.invoice.list
    },
    invoiceTotal() {
      return this.$store.state.invoice.total
    },
    isLoaded() {
      return this.$store.state.invoice.isLoaded
    }
  },
  created() {
    const searchCond = this.$route.query.order_code
    if (searchCond) {
      this.keyword = searchCond
      this.getInvoiceByPage({
        page: 1,
        per_page: this.pageSize,
        searchCond
      })
    } else {
      this.getInvoiceList(1, this.pageSize)
    }
  },
  methods: {
    ...mapActions([
      'triggerInvoiceInfoVisible',
      'getInvoiceByPage'
    ]),
    getInvoiceList(current, size) {
      if (this.resetPage) {
        this.getInvoiceByPage({
          page: current,
          per_page: size
        })
      }
    },
    showInvoiceDetails(row) {
      this.$store.commit({
        type: 'RECEIVE_INVOICE_ID',
        id: row.id
      })
      this.$store.commit({
        type: 'RECEIVE_INVOICE_STATUS',
        status: row.status
      })
      this.triggerInvoiceInfoVisible(true)
    },
    handleFilter() {
      this.resetPage = false
      this.getInvoiceByPage({
        page: 1,
        per_page: this.pageSize,
        searchCond: this.keyword
      })
    },
    formatInvoiceCode(row) {
      if (row.status_desc === '待处理' || row.status_desc === '处理中') {
        return ''
      } else {
        return row.invoice_code
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  width: 250px;
}
</style>
