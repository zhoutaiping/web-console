<template>
  <div>
    <DmToolbar>
      <dateSelection :start-date="1" @timevalue="consoleTimeValue" />
    </DmToolbar>
    <el-row
      :gutter="12"
      class="margin-top"
    >
      <el-col :span="16">
        <yd-card title="可用率趋势">
          <ve-line
            :colors="[Color.colorPrimary]"
            :data="chartLine.data"
            :grid="chartGrid"
            :settings="chartLine.settings"
            :loading="loadingLine"
            :data-empty="!loadingLine && chartLine.data.rows.length === 0"
            theme-name="yundun"
            height="350px"
          />
        </yd-card>
      </el-col>
      <el-col :span="8">
        <yd-card title="可用率汇总">
          <ve-ring
            :data="chartRate.data"
            :extend="chartRate.settings"
            :loading="loadingLine"
            :data-empty="!loadingLine && chartRate.data.rows.length === 0"
            height="350px"
          />
        </yd-card>
      </el-col>
      <el-col
        :span="24"
        style="margin-top: 12px"
      >
        <yd-card title="平均延迟">
          <ve-line
            :colors="[Color.colorPrimary]"
            :data="chartDelay.data"
            :grid="chartGrid"
            :settings="chartDelay.settings"
            :loading="loadingDelay"
            :data-empty="!loadingDelay && chartLine.data.rows.length === 0"
            theme-name="yundun"
            height="350px"
          />
        </yd-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DateSelection from '@/components/DateSelect/DateSelection'
import Color from '@/utils/color'
import { formatData } from '@/utils/chart'
import { TOOLTIP_THEME } from '@/constants/echarts-tooltip'

export default {
  components: {
    DateSelection
  },

  data() {
    return {
      Color,
      loadingLine: true,
      loadingDelay: true,
      params: {
        task_uuid: this.$route.params.id,
        start_time: '',
        end_time: ''
      },
      chartGrid: {
        top: 30,
        left: 60,
        right: 20,
        bottom: 30
      },
      chartLine: {
        data: {
          columns: [],
          rows: []
        },
        settings: {
          area: true,
          yAxisName: ['可用率（%）']
        }
      },
      chartDelay: {
        data: {
          columns: [],
          rows: []
        },
        settings: {
          area: true,
          yAxisName: ['平均延迟（毫秒）']
        }
      },
      chartRate: {
        data: {
          columns: [],
          rows: []
        },
        settings: {
          legend: {
            itemWidth: 15,
            textStyle: {
              color: '#666'
            }
          },
          tooltip: TOOLTIP_THEME
        }
      }
    }
  },

  methods: {
    consoleTimeValue(startTimevalue, endTimevalue) {
      this.params.start_time = startTimevalue
      this.params.end_time = endTimevalue
      this.init()
      this.fetchDelay()
    },

    async fetchDelay() {
      this.loadingDelay = true
      const data = await this.Fetch.post('V4/statistic.monitor.task.delay.avg', this.params)
      this.chartDelay.data = formatData(data.trend, ['时间', '平均延迟'])
      this.loadingDelay = false
    },

    async init() {
      this.loadingLine = true
      const data = await this.Fetch.post('V4/statistic.monitor.task.availability.line', this.params)
      this.chartLine.data = formatData(data.trend, ['时间', '可用率'])
      const { total = 0 } = data
      this.chartRate.data = {
        columns: ['类型', '占比'],
        rows: [
          { 类型: '可用', 占比: total },
          { 类型: '不可用', 占比: 100 - total }
        ]
      }
      this.loadingLine = false
    }
  }
}
</script>
