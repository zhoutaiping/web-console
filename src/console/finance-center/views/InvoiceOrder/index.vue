<style lang="scss" scoped>
.r-box {
  float: right;
}
.input-box {
  width: 160px;
  margin-right: 5px;
}
</style>
<template>
  <console-page-layout>
    <DmToolbar>
      <div class="r-box">
        <el-select v-model="bindParams.status" clearable placeholder="订单状态" class="input-box" @change="$refs.DmData.initPage()">
          <el-option v-for="_ in Object.keys(order_status_map)" :key="_" :label="order_status_map[_]" :value="_"/>
        </el-select>
        <el-select v-model="bindParams.buy_type" clearable placeholder="订单类型" class="input-box" @change="$refs.DmData.initPage()">
          <el-option v-for="(_, _index) in buy_type_map" :key="_._index" :label="_" :value="_index"/>
        </el-select>
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
        class="margin-bottom"
      >
        <el-table :data="list">
          <el-table-column v-for="_ in column" :key="_.prop" :label="_.label">
            <template slot-scope="scope">
              {{ formartValue(scope.row, _.prop) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <template v-if="Number(scope.row.status)===0">
                <a @click="onpay(scope.row)">支付</a>
                <el-divider direction="vertical"/>
              </template>
              <template v-if="Number(scope.row.status)===0">
                <a @click="handleEsc(scope.row)">取消</a>
                <el-divider direction="vertical"/>
              </template>
              <router-link
                :to="{
                  name: 'finance-center.router.invoiceOrder__id',
                  params: {
                    id: scope.row.id
                  },
                  query: {
                    id: scope.row.id
                  }
              }">
                <a >详情</a>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>
<script>
// import Fetch from '@/api/fetch'
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: 'V4/order.order_list',
      API_METHOD: 'post',
      column: [
        { label: '订单号', prop: 'order_code' },
        { label: '产品套餐', prop: 'product' },
        { label: '类型', prop: 'buy_type' },
        { label: '创建时间', prop: 'created_at' },
        { label: '应付金额', prop: 'pay_price' },
        { label: '状态', prop: 'status' },
        { label: '支付/开通时间', prop: 'pay_time' }
      ],
      bindParams: {
        id: '',
        status: '',
        buy_type: ''
      },
      itemIndex: ['YD-WEBAQJS-TY', 'YD-WEBAQJS-GJ', 'YD-WEBAQJS-SY', 'YD-WEBAQJS-QJ', 'YD-WEBAQJS-DZ'],
      payItemDesc: {
        0: [
          { label: '套餐版本：', value: '体验版' },
          { label: '防护域名数量：', value: '不限制' },
          { label: '安全加速资源域：', value: '中国大陆' },
          { label: '安全加速节点数量：', value: '迷你型' },
          { label: '中国大陆带宽（边缘）：', value: '5 Mbps' },
          { label: '海外优化带宽（边缘）：', value: '不支持' },
          { label: '亚太CN2带宽（边缘）：', value: '不支持' },
          { label: '中国大陆带宽（中心）：', value: '不支持' },
          { label: '海外优化带宽（中心）：', value: '不支持' },
          { label: '网站快照：', value: '不支持' },
          { label: '精准访问控制：', value: '10 条/域名' }
        ],
        1: [
          { label: '套餐版本：', value: '高级版' },
          { label: '防护域名数量：', value: '10' },
          { label: '安全加速资源域：', value: '中国大陆+海外' },
          { label: '安全加速节点数量：', value: '通用型' },
          { label: '中国大陆带宽（边缘）：', value: '10 Mbps' },
          { label: '海外优化带宽（边缘）：', value: '10 Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '不支持' },
          { label: '中国大陆带宽（中心）：', value: '2 Mbps' },
          { label: '海外优化带宽（中心）：', value: '不支持' },
          { label: '网站快照：', value: '10 G' },
          { label: '精准访问控制：', value: '20 条/域名' }
        ], 2: [
          { label: '套餐版本：', value: '商业版' },
          { label: '防护域名数量：', value: '10' },
          { label: '安全加速资源域：', value: '中国大陆+海外+亚太CN2' },
          { label: '安全加速节点数量：', value: '增强型' },
          { label: '中国大陆带宽（边缘）：', value: '30 Mbps' },
          { label: '海外优化带宽（边缘）：', value: '30 Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '5 Mbps' },
          { label: '中国大陆带宽（中心）：', value: '20 Mbps' },
          { label: '海外优化带宽（中心）：', value: '5 Mbps' },
          { label: '网站快照：', value: '10 G' },
          { label: '精准访问控制：', value: '100 条/域名' }
        ],
        3: [
          { label: '套餐版本：', value: '旗舰版' },
          { label: '防护域名数量：', value: '10' },
          { label: '安全加速资源域：', value: '中国大陆+海外+亚太CN2' },
          { label: '安全加速节点数量：', value: '健壮型' },
          { label: '中国大陆带宽（边缘）：', value: '50 Mbps' },
          { label: '海外优化带宽（边缘）：', value: '50 Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '10 Mbps' },
          { label: '中国大陆带宽（中心）：', value: '50 Mbps' },
          { label: '海外优化带宽（中心）：', value: '10 Mbps' },
          { label: '网站快照：', value: '10 G' },
          { label: '精准访问控制：', value: '200 条/域名' }
        ],
        4: [
          { label: '套餐版本：', value: '定制版' },
          { label: '防护域名数量：', value: '按需' },
          { label: '安全加速资源域：', value: '按需' },
          { label: '安全加速节点数量：', value: '按需' },
          { label: '中国大陆带宽（边缘）：', value: '按需' },
          { label: '海外优化带宽（边缘）：', value: '按需' },
          { label: '亚太CN2带宽（边缘）：', value: '按需' },
          { label: '中国大陆带宽（中心）：', value: '按需' },
          { label: '海外优化带宽（中心）：', value: '按需' },
          { label: '网站快照：', value: '支持（存储容量按需）' },
          { label: '精准访问控制：', value: '按需' }
        ]

      }
    }
  },
  computed: {
    buy_type_map() {
      if (this.resData && this.resData.buy_type_map) {
        return this.resData.buy_type_map
      } else {
        return []
      }
    },
    order_status_map() {
      if (this.resData && this.resData.order_status_map) {
        return this.resData.order_status_map
      } else {
        return {}
      }
    }
  },
  methods: {
    async onpay(row) {
      const index = this.itemIndex.findIndex(i => i === row.meal_flag)
      const desc = this.payItemDesc[index]
      const Item = {
        meal_flag: row.meal_flage,
        desc: desc,
        buy_num: 1,
        buy_time: row.buy_time,
        pay_price: row.pay_price,
        isVerify: false,
        diff_price_time: row.diff_price_time,
        buy_time_text: ''
      }

      localStorage.setItem('webscdnItem', JSON.stringify(Item))
      localStorage.setItem('order_id', row.id)
      localStorage.setItem('order_code', row.order_code)
      localStorage.setItem('webscdnPayStatus', 1)
      await this.Fetch.post('/V4/order.order_verify', { meal_flag: row.meal_flag }).then(res => {
        this.order_verify = res
        localStorage.setItem('isVerify', JSON.stringify(res))
        window.location.href = '/webscdn-pay'
      }).catch(e => {})
    },
    handleEsc(row) {
      this.$confirm('此操作将取消订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Fetch.post('/V4/order.order_cancle', { order_code: row.order_code }).then(res => {
          this.$message.success('操作成功！')
          this.$refs.DmData.initPage()
        }).catch(e => { this.$refs.DmData.initPage() })
      }).catch(() => { })
    },
    formartValue(row, prop) {
      let _text = ''
      switch (prop) {
        case 'product' :
          _text = row.detail.meal.product_name + '【' + row.detail.meal.meal_name + '】'
          break
        case 'buy_type':
          _text = this.buy_type_map[row[prop]] || ''
          break
        case 'status':
          _text = this.order_status_map[row[prop]] || ''
          break
        default :
          _text = row[prop]
          break
      }
      return _text
    }
  }
}
</script>
