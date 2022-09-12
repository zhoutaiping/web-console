<template>
  <DmDialog
    ref="Dialog"
    :action-visible="false"
    title="风险IP数量走势"
    width="800px"
  >
    <DmCard
      :loading="loading"
      title=" "
    >
      <template slot="action">
        <SelectDateFilter
          v-model="params"
          @change="fetchData" />
      </template>
      <ChartLine
        :loading="false"
        :data="chartData"
        :options="options"
        :height="350"
        style="margin-top: 25px"
      />
    </DmCard>
  </DmDialog>
</template>

<script>
import moment from 'moment'
import createDialog from '@/utils/createDialog'
import ChartLine from '@/components/Chart/ChartLine'
import SelectDateFilter from '@/components/Select/SelectDateFilter'

function formatDataM(data, columns, dateformat = 'M月D日 H:mm') {
  const x_data = data[0].x_data || []

  const [columnDate, ...columnsList] = columns
  const rows = x_data.map((time, index) => {
    const item = {
      [columnDate]: moment(time, 'YYYY-MM-DD HH:mm:ss').format(dateformat)
    }

    columnsList.forEach((column, cIndex) => {
      item[column] = data[cIndex].y_data[index]
    })

    return item
  })
  return {
    columns,
    rows
  }
}

export default createDialog({
  components: { ChartLine, SelectDateFilter },

  props: {
    domain: String
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
        baseUnit: '',
        grid: {
          top: 80
        }
      }
    }
  },

  methods: {
    async initOptions() {
      this.fetchData()
    },

    async fetchData() {
      this.loading = true
      const data = await this.Fetch.post('V4/stati.data.get', {
        router: 'aba.risk.ip.line',
        ...this.params,
        sub_domains: [this.domain]
      })

      this.chartData = formatDataM([
        data.total.trend,
        data.normal.trend,
        data.low.trend,
        data.medium.trend,
        data.high.trend,
        data.risk_total.trend
      ], ['IP总数', '正常', '低危', '中危', '高危', '风险总和'])
      this.loading = false
    }
  }
})
</script>

