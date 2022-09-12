<template>
  <DmCard
    :loading="loading"
    height="400"
  >
    <template slot="title">
      平均延迟
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

function formatDataM(x_data, y_data, columns, dateformat = 'M月D日 H:mm') {
  const [columnDate, ...columnsList] = columns

  const rows = x_data.map((time, index) => {
    const item = {
      [columnDate]: moment(time, 'YYYY-MM-DD HH:mm:ss').format(dateformat)
    }

    columnsList.forEach((column, cIndex) => {
      item[column] = y_data[column].data[index]
    })

    return item
  })

  return {
    columns,
    rows
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
        yAxisName: [`单位（ms）`],
        baseUnit: 'ms',
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

      const data = await this.Fetch.get('V4/statistic.tjkd.plus.delay.avg', params)
      const columnsList = Object.keys(data.trend.y_data)
      if (columnsList.length > 10) this.options.grid.top = (columnsList.length / 10).toFixed() * 20 + 50

      this.chartData = formatDataM(data.trend.x_data, data.trend.y_data, ['时间', ...Object.keys(data.trend.y_data)])
      this.loading = false
    }
  }
}
</script>
