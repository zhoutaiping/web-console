<template>
  <DmCard
    :loading="loading"
    title="CC攻击统计地图"
  >
    <el-radio-group
      slot="action"
      v-model="activePosition"
      @change="handleProvinceChange"
    >
      <el-radio-button label="china">中国</el-radio-button>
      <el-radio-button label="world">世界</el-radio-button>
    </el-radio-group>
    <el-row :gutter="12">
      <!-- MAP -->
      <el-col :span="14">
        <ChartMap
          ref="chartMap"
          :options="options"
          :data="chartData"
          :height="500"
        />
      </el-col>
      <!-- TABLE -->
      <el-col :span="10">
        <DmTable
          style="margin-top: 12px"
          type="white"
        >
          <el-table :data="chartData.rows.slice(0, 10)">
            <el-table-column
              type="index"
              label=" "
              width="50"
            />
            <el-table-column
              :label="activePosition === 'china' ? '省份' : '国家'"
              prop="country"
            />
            <el-table-column
              label="攻击次数"
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
        </DmTable>
      </el-col>
    </el-row>
  </DmCard>
</template>

<script>
import ChartMap from '@/components/Chart/ChartMap'
import ColumnRatio from '@/components/Column/ColumnRatio'
import cwReport from '../../../../../mixins/cwReport'

const API_MAP = {
  china: 'V4/statistic.tjkd.plus.web.cc.Province.top',
  world: 'V4/statistic.tjkd.plus.web.cc.Country.top'
}

export default {
  components: { ChartMap, ColumnRatio },

  mixins: [cwReport],

  data() {
    return {
      loading: true,
      activePosition: 'china',
      options: {},
      chartData: {
        columns: [],
        rows: []
      }
    }
  },

  methods: {
    handleProvinceChange() {
      this.fetchData()
    },

    async fetchData() {
      this.loading = true
      const params = {
        package_id: this.reportParams.package_id
      }
      const position = this.activePosition

      const data = await this.Fetch.get(API_MAP[position], params)
      const rows = data.map(_ => {
        return {
          country: _.country,
          count: _.count,
          percent: (_.percent / 100).toFixed(4)
        }
      })

      this.chartData = {
        columns: ['country', 'count', 'percent'],
        rows
      }

      this.options = {
        max: rows.length ? Math.max(...rows.map(_ => _.count)) : 1,
        labelMap: {
          count: '攻击次数'
        },
        position
      }
      this.loading = false
    }
  }
}
</script>
