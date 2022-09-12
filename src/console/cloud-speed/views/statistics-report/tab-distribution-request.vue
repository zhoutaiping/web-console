<template>
  <div>
    <el-row :gutter="12">
      <el-col
        :xs="12"
        :sm="12"
        :md="8"
        :lg="8"
      >
        <DmCard title="浏览器分布">
          <ve-ring
            :tooltip="tooltip"
            :colors="[Color.colorOrange, Color.colorGreen, Color.colorYellow, Color.colorPrimary, Color.colorRed, Color.colorPick]"
            :loading="loadingTop"
            :data-empty="!loadingTop && chartBrowser.data.rows.length === 0"
            :extend="chartSettingVe"
            :data="chartBrowser.data"
            height="380px"
          />
        </DmCard>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :md="8"
        :lg="8"
      >
        <DmCard title="ISP分布">
          <ve-ring
            :tooltip="tooltip"
            :colors="[Color.colorOrange, Color.colorGreen, Color.colorYellow, Color.colorPrimary, Color.colorRed, Color.colorPick]"
            :loading="loadingTop"
            :data-empty="!loadingTop && chartISP.data.rows.length === 0"
            :extend="chartSettingVe"
            :data="chartISP.data"
            height="380px"
          />
        </DmCard>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :md="8"
        :lg="8"
      >
        <DmCard title="操作系统分布">
          <ve-ring
            :tooltip="tooltip"
            :colors="[Color.colorOrange, Color.colorGreen, Color.colorYellow, Color.colorPrimary, Color.colorRed, Color.colorPick]"
            :loading="loadingTop"
            :data-empty="!loadingTop && chartOS.data.rows.length === 0"
            :extend="chartSettingVe"
            :data="chartOS.data"
            height="380px"
          />
        </DmCard>
      </el-col>
    </el-row>
    <!-- 地区分布 -->
    <DmCard
      :loading="loadingProvince"
      title="地域分布"
      style="margin-top: 12px"
    >
      <el-radio-group
        slot="action"
        v-model="activeProvince"
        @change="handleProvinceChange"
      >
        <el-radio-button label="china">全国分布</el-radio-button>
        <el-radio-button label="world">全球分布</el-radio-button>
      </el-radio-group>
      <el-row :gutter="12">
        <el-col :span="14">
          <ve-map
            :tooltip="chartProvince.tooltip"
            :data="chartProvince.data"
            :settings="chartProvince.settings"
            :extend="chartProvince.options"
            :legend-visible="false"
            height="450px"
          />
        </el-col>
        <el-col :span="10">
          <yd-table
            style="margin-top: 12px"
            type="white"
          >
            <el-table :data="chartProvince.data.rows.slice(0, 10)">
              <el-table-column
                type="index"
                label=" "
                width="50"
              />
              <el-table-column
                :label="activeProvince === 'china' ? '省份' : '国家'"
                prop="name"
              />
              <el-table-column
                label="请求数"
                align="right"
                prop="value"
                width="100"
              >
                <template slot-scope="scope">
                  {{ scope.row.value | formatNumber }} 次
                </template>
              </el-table-column>
              <el-table-column
                label="占比"
                prop="percent"
                width="120"
              >
                <template slot-scope="scope">
                  <ColumnRatio :value="scope.row.percent" />
                </template>
              </el-table-column>
            </el-table>
          </yd-table>
        </el-col>
      </el-row>
    </DmCard>
  </div>
</template>

<script>
import Color from '@/utils/color'
import NameMapVal from '@/config/nameMap'
import ColumnRatio from '@/components/Column/ColumnRatio'
import { TOOLTIP_THEME } from '@/constants/echarts-tooltip'
import { tooltipParent, tooltipParentPie } from '@/utils/chart'
import report from '../../mixins/report'

export default {
  components: {
    ColumnRatio
  },

  mixins: [report],

  data() {
    return {
      Color,
      activeProvince: 'china',
      tooltip: tooltipParentPie('次'),
      chartSettingVe: {
        legend: {
          show: false,
          itemWidth: 15,
          orient: 'vertical',
          x: 'top',
          textStyle: {
            color: '#666'
          }
        },
        tooltip: TOOLTIP_THEME
      },
      chartTopGrid: {
        top: 30,
        left: 60,
        right: 20,
        bottom: 0
      },
      chartBrowser: {
        data: {
          columns: [],
          rows: []
        }
      },
      chartISP: {
        data: {
          columns: [],
          rows: []
        }
      },
      chartOS: {
        data: {
          columns: [],
          rows: []
        }
      },
      loadingTop: true,
      // 地区图表
      chartProvince: {
        tooltip: {},
        data: {
          columns: [],
          rows: []
        },
        settings: {},
        options: {
          nameMap: NameMapVal.nameMap,
          aspectScale: 0.8,
          series: {
            tooltip: {
              padding: 8,
              backgroundColor: 'rgb(255, 255, 255, .95)',
              textStyle: {
                color: Color.colorLightGrey,
                fontSize: 12,
                lineHeight: 25,
                height: 25
              },
              trigger: 'item',
              extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)'
            },
            type: 'map',
            label: {
              show: false
            },
            showLegendSymbol: false,
            itemStyle: {
              normal: {
                areaColor: '#cde1f5',
                borderColor: '#fff'
              }
            }
          },
          visualMap: {
            inverse: true,
            show: true,
            type: 'continuous',
            realtime: false,
            min: 0,
            max: 100000,
            calculable: false,
            text: ['高', '低'],
            inRange: {
              color: [Color.colorPrimarySS, Color.colorPrimary],
              symbolSize: [50, 100]
            },
            align: 'top',
            orient: 'horizontal'
          }
        }
      },
      loadingProvince: true
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
      this.getOverview(params)
      this.getProvince(params, this.activeProvince)
    },
    // 读取报表
    async getOverview(params) {
      this.loadingTop = true

      params = {
        ...params,
        router: 'cdn.domain.uaisp.distribute'
      }
      const data = await this.Fetch.post('V4/stati.data.get', params)

      this.chartBrowser.data = {
        columns: ['name', 'value'],
        rows: data.top_browser
      }

      this.chartISP.data = {
        columns: ['name', 'value'],
        rows: data.top_isp
      }

      this.chartOS.data = {
        columns: ['name', 'value'],
        rows: data.top_os
      }
      this.loadingTop = false
    },
    // 地域切换
    handleProvinceChange(type) {
      const params = this.reportParams
      this.getProvince(params, type)
    },
    // 读取地域
    async getProvince(params, type = 'china') {
      this.loadingProvince = true
      params = {
        ...params,
        router: type === 'china' ? 'cdn.domain.province.distribute' : 'cdn.domain.country.distribute'
      }

      const data = await this.Fetch.post('V4/stati.data.get', params)
      const { list = [] } = data

      list.forEach(item => {
        item.percent = ((item.percent) / 100).toFixed(4)
      })

      this.chartProvince.data = {
        columns: ['name', 'value', 'percent'],
        rows: list
      }

      this.chartProvince.options.visualMap.max = list.length === 0 ? 1 : Math.max(...list.map(_ => parseInt(_.value, 10)))
      this.chartProvince.tooltip = tooltipParent('次')

      this.chartProvince.settings = {
        dataType: {
          percent: 'percent'
        },
        labelMap: {
          name: type === 'china' ? '省份' : '国家',
          value: '请求次数',
          percent: '占比'
        },
        position: type === 'china' ? 'china' : 'world'
      }
      this.loadingProvince = false
    }
  }
}
</script>
