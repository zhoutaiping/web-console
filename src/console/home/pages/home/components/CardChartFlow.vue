<template>
  <DmCard
    :class="b()"
    :loading="loading"
    title="近7日CDN流量使用趋势"
  >
    <ChartLine
      :options="options"
      :height="300"
      :data="chartData"
    />
  </DmCard>
</template>

<script>
import { format, addDays } from 'date-fns'
import create from '@/utils/create-basic'
import { formatData } from '@/utils/chart'

export default create({
  name: 'CardChartFlow',

  data() {
    return {
      loading: true,
      options: {
        max: 1,
        grid: {
          top: 20,
          left: 80,
          right: 40,
          bottom: 30
        },
        yAxisType: ['byte', ''],
        legendVisible: false,
        labelMap: {
          value: '流量'
        }
      },
      chartData: {}
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const params = {
        start_time: `${format(addDays(new Date(), -6), 'YYYY-MM-DD')} 23:59:59`,
        end_time: `${format(new Date(), 'YYYY-MM-DD')} 00:00:00`,
        router: 'cdn.domain.node.flow.bandwidth'
      }
      const data = await this.Fetch.post('V4/stati.data.get', params)
      const trend = data.total_flow.trend
      const chartData = formatData({
        x_data: trend.x_data,
        y_data: {
          data: trend.y_data
        }
      }, ['时间', '流量'])
      this.options.max = trend.y_data.length ? Math.max(...trend.y_data) : 1
      this.chartData = chartData
      this.loading = false
    }
  }
})
</script>
