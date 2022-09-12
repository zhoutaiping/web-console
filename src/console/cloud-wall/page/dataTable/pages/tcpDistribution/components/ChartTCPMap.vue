<template>
  <DmCard
    :loading="loading"
    title="地域分布"
  >
    <template slot="action">
      <yd-button-checkbox
        v-model="params.port"
        :checks="reportSelectPort"
        placeholder="选择端口"
        item-name="端口"
        style="margin-right: 10px"
        @submit="fetchData"
      />
      <el-radio-group
        slot="action"
        v-model="activePosition"
        @change="handleProvinceChange"
      >
        <el-radio-button label="china">中国</el-radio-button>
        <el-radio-button label="world">世界</el-radio-button>
      </el-radio-group>
    </template>

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
              label="请求次数"
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
  china: 'V4/statistic.tjkd.plus.tcp.conversation.province',
  world: 'V4/statistic.tjkd.plus.tcp.cc.Country.top'
}

export default {
  components: { ChartMap, ColumnRatio },

  mixins: [cwReport],

  data() {
    return {
      loading: true,
      activePosition: 'china',
      options: {},
      params: {
        port: []
      },
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
        ...this.params,
        ...this.reportParams
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
          count: '请求次数'
        },
        position
      }
      this.loading = false
    }
  }
}
</script>
