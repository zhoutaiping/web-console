<template>
  <div>
    <ToolbarCC @init="fetchData" />
    <!-- INDEX -->
    <el-row
      :gutter="12"
      class="margin-top"
    >
      <el-col
        v-for="(item, index) in indexOptions"
        :span="8"
        :key="index"
      >
        <DmCard>
          <BlockItemNumber
            :height="120"
            :ref="`Index${item.key}`"
            :options="item"
          />
        </DmCard>
      </el-col>
    </el-row>
    <el-row
      :gutter="12"
      class="margin-top"
    >
      <el-col :span="12">
        <!-- TOP5 攻击IP -->
        <CardAttackIpTop ref="CardAttackIpTop" />
      </el-col>
      <el-col :span="12">
        <!-- TOP10 攻击类型 -->
        <CardAttackTypeTop ref="CardAttackTypeTop" />
      </el-col>
    </el-row>
    <!-- 攻击IP地理分布 -->
    <CardAttackMap
      ref="CardAttackMap"
      class="margin-top"
    />
    <!-- 攻击趋势 -->
    <CardAttackLine
      ref="CardAttackLine"
      class="margin-top"
    />
    <!-- 入侵事件 -->
    <CardTableWebShellLog
      ref="CardTableWebShellLog"
      class="margin-top"
    />
    <!-- 定向攻击事件 -->
    <CardTableWAFAttackLog
      ref="CardTableWAFAttackLog"
      class="margin-top"
    />
    <!-- 扫描事件 -->
    <CardTableScanLog
      ref="CardTableScanLog"
      class="margin-top"
    />
  </div>
</template>

<script>
import BlockItemNumber from '@/components/Block/BlockItemNumber'
import ToolbarCC from '../components/ToolbarCC'
import CardAttackTypeTop from './components/CardAttackTypeTop'
import CardAttackIpTop from './components/CardAttackIpTop'
import CardTableScanLog from './components/CardTableScanLog'
import CardTableWebShellLog from './components/CardTableWebShellLog'
import CardTableWAFAttackLog from './components/CardTableWAFAttackLog'
import CardAttackLine from './components/CardAttackLine'
import CardAttackMap from './components/CardAttackMap'

export default {
  components: {
    BlockItemNumber,
    ToolbarCC,
    CardAttackTypeTop,
    CardAttackIpTop,
    CardTableScanLog,
    CardTableWebShellLog,
    CardTableWAFAttackLog,
    CardAttackLine,
    CardAttackMap
  },

  data() {
    return {
      params: {},
      indexOptions: [
        {
          title: '攻击总次数',
          key: 'AttackTotal'
        },
        {
          title: '攻击类型总数',
          key: 'AttackType'
        },
        {
          title: '攻击IP总数',
          key: 'AttackIP'
        }
      ]
    }
  },

  methods: {
    async fetchData(params) {
      this.params = params

      this.$nextTick(async() => {
        this.$refs.IndexAttackTotal[0].startLoading()
        this.$refs.IndexAttackType[0].startLoading()
        this.$refs.IndexAttackIP[0].startLoading()
        this.$refs.CardAttackIpTop.startLoading()
        this.$refs.CardAttackTypeTop.startLoading()
        this.$refs.CardAttackLine.startLoading()
        this.$refs.CardAttackMap.startLoading()
        this.$refs.CardTableWebShellLog.fetchInit(params)
        this.$refs.CardTableWAFAttackLog.fetchInit(params)
        this.$refs.CardTableScanLog.fetchInit(params)

        const data = await this.Fetch.post('V4/stati.data.get', {
          router: 'waf.report.stats',
          ...params
        })
        this.updateIndex(data)
        this.$refs.CardAttackIpTop.setData(data)
        this.$refs.CardAttackTypeTop.setData(data)
        this.$refs.CardAttackLine.setData(data.waf_attack_name_line)
        this.$refs.CardAttackMap.setData({
          china: data.top_province,
          world: data.top_country
        })
      })
    },

    async updateIndex(data) {
      this.$refs.IndexAttackTotal[0].updateValue({
        value: data.waf_attack_total_times,
        unit: '次'
      } || 0)
      this.$refs.IndexAttackType[0].updateValue({
        value: data.waf_attack_name_times,
        unit: '种'
      } || 0)
      this.$refs.IndexAttackIP[0].updateValue({
        value: data.waf_attack_ip_times,
        unit: '个'
      } || 0)
    }
  }
}
</script>
