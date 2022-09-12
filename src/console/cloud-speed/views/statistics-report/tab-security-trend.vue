<template>
  <div>
    <el-row :gutter="12">
      <el-col
        :xs="24"
        :sm="8"
      >
        <DmCard height="120">
          <item-number-group header="CC 攻击">
            <item-number
              :loading="loadingCC"
              v-model="totalCC.value"
              :title="`峰值 QPS${totalCC.time ? '（' + totalCC.time + '）' : ''}`"
              :unit="totalCC.unit"
              color="error"
            />
          </item-number-group>
        </DmCard>
      </el-col>
      <el-col
        :xs="24"
        :sm="16"
      >
        <DmCard height="120">
          <item-number-group header="云 IDS">
            <item-number
              :loading="loadingIDS"
              v-model="totalIDS.total.value"
              :unit="totalIDS.total.unit"
              color="error"
              title="总次数"
            />
            <item-number
              :loading="loadingIDS"
              v-model="totalIDS.hacker.value"
              :unit="totalIDS.hacker.unit"
              color="warning"
              title="黑客数"
            />
            <item-number
              :loading="loadingShell"
              v-model="totalIDS.webshell.value"
              :unit="totalIDS.webshell.unit"
              color="warning"
              title="WebShell"
            />
          </item-number-group>
        </DmCard>
      </el-col>
    </el-row>
    <!-- 图表 -->
    <DmCard
      style="margin-top: 12px"
      title="CC 攻击趋势"
    >
      <ve-line
        :tooltip="chartCC.tooltip"
        :colors="[Color.colorPrimary]"
        :data="chartCC.data"
        :grid="chartGrid"
        :settings="chartCC.settings"
        :loading="loadingCC"
        :data-empty="!loadingCC && chartCC.data.rows.length === 0"
        theme-name="yundun"
        height="350px"
      />
    </DmCard>
    <DmCard
      style="margin-top: 12px"
      title="IDS 检出趋势"
    >
      <ve-line
        :tooltip="chartIDS.tooltip"
        :change-delay="500"
        :colors="[Color.colorPrimary]"
        :data="chartIDS.data"
        :grid="chartGrid"
        :settings="chartIDS.settings"
        :loading="loadingIDS"
        :data-empty="!loadingIDS && chartIDS.data.rows.length === 0"
        theme-name="yundun"
        height="350px"
      />
    </DmCard>
  </div>
</template>
<script>
import Fetch from '@/api/fetch'
import ItemNumber from '@/components/Item/ItemNumber'
import ItemNumberGroup from '@/components/Item/ItemNumberGroup'
import { formatData, tooltipAlone } from '@/utils/chart'
import ToolbarCdn from '../../components/Toolbar/ToolbarCdn'
import Color from '@/utils/color'
import report from '../../mixins/report'

export default {
  components: {
    ToolbarCdn,
    ItemNumber,
    ItemNumberGroup
  },
  mixins: [report],
  data() {
    return {
      Color,
      loadingCC: true,
      loadingIDS: true,
      loadingShell: true,
      totalCC: {
        value: '',
        unit: '',
        time: ''
      },
      totalIDS: {
        total: {
          value: '',
          unit: ''
        },
        hacker: {
          value: '',
          unit: ''
        },
        webshell: {
          value: '',
          unit: ''
        }
      },
      chartGrid: {
        top: 30,
        left: 60,
        right: 20,
        bottom: 30
      },
      chartCC: {
        data: {
          columns: [],
          rows: []
        },
        settings: {
          area: true,
          yAxisName: ['单位']
        },
        tooltip: {}
      },
      chartIDS: {
        data: {
          columns: [],
          rows: []
        },
        settings: {
          area: true,
          yAxisName: ['单位']
        },
        tooltip: {}
      }
    }
  },

  watch: {
    utime() {
      this.init()
    }
  },

  methods: {
    async init(params) {
      params = params || this.$refs.toolbar.emitInit()
      this.chartCC.data = {
        columns: [],
        rows: []
      }
      this.chartIDS.data = {
        columns: [],
        rows: []
      }
      this.getIndexCC(params)
      this.getIndexIDS(params)
      this.getIndexShell(params)
    },

    async getIndexCC(params) {
      this.loadingCC = true
      const data = await Fetch.get('V4/Web.Domain.Report.Safe.cc', params)
      if (!data) return

      this.totalCC = {
        value: data.max.data.data || '暂无数据',
        unit: data.max.data.unit || '',
        time: data.max.time || ''
      }
      const _unit = data.trend.y_data.unit
      this.chartCC.tooltip = tooltipAlone(_unit)
      this.chartCC.settings.yAxisName = [`单位（${_unit}）`]
      this.chartCC.data = formatData(data.trend, ['时间', '攻击次数'])
      this.loadingCC = false
    },

    async getIndexIDS(params) {
      this.loadingIDS = true
      const data = await Fetch.get('V4/Web.Domain.Report.Safe.ids', params)
      if (!data) return
      const { totalIDS } = this

      if (data.total && data.total.data >= 0) {
        totalIDS.total = {
          value: data.total.data || '暂无数据',
          unit: data.total.data ? data.total.unit : ''
        }
        const _unit = data.trend.y_data.unit
        this.chartIDS.tooltip = tooltipAlone(_unit)
        this.chartIDS.settings.yAxisName = [`单位（${_unit}）`]
        this.chartIDS.data = formatData(data.trend, ['时间', '攻击次数'])
      } else {
        totalIDS.total = {
          value: '暂无数据',
          unit: ''
        }
      }

      if (data.hacker_count && data.hacker_count.data) {
        totalIDS.hacker = {
          value: data.hacker_count.data,
          unit: data.hacker_count.unit
        }
      } else {
        totalIDS.hacker = {
          value: '暂无数据',
          unit: ''
        }
      }

      this.loadingIDS = false
    },

    async getIndexShell(params) {
      this.loadingShell = true
      const data = await Fetch.get('V4/Web.Domain.DashBoard.getWebShell', params)
      if (!data) return
      const { totalIDS } = this

      if (data.data && data.data.total) {
        totalIDS.webshell = {
          value: data.data.total,
          unit: '个'
        }
      } else {
        totalIDS.webshell = {
          value: '暂无数据',
          unit: ''
        }
      }

      this.loadingShell = false
    }
  }
}
</script>
