<template>
  <console-page-layout>
    <DmToolbar>
      <SelectDateFilter
        slot="right"
        v-model="params"
        @change="fetchData"
      />
    </DmToolbar>
    <DmCard
      :loading="loading"
      title="解析量统计"
      height="500"
    >
      <ChartLine
        :data="chartData"
        :options="options"
        :height="350"
      />
    </DmCard>
  </console-page-layout>
</template>

<script>
import SelectDateFilter from '@/components/Select/SelectDateFilter'

export default {
  components: {
    SelectDateFilter
  },

  data() {
    return {
      loading: true,
      params: {
        start_time: '',
        end_time: ''
      },
      chartData: {},
      options: {
        yAxisName: [],
        baseUnit: '次',
        labelMap: {
          date: '时间',
          value: '瞬时数据'
        },
        grid: {
          top: 50,
          right: 50
        }
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.loading = true
      const params = {
        ...this.params,
        domain: this.$route.query.domain
      }
      const { list, unit } = await this.Fetch.get('V4/CloudDns.Domain.DnsDomain.DnsStat', params)
      const columns = ['date', 'value']
      const rows = []
      Object.keys(list).forEach(date => {
        rows.push({
          date,
          value: list[date]
        })
      })
      this.options.yAxisName = [`单位（${unit}）`]
      this.options.baseUnit = '次'

      this.chartData = {
        columns,
        rows
      }
      this.loading = false
    }
  }
}
</script>
