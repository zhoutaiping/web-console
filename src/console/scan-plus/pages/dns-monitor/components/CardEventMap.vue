<template>
  <yd-card
    :loading="loading"
    title="全国分布"
  >
    <el-row :gutter="12">
      <!-- MAP -->
      <el-col :span="14">
        <ChartMap
          ref="chartMap"
          :tooltip="chart.tooltip"
          :settings="chart.settings"
          :data="chart.data"
          height="450px"
        />
      </el-col>
      <!-- TABLE -->
      <el-col :span="10">
        <yd-table
          style="margin-top: 12px"
          type="white"
        >
          <el-table :data="chart.data.rows.slice(0, 10)">
            <el-table-column
              type="index"
              label=" "
              width="50"
            />
            <el-table-column
              :label="activeProvince === 'china' ? '省份' : '国家'"
              prop="province"
            />
            <el-table-column
              label="请求数"
              align="right"
              width="100"
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
                <ColumnRatio :value="scope.row.percent" />
              </template>
            </el-table-column>
          </el-table>
        </yd-table>
      </el-col>
    </el-row>
  </yd-card>
</template>

<script>
import ChartMap from '@/components/Chart/ChartMap'
import ColumnRatio from '@/components/Column/ColumnRatio'
import { tooltipParent } from '@/utils/chart'

const API_MAP = {
  china: 'V4/dns.hijack.event.log.province.top',
  world: ''
}

export default {
  components: { ChartMap, ColumnRatio },

  data() {
    return {
      loading: true,
      activeProvince: 'china',
      list: [],
      chart: {
        data: {
          columns: [],
          rows: []
        },
        options: {},
        tooltip: {},
        settings: {}
      }
    }
  },

  methods: {
    handleProvinceChange() {
      this.init()
    },

    async init(params) {
      this.loading = true
      const type = this.activeProvince
      const data = await this.Fetch.get(API_MAP[type], params)

      data.forEach(item => {
        item.percent = (item.percent / 100).toFixed(4)
      })

      this.chart.tooltip = tooltipParent('次')

      this.chart.data = {
        columns: ['province', 'count', 'percent'],
        rows: data
      }

      this.$refs.chartMap.setOptions({
        visualMap: {
          max: data.length === 0 ? 1 : Math.max(...data.map(_ => parseInt(_.count, 10)))
        }
      })

      this.chart.settings = {
        labelMap: {
          name: type === 'china' ? '省份' : '国家',
          count: '攻击次数',
          percent: '占比'
        },
        position: type === 'china' ? 'china' : 'world'
      }
      this.loading = false
    }
  }
}
</script>
