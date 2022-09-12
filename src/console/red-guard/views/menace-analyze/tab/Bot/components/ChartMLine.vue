<template>
  <DmCard
    :title="title"
    :loading="loading"
  >
    <ChartLine
      :data="chartData"
      :options="optionsData"
    />
  </DmCard>
</template>

<script>
import { zip } from 'lodash/array'
import create from '@/utils/create-basic'
import ChartLine from '@/components/Chart/ChartLine'

export default create({
  name: 'ChartMLine',

  props: {
    title: String,
    options: Object,
    loading: Boolean
  },

  components: {
    ChartLine
  },

  data() {
    return {
      optionsData: {
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

  created() {
    Object.assign(this.optionsData, this.options)
  },

  methods: {
    async setData(data) {
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
    }
  }
})
</script>
