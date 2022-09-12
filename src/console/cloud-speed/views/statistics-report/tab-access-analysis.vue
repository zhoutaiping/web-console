<template>
  <div>
    <el-row
      :gutter="12"
      class="margin-top"
    >
      <el-col :span="6">
        <DmCard>
          <ItemNumber
            v-model="index.total_times.total"
            title="总请求数"
            unit="次"
          />
        </DmCard>
      </el-col>
      <el-col :span="6">
        <DmCard>
          <ItemNumber
            v-model="index.hit_cache_times.total"
            title="加速请求数"
            unit="次"
          />
        </DmCard>
      </el-col>
      <el-col :span="6">
        <DmCard>
          <ItemNumber
            v-model="index.https_times.total"
            title="HTTPS请求数"
            unit="次"
          />
        </DmCard>
      </el-col>
      <el-col :span="6">
        <DmCard>
          <ItemNumber
            v-model="index.pv_times.total"
            title="页面浏览量"
            unit="PV"
          />
        </DmCard>
      </el-col>
    </el-row>
    <DmCard
      :loading="speedChart.loading"
      title="请求数趋势"
      class="margin-top"
    >
      <ChartLine
        v-if="speedChart.chartData.rows"
        :data="speedChart.chartData"
        :options="speedChart.options"
        :height="350"
      />
    </DmCard>
    <DmCard
      :loading="pvChart.loading"
      title="页面浏览量"
      class="margin-top"
    >
      <ChartLine
        v-if="pvChart.chartData.rows"
        :data="pvChart.chartData"
        :options="pvChart.options"
        :height="350"
      />
    </DmCard>
  </div>
</template>

<script>
import moment from 'moment'
import ItemNumber from '@/components/Item/ItemNumber'
import consoleChart from '@/mixins/consoleChart'
import { formatData } from '@/utils/chart'
import report from '../../mixins/report'

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

export default {
  components: { ItemNumber },

  mixins: [consoleChart, report],

  data() {
    return {
      index: {
        total_times: {
          unit: '',
          total: ''
        },
        hit_cache_times: {
          unit: '',
          total: ''
        },
        https_times: {
          unit: '',
          total: ''
        },
        pv_times: {
          unit: '',
          total: ''
        }
      },
      speedChart: {
        chartData: {},
        loading: true,
        options: {
          grid: {
            top: 40
          },
          baseUnit: '次'
        }
      },
      pvChart: {
        chartData: {},
        loading: true,
        options: {
          grid: {
            top: 40
          },
          baseUnit: 'PV'
        }
      }
    }
  },

  watch: {
    utime() {
      this.init()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    init() {
      const params = this.reportParams

      this.fetchPvtimes(params)
      this.fetchTimes(params)
    },

    async fetchPvtimes(params) {
      this.pvChart.loading = true
      const data = await this.Fetch.post('V4/stati.data.get', {
        router: 'cdn.domain.pvtimes',
        ...params
      })
      this.pvChart.loading = false

      const { pv_times = {}} = data
      if (pv_times.total) {
        this.index.pv_times = pv_times.total
      }

      this.pvChart.chartData = formatData({
        x_data: pv_times.trend.x_data,
        y_data: {
          data: pv_times.trend.y_data
        }
      }, ['时间', '页面浏览量'])
    },

    async fetchTimes(params) {
      this.speedChart.loading = true
      const data = await this.Fetch.post('V4/stati.data.get', {
        router: 'cdn.domain.times',
        ...params
      })

      const dataQps = await this.Fetch.post('V4/stati.data.get', {
        router: 'cdn.domain.qps',
        ...params
      })

      if (data.total_times) {
        this.index.total_times = data.total_times.total
        this.speedChart.chartData = formatDataM([
          data.total_times.trend,
          data.hit_cache_times.trend,
          dataQps.qps.trend
        ],
        ['时间', '请求数', '加速请求数', 'QPS']
        )
      }
      if (data.https_times) {
        this.index.https_times = data.https_times.total
      }
      if (data.hit_cache_times) {
        this.index.hit_cache_times = data.hit_cache_times.total
      }
      this.speedChart.loading = false
    }
  }
}
</script>
