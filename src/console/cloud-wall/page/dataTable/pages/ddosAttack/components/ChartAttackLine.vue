<template>
  <DmCard
    :loading="loading"
    title="DDoS 攻击趋势"
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

  props: {
    bindParams: Object
  },

  data() {
    return {
      loading: true,
      params: {},
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
    async fetchData() {
      this.loading = true
      const params = {
        ...this.reportParams
      }
      const data = await this.Fetch.get('V4/statistic.tjkd.plus.ddos.line', params)
      const { unit } = data.trend.y_data
      this.options.baseUnit = unit
      this.options.yAxisName = [`单位（${unit}）`]
      this.chartData = formatData(data.trend, ['时间', '攻击大小'])
      this.loading = false
    }
  }
}
</script>
