<template>
  <DmCard
    :loading="loading"
    height="400"
  >
    <template slot="title">
      可用率
      <el-button
        size="mini"
        style="margin-left: 8px"
        @click="handleUnSelectLegend($refs.Chart.echarts, chartData.columns)"
      >取消选择</el-button>
    </template>
    <!-- <template slot="action">
      <yd-form-select
        v-model="params.interval"
        :selects="OPTIONS_TIMES"
        default-text="间隔时间"
        style="margin-left: 10px; width: 120px"
        @change="fetchData"
      />
    </template> -->
    <ChartLine
      ref="Chart"
      :loading="false"
      :data="chartData"
      :options="options"
      :height="550"
    />
  </DmCard>
</template>

<script>
import moment from 'moment'
import ChartLine from '@/components/Chart/ChartLine'
import SelectDateFilter from '@/components/Select/SelectDateFilter'
import { handleUnSelectLegend } from '@/utils/chart'
import cwReport from '../../../../../mixins/cwReport'

function maxSection(
  value,
  list = [
    22,
    50,
    75,
    90,
    95
  ]
) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (value < item) {
      return item
    }
  }
  return value
}

function formatDataM(x_data, y_data, columns, dateformat = 'M月D日 H:mm') {
  const [columnDate, ...columnsList] = columns

  let min = 100
  const rows = x_data.map((time, index) => {
    const item = {
      [columnDate]: moment(time, 'YYYY-MM-DD HH:mm:ss').format(dateformat)
    }

    columnsList.forEach((column, cIndex) => {
      const value = Number(y_data[column].data[index])
      item[column] = value
      if (value < min) min = value
    })

    return item
  })

  return {
    columns,
    rows,
    min: maxSection(min)
  }
}

const OPTIONS_TIMES = [
  {
    label: '5分钟',
    value: '5m'
  },
  {
    label: '10分钟',
    value: '10m'
  },
  {
    label: '15分钟',
    value: '15m'
  }
]

export default {
  components: { ChartLine, SelectDateFilter },

  mixins: [cwReport],

  data() {
    return {
      OPTIONS_TIMES,
      loading: true,
      chartData: {},
      options: {
        yAxisName: [`单位（%）`],
        baseUnit: '%',
        max: [100],
        min: [90],
        grid: {
          top: 50
        }
      },
      params: {
        // interval: '15m'
      }
    }
  },

  methods: {
    handleUnSelectLegend,

    async fetchData() {
      this.loading = true
      const params = {
        ...this.params,
        ...this.reportParams
      }

      const data = await this.Fetch.get('V4/statistic.tjkd.plus.availability', params)
      const columnsList = Object.keys(data.trend.y_data)
      if (columnsList.length > 10) this.options.grid.top = (columnsList.length / 10).toFixed() * 20 + 50
      const chartData = formatDataM(data.trend.x_data, data.trend.y_data, ['时间', ...columnsList])

      this.chartData = chartData
      this.options.min = [chartData.min]
      this.loading = false
    }
  }
}
</script>
