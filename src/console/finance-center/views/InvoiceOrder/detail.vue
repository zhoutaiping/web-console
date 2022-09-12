<style lang="scss" scoped>
.title-box {
    height: 40px;
    line-height: 40px;
    margin-top: 16px;
    margin-bottom: 20px;
    padding: 0px 12px;
    color: #303133;
    // border: 1px solid #e8e8e8;
    // background: #fff;
    border-left: 3px solid $--color-primary;
}
</style>
<template>
  <console-page-layout>
    <DmAlert>
      <h3 class="title-box">订单概要</h3>
      <el-row :gutter="12">
        <el-col :span="6">
          订单编号 ： {{ list[0] && list[0].order_code }}
        </el-col>
        <el-col :span="6">
          支付状态：{{ list[0] && order_status_map[list[0].status] }}
        </el-col>
        <el-col :span="6">
          创建时间：{{ list[0] && list[0].created_at }}
        </el-col>
        <el-col :span="6">
          支付时间：{{ list[0] && list[0].pay_time }}
        </el-col>
      </el-row>
    </DmAlert>
    <DmData
      ref="DmData"
      :show-pagination="false"
      @init="fetchList"
    >
      <DmTable
        class="margin-bottom"
      >
        <el-table :data="list">
          <el-table-column v-for="_ in column" :key="_.prop" :label="_.label" :width="_.width">
            <template slot-scope="scope">
              <div v-if="_.prop === 'order_start_time'">
                {{ scope.row.order_start_time }}<br>
                {{ scope.row.order_end_time }}
              </div>
              <div v-else-if="_.prop === 'desc'">
                <div v-for="(_i,_iindex) in getDescItem(formartValue(scope.row, _.prop) )" :key="_iindex">
                  <span style="width:150px;display: inline-block;">{{ _i.label }}</span>
                  <span style="width:300px">
                    <template v-if="_i.key">
                      {{ getkuorongValue(scope.row,_i.key,_i.min) + _i.min }}{{ _i.unit }}
                      <span>
                        （基础：{{ _i.min }}{{ _i.unit }} 扩容：{{ getkuorongValue(scope.row,_i.key,_i.min) }}{{ _i.unit }}）
                      </span>
                    </template>
                    <template v-else>
                      {{ _i.value }}
                    </template>
                  </span>
                </div>
              </div>
              <span v-else>
                {{ formartValue(scope.row, _.prop) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
export default {
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: 'V4/order.order_list',
      API_METHOD: 'post',
      bindParams: {
        id: this.$route.query.id || this.$route.params.id || ''
      },
      column: [
        { label: '产品', prop: 'product' },
        { label: '具体配置', prop: 'desc' },
        { label: '数量', prop: 'number', width: 120 },
        { label: '付款方式', prop: 'pay_type', width: 120 },
        { label: '起止时间', prop: 'order_start_time' },
        { label: '金额', prop: 'pay_price', width: 200 }
      ],
      itemIndex: ['YD-WEBAQJS-TY', 'YD-WEBAQJS-GJ', 'YD-WEBAQJS-SY', 'YD-WEBAQJS-QJ', 'YD-WEBAQJS-DZ'],
      payItemDesc: {
        0: [
          { label: '套餐版本：', value: '体验版' },
          { label: '防护域名包：', value: '不限制' },
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
          { label: '防护域名包：', value: '10', min: 1, key: 'domain_packet' },
          { label: '安全加速资源域：', value: '中国大陆+海外' },
          { label: '安全加速节点数量：', value: '通用型' },
          { label: '中国大陆带宽（边缘）：', value: '10 Mbps', min: 10, key: 'mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（边缘）：', value: '10 Mbps', min: 10, key: 'overseas_international_bandwidth', unit: ' Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '不支持' },
          { label: '中国大陆带宽（中心）：', value: '2 Mbps', min: 10, key: 'mainland_china_mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（中心）：', value: '不支持', min: 2, key: 'mainland_china_overseas_bandwidth', unit: ' Mbps' },
          { label: '网站快照：', value: '10 G', min: 10, key: 'website_snapshot', unit: ' G' },
          { label: '精准访问控制：', value: '20 条/域名', min: 20, key: 'fw_domain_rule_total', unit: ' 条/域名' },
          { label: '购买数量：', value: '1' }
        ], 2: [
          { label: '套餐版本：', value: '商业版' },
          { label: '防护域名包：', value: '10', min: 1, key: 'domain_packet' },
          { label: '安全加速资源域：', value: '中国大陆+海外+亚太CN2' },
          { label: '安全加速节点数量：', value: '增强型' },
          { label: '中国大陆带宽（边缘）：', value: '30 Mbps', min: 30, key: 'mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（边缘）：', value: '30 Mbps', min: 30, key: 'overseas_international_bandwidth', unit: ' Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '5 Mbps', min: 5, key: 'overseas_china_acceleration_bandwidth', unit: ' Mbps' },
          { label: '中国大陆带宽（中心）：', value: '20 Mbps', min: 20, key: 'mainland_china_mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（中心）：', value: '5 Mbps', min: 5, key: 'mainland_china_overseas_bandwidth', unit: ' Mbps' },
          { label: '网站快照：', value: '10 G', min: 10, key: 'website_snapshot', unit: ' G' },
          { label: '精准访问控制：', value: '100 条/域名', min: 100, key: 'fw_domain_rule_total', unit: ' 条/域名' },
          { label: '购买数量：', value: '1' }
        ],
        3: [
          { label: '套餐版本：', value: '旗舰版' },
          { label: '防护域名包：', value: '10', min: 1, key: 'domain_packet' },
          { label: '安全加速资源域：', value: '中国大陆+海外+亚太CN2' },
          { label: '安全加速节点数量：', value: '健壮型' },
          { label: '中国大陆带宽（边缘）：', value: '50 Mbps', min: 50, key: 'mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（边缘）：', value: '50 Mbps', min: 50, key: 'overseas_international_bandwidth', unit: ' Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '10 Mbps', min: 10, key: 'overseas_china_acceleration_bandwidth', unit: ' Mbps' },
          { label: '中国大陆带宽（中心）：', value: '50 Mbps', min: 50, key: 'mainland_china_mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（中心）：', value: '10 Mbps', min: 10, key: 'mainland_china_overseas_bandwidth', unit: ' Mbps' },
          { label: '网站快照：', value: '10 G', min: 10, key: 'website_snapshot', unit: ' G' },
          { label: '精准访问控制：', value: '200 条/域名', min: 200, key: 'fw_domain_rule_total', unit: ' 条/域名' },
          { label: '购买数量：', value: '1' }
        ],
        4: [
          { label: '套餐版本：', value: '定制版' },
          { label: '防护域名包：', value: '按需' },
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
    order_status_map() {
      if (this.resData && this.resData.order_status_map) {
        return this.resData.order_status_map
      } else {
        return {}
      }
    }
  },
  methods: {

    formartValue(row, prop) {
      let _text = ''
      switch (prop) {
        case 'product' :
          _text = row.detail.meal.product_name + '【' + row.detail.meal.meal_name + '】'
          break
        case 'number' :
          _text = 1
          break
        case 'pay_type' :
          _text = '余额支付'
          break
        case 'desc' :
          _text = row['meal_flag']
          break
        default :
          _text = row[prop]
          break
      }
      return _text
    },
    getDescItem(val) {
      const index = this.itemIndex.findIndex(i => i === val)
      if (index > -1) {
        return this.payItemDesc[index]
      } else {
        return []
      }
    },
    getkuorongValue(rwo, key, min) {
      let _text = ''
      if (rwo && rwo.detail) {
        const detail = JSON.parse(JSON.stringify(rwo.detail))
        const item = detail.buy_kuorong[key]
        _text = item && item['buy_num'] ? item['buy_num'] : 0
      }
      return _text
    }
  }
}
</script>
