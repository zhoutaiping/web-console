<template>
  <DmCard
    :loading="loading"
    title="CC攻击趋势"
    height="400"
  >
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

export default {
  props: {
    bindParams: Object
  },

  data() {
    return {
      loading: true,
      params: {},
      chartData: {},
      options: {
        baseUnit: '次',
        grid: {
          top: 50
        }
      }
    }
  },

  methods: {
    startLoading() {
      this.loading = true
    },

    async setData(data) {
      this.chartData = formatData({
        x_data: data.trend.x_data,
        y_data: {
          data: data.trend.y_data
        }
      }, ['时间', '攻击QPS'])
      this.loading = false
    }
  }
}
</script>
