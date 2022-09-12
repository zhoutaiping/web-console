<template>
  <DmCard
    :loading="loading"
    title="TCP带宽"
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
        yAxisType: ['bits', ''],
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
        router: 'tcp.bandwidth',
        package_ids: [this.reportParams.package_id],
        ...this.reportParams
      }
      const res = await this.Fetch.post('V4/stati.data.get', params)
      const data = res.bandwidth
      data.trend.y_data = {
        data: data.trend.y_data
      }
      this.chartData = formatData(data.trend, ['时间', '带宽'])
      this.loading = false
    }
  }
}
</script>
