<template>
  <DmCard
    :loading="loading"
    title="攻击趋势"
  >
    <ChartLine
      :data="data"
      :extend="extend"
      :options="options"
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import ChartLine from '@/components/Chart/ChartLine'
import { zip } from 'lodash/array'

export default create({
  name: 'CardAttackLine',

  components: {
    ChartLine
  },

  data() {
    return {
      loading: true,
      data: {
        columns: [],
        row: []
      },
      options: {
        baseUnit: '次'
      },
      extend: {
        xAxis: {
          boundaryGap: false
        }
      }
    }
  },

  methods: {
    startLoading() {
      this.loading = true
    },

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
      this.data = {
        columns: ['日期', ...Object.keys(data)],
        rows: list
      }
      this.loading = false
    }
  }
})
</script>
