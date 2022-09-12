<template>
  <DmCard
    :loading="loading"
    :title="title"
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
import ChartLine from '@/components/Chart/ChartLine'
import cwReport from '../../../../../mixins/cwReport'

export default {
  components: { ChartLine },

  mixins: [cwReport],

  data() {
    return {
      loading: true,
      title: 'DDoS攻击统计',
      chartData: {},
      options: {
        yAxisName: [],
        baseUnit: '',
        grid: {
          top: 50
        }
      }
    }
  },

  methods: {
    async fetchData(params) {
      this.loading = true
      const data = await this.Fetch.get('V4/statistic.tjkd.plus.ddos.detailLine', params)
      const unit = 'Mbps'
      const yData = data.echart.yAxis__data.map(_ => Number(_.trafficin_0))
      const trend = {
        x_data: data.echart.xAxis_data,
        y_data: {
          data: yData
        }
      }
      const max = Math.max(...yData)
      this.title = `DDoS攻击统计（攻击峰值：${max} ${unit}）`
      this.options.yAxisName = [`单位（${unit}）`]
      this.options.baseUnit = unit
      this.chartData = formatData(trend, ['时间', '攻击峰值'], 'MM-DD H:mm:ss')
      this.loading = false
    }
  }
}
</script>
