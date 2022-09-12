<template>
  <DmCard
    :loading="loading"
    title="动静态资源请求次数趋势"
  >
    <ChartLine
      :data="chartData"
      :options="options"
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import { zip } from 'lodash/array'

export default create({
  name: 'CardAttackLine',

  props: {
    title: String
  },

  data() {
    return {
      loading: true,
      options: {
        yAxisName: ['单位（次）'],
        baseUnit: '次',
        grid: {
          top: 50,
          left: 100,
          right: 50,
          bottom: 50
        }
      },
      chartData: {
        columns: [],
        row: []
      }
    }
  },

  methods: {
    async fetchData(params) {
      this.loading = true
      const res = await this.Fetch.post('V4/stati.data.get', {
        ...params,
        router_type: 'bot',
        meal_flag: ['YD-WAFQJB'],
        router: 'bot.dynamic.static'
      })

      const data = {
        总请求: res.total_times_trend,
        动态资源请求: res.dynamic_times_trend,
        静态资源请求: res.static_times_trend,
        总回源: res.total_fetch_source_times_trend,
        动态资源回源请求: res.dynamic_fetch_source_times_trend,
        静态资源回源请求: res.static_fetch_source_times_trend
      }

      const rowsList = []
      Object.keys(data).forEach(key => {
        const { x_data, y_data } = data[key].trend
        const rows = []
        x_data.forEach((date, index) => {
          rows.push({
            [key]: y_data[index],
            日期: date
          })
        })
        rowsList.push(rows)
      })

      const list = []
      zip(...rowsList).forEach(item => {
        list.push(Object.assign(...item))
      })
      this.chartData = {
        columns: ['日期', ...Object.keys(data)],
        rows: list
      }
      this.loading = false
    }
  }
})
</script>
