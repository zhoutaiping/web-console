<template>
  <DmCard
    :loading="loading"
    title="攻击IP地理分布"
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
              :label="activeProvince === 'china' ? '省份' : '国家'"
              prop="title"
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
        </DmTable>
      </el-col>
    </el-row>
  </DmCard>
</template>

<script>
import ColumnRatio from '@/components/Column/ColumnRatio'

export default {
  components: { ColumnRatio },

  data() {
    return {
      loading: true,
      activeProvince: 'china',
      params: {},
      options: {},
      chartData: {
        columns: [],
        rows: []
      },
      data: {
        china: [],
        world: []
      }
    }
  },

  methods: {
    startLoading() {
      this.loading = true
    },

    async setData(data) {
      this.data = data
      this.handleProvinceChange(this.activeProvince)
    },

    async handleProvinceChange(type) {
      const data = this.data[type]
      const rows = []
      data.forEach(_ => {
        rows.push({
          title: _.province || _.country,
          count: _.count,
          percent: (_.percent / 100).toFixed(4)
        })
      })

      this.chartData = {
        columns: ['title', 'count', 'percent'],
        rows
      }

      const max = rows.length ? Math.max(...rows.map(_ => _.count)) : 1

      this.options = {
        max,
        baseUnit: '次',
        labelMap: {
          count: '攻击次数'
        },
        position: type === 'china' ? 'china' : 'world'
      }
      this.loading = false
    }
  }
}
</script>
