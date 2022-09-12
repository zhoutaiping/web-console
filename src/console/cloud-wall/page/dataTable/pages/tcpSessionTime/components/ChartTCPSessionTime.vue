<template>
  <DmCard
    :loading="loading"
    title="TCP 会话时长"
    height="400"
  >

    <template slot="action">
      <yd-form-select
        v-model="params.ip"
        :selects="reportSelectIP"
        default-text="全部IP"
        style="width: 160px"
        @change="fetchData"
      />
      <yd-button-checkbox
        :checks="reportSelectPort"
        v-model="params.port"
        placeholder="选择端口"
        item-name="端口"
        style="margin-left: 10px"
        @submit="fetchData"
      />
      <yd-form-select
        v-model="params.interval"
        :selects="OPTIONS_TIMES"
        default-text="间隔时间"
        style="margin-left: 10px; width: 120px"
        @change="fetchData"
      />
    </template>
    <ChartLine
      :loading="false"
      :data="chartData"
      :options="options"
      :height="350"
    />
  </DmCard>
</template>

<script>
import { formatData } from '@/utils/chart'
import ChartLine from '@/components/Chart/ChartLine'
import { OPTIONS_TIMES } from '@/console/taichi-plus/constants/label'
import cwReport from '../../../../../mixins/cwReport'

export default {
  components: { ChartLine },

  mixins: [cwReport],

  props: {
    bindParams: Object
  },

  data() {
    return {
      OPTIONS_TIMES,
      loading: true,
      params: {
        ip: '',
        port: [],
        interval: '1m'
      },
      chartData: {},
      options: {
        yAxisName: ['单位'],
        grid: {
          top: 50
        }
      }
    }
  },

  methods: {
    async fetchData() {
      this.loading = true
      const params = {
        ...this.params,
        ...this.reportParams
      }
      const data = await this.Fetch.post('V4/statistic.tjkd.plus.tcp.cc.avg.sessiontime.line', params)
      const { unit } = data.trend.y_data
      this.options.yAxisName = [`单位（${unit}）`]
      this.chartData = formatData(data.trend, ['时间', '会话时长'])
      this.loading = false
    }
  }
}
</script>
