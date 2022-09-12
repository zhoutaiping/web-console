<template>
  <div>
    <ToolbarCC
      :meal-flag="['YD-WAFQJB']"
      @init="fetchData"
    />
    <BotIndex ref="BotIndex" />
    <ChartMLine
      ref="ChartBotTime"
      :loading="loading"
      :options="{
        baseUnit: '次',
        yAxisType: ['KMB', '']
      }"
      title="Bot请求次数趋势"
      style="margin-top: 16px"
    />
    <ChartMLine
      ref="ChartBotFlow"
      :loading="loading"
      :options="{
        yAxisType: ['byte', '']
      }"
      title="Bot访问流量趋势"
      style="margin-top: 16px"
    />
    <ChartBotDynamicStatic
      ref="ChartBotDynamicStatic"
      style="margin-top: 16px"
    />
    <TableBotAnalysisKnow
      ref="TableBotAnalysisKnow"
      :is-support="isSupport"
      style="margin-top: 16px"
    />
    <TableBotAnalysisUnknow
      ref="TableBotAnalysisUnknow"
      :is-support="isSupport"
      style="margin-top: 16px"
    />
  </div>
</template>

<script>
import domainMixins from '@/mixins/domain'
import ToolbarCC from '../../components/ToolbarCC'
import BotIndex from './components/BotIndex'
import ChartMLine from './components/ChartMLine'
import ChartBotDynamicStatic from './components/ChartBotDynamicStatic'
import TableBotAnalysisKnow from './components/TableBotAnalysisKnow'
import TableBotAnalysisUnknow from './components/TableBotAnalysisUnknow'

export default {
  components: { ToolbarCC, BotIndex, ChartMLine, ChartBotDynamicStatic, TableBotAnalysisKnow, TableBotAnalysisUnknow },

  mixins: [domainMixins],

  data() {
    return {
      isSupport: true,
      chartData: {},
      loading: true
    }
  },

  async created() {
    await this.domainFetchPlanInfo()
    const isSupport = ['YD-WEBAQJS-DZ', 'YD-WEBAQJS-QJ'].includes(this.domainPlanInfo.meal_flag)
    if (!isSupport) this.$message.warning('当前套餐版本不支持，请升级套餐至旗舰版及以上')
    this.isSupport = isSupport
  },

  methods: {
    async fetchChart(params, router) {
      const data = await this.Fetch.post('V4/stati.data.get', {
        router_type: 'bot',
        meal_flag: ['YD-WAFQJB'],
        ...params,
        router
      })
      delete data._status

      Object.keys(data).forEach(key => {
        this.$set(this.chartData, key, data[key])
      })
    },

    initChart() {
      const data = this.chartData

      const ChartBotTime = {
        总请求: data.total_times_trend,
        合法Bot请求: data.bot_legal_times_trend,
        恶意Bot请求: data.bot_illegal_times_trend,
        未知Bot请求: data.bot_unknown_times_trend,
        总回源: data.total_fetch_source_times_trend,
        合法Bot回源请求: data.bot_legal_fetch_source_times_trend,
        恶意Bot回源请求: data.bot_illegal_fetch_source_times_trend,
        未知Bot回源请求: data.bot_unknown_fetch_source_times_trend
      }

      const ChartBotFlow = {
        总流量: data.total_flow_trend,
        回源流量: data.total_fetch_source_flow_trend,
        合法Bot流量: data.bot_illegal_flow_trend,
        恶意Bot流量: data.bot_illegal_flow_trend,
        未知Bot流量: data.bot_unknown_flow_trend
      }

      this.$refs.ChartBotTime.setData(ChartBotTime)
      this.$refs.ChartBotFlow.setData(ChartBotFlow)
    },

    async fetchData(params) {
      this.loading = true
      this.$nextTick(() => {
        this.$refs.BotIndex.fetchData(params)
        this.$refs.TableBotAnalysisKnow.fetchList(params)
        this.$refs.TableBotAnalysisUnknow.fetchList(params)
        this.$refs.ChartBotDynamicStatic.fetchData(params)
      })
      await this.fetchChart(params, 'bot.times.flow.total')
      await this.fetchChart(params, 'bot.times.flow.known')
      await this.fetchChart(params, 'bot.times.flow.unknown')
      this.loading = false

      this.$nextTick(() => {
        this.initChart()
      })
    }
  }
}
</script>
