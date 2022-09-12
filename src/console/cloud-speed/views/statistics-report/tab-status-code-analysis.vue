<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="8">
        <yd-card
          border
          height="100"
        >
          <item-number
            :loading="loadingCode"
            v-model="totalCode.sum.value"
            :unit="totalCode.sum.unit"
            title="状态码总数"
          />
        </yd-card>
      </el-col>
      <el-col :span="8">
        <yd-card
          border
          height="100"
        >
          <item-number
            :loading="loadingCode"
            v-model="totalCode.wrong.value"
            :unit="totalCode.wrong.unit"
            color="error"
            title="错误码总数"
          />
        </yd-card>
      </el-col>
      <el-col :span="8">
        <yd-card
          border
          height="100"
        >
          <item-number
            :loading="loadingCode"
            v-model="totalCode.percent.value"
            :unit="totalCode.percent.unit"
            color="warning"
            title="错误率"
          />
        </yd-card>
      </el-col>
    </el-row>
    <!-- 图表 -->
    <yd-card
      title="状态码趋势"
      style="margin-top: 12px"
    >
      <ve-line
        :tooltip="chartCode.tooltip"
        :colors="[Color.colorPrimary, Color.colorGreen, Color.colorYellow, Color.colorPick, Color.colorRed]"
        :data="chartCode.data"
        :grid="chartGrid"
        :settings="chartCode.settings"
        :loading="loadingCode"
        :data-empty="!loadingCode && chartCode.data.rows.length === 0"
        theme-name="yundun"
        height="350px"
      />
    </yd-card>
    <yd-card
      title="状态码分布"
      style="margin-top: 12px;"
    >
      <el-row>
        <el-col :span="12">
          <ve-ring
            :tooltip="chartRatio.tooltip"
            :colors="[Color.colorPrimary, Color.colorGreen, Color.colorYellow, Color.colorPick, Color.colorRed]"
            :loading="loadingCode"
            :data-empty="!loadingCode && chartRatio.data.rows.length === 0"
            :extend="chartSettingVe"
            :data="chartRatio.data"
            height="400px"
          />
        </el-col>
        <el-col :span="12">
          <yd-table type="white">
            <el-table :data="topData">
              <el-table-column
                prop="status"
                label="状态码"
              />
              <el-table-column
                align="right"
                label="请求数"
                width="150"
              >
                <template slot-scope="scope">
                  {{ scope.row.count | formatNumber }} 次
                </template>
              </el-table-column>
              <el-table-column
                label="占比"
                prop="percent"
                width="120"
              >
                <template slot-scope="scope">
                  <ColumnRatio :value="scope.row.percent / 100" />
                </template>
              </el-table-column>
            </el-table>
          </yd-table>
        </el-col>
      </el-row>
    </yd-card>
  </div>
</template>

<script>
import moment from 'moment'
import Color from '@/utils/color'
import ItemNumber from '@/components/Item/ItemNumber'
import { arraySum } from '@/utils/array'
import ColumnRatio from '@/components/Column/ColumnRatio'
import { TOOLTIP_THEME } from '@/constants/echarts-tooltip'
import { tooltipParentPie, tooltipMultiple } from '@/utils/chart'
import { numView } from '@/utils/filter'
import report from '../../mixins/report'

export default {
  components: {
    ItemNumber,
    ColumnRatio
  },

  mixins: [report],

  data() {
    return {
      Color,
      loadingCode: true,
      totalCode: {
        sum: {
          value: 0,
          unit: ''
        },
        wrong: {
          value: 0,
          unit: ''
        },
        percent: {
          value: 0,
          unit: '%'
        }
      },
      topData: [],
      chartSettingVe: {
        zoom: 1.2,
        legend: {
          itemWidth: 15,
          orient: 'vertical',
          x: 'left',
          top: 'middle',
          textStyle: {
            color: '#666'
          }
        },
        tooltip: TOOLTIP_THEME
      },
      chartGrid: {
        top: 30,
        left: 80,
        right: 20,
        bottom: 30
      },
      chartRatio: {
        tooltip: tooltipParentPie('次'),
        settings: {},
        data: {
          columns: [],
          rows: []
        },
        grid: {
          top: 150,
          left: 60,
          right: 20,
          bottom: 30
        }
      },
      chartCode: {
        tooltip: {},
        settings: {
          yAxisName: ['单位（次）']
        },
        data: {
          columns: [],
          rows: []
        }
      }
    }
  },

  watch: {
    utime() {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const params = this.reportParams
      this.chartCode.data = {
        columns: [],
        rows: []
      }
      this.chartRatio.data = {
        columns: [],
        rows: []
      }
      this.getCode(params)
    },

    async getCode(params) {
      this.loadingCode = true
      params = {
        ...params,
        router: 'cdn.domain.status.distribute'
      }
      const data = await this.Fetch.post('/V4/stati.data.get', params)
      if (!data) return

      this.topData = data.status_top

      const { total, trend, status_group } = data

      if (total && total.sum_count) {
        const [sumValue, sumUnit] = numView(total.sum_count.data).split(' ')
        const [wrongValue, wrongUnit] = numView(total.wrong_sum_count.data).split(' ')
        this.totalCode = {
          sum: {
            value: sumValue,
            unit: sumUnit + '次'
          },
          wrong: {
            value: wrongValue,
            unit: wrongUnit + '次'
          },
          percent: {
            value: total.wrong_percent,
            unit: '%'
          }
        }
      }

      const keys = ['2xx', '3xx', '4xx', '5xx']
      const listTimes = trend.sum_count.x_data
      const rows = []

      listTimes.forEach((item, index) => {
        const obj = {
          时间: moment(item, 'YYYY-MM-DD HH:mm:ss').format('M月D日 H:mm')
        }
        keys.forEach(key => {
          obj[key] = trend[key].y_data.data[index]
        })
        rows.push(obj)
      })

      this.chartCode.tooltip = tooltipMultiple('次')

      this.chartCode.data = {
        columns: ['时间'].concat(keys),
        rows
      }

      // 状态码分布
      this.chartRatio.data = {
        columns: ['name', 'value'],
        rows: status_group.map(_ => {
          return {
            value: _.count,
            name: _.status,
            percent: _.percent
          }
        })
      }

      this.loadingCode = false
    }
  }
}
</script>

<style lang="scss">
.tab-status-code-analysis {
  .yd-table .el-table td {
    padding: 8px 0;
    height: 36px;
  }
}
</style>
