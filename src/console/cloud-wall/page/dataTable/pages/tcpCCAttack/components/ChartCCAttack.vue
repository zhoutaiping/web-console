<template>
  <DmCard
    :loading="loading"
    title="CC攻击趋势"
    height="400"
  >
    <template slot="action">
      <yd-form-select
        :selects="reportSelectIP"
        v-model="params.ip"
        default-text="全部IP"
        default-value="all"
        style="width: 150px"
        @change="fetchData"
      />
      <SelectDateFilter
        v-model="params"
        style="margin-left: 10px"
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
import SelectDateFilter from '@/components/Select/SelectDateFilter'
import cwReport from '../../../../../mixins/cwReport'

export default {
  components: { ChartLine, SelectDateFilter },

  mixins: [cwReport],

  data() {
    return {
      loading: true,
      params: {
        sub_domain: 'all',
        start_time: '',
        end_time: '',
        port: []
      },
      chartData: {},
      options: {
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
        ...this.reportParams,
        ...this.params
      }

      const data = await this.Fetch.get('V4/statistic.tjkd.plus.tcp.cc.line', params)
      // const { unit } = data.trend.y_data
      this.chartData = formatData(data.trend, ['时间', '攻击次数'])
      this.loading = false
    }
  }
}
</script>
