<template>
  <DmCard
    :loading="loading"
    class="chartMap"
    title="CC攻击统计地图"
    style="margin-top: 12px"
  >
    <template slot="action">
      <el-radio-group
        v-model="activeProvince"
        @change="handleProvinceChange"
      >
        <el-radio-button label="china">全国分布</el-radio-button>
        <el-radio-button label="world">全球分布</el-radio-button>
      </el-radio-group>
    </template>
    <el-row :gutter="12">
      <el-col :span="14">
        <ChartMap
          ref="chartMap"
          :data="chartProvince.data"
          :options="chartProvince.options"
          :height="500"
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
              prop="title"
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
        </yd-table>
      </el-col>
    </el-row>
  </DmCard>
</template>

<script>
import ChartMap from '@/components/Chart/ChartMap'
import ColumnRatio from '@/components/Column/ColumnRatio'
import DateSelection from '@/components/DateSelect/DateSelection'

function formatList(list) {
  list.forEach(item => {
    item.title = item.country || item.province
    item.percent = (item.percent / 100).toFixed(4)
  })

  return list
}

export default {
  components: {
    ChartMap,
    ColumnRatio,
    DateSelection
  },

  props: {
    bindParams: Object
  },

  data() {
    return {
      activeProvince: 'china',
      // 地区图表
      params: {},
      chartProvince: {
        tooltip: {},
        data: {
          columns: [],
          rows: []
        },
        options: {
          baseUnit: '次'
        }
      },
      loading: true,
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

    setData(data) {
      this.data = {
        china: formatList(data.china),
        world: formatList(data.world)
      }
      this.handleProvinceChange('china')
    },

    // 地域切换
    handleProvinceChange(type) {
      const data = this.data[type]

      this.chartProvince.data = {
        columns: ['title', 'count', 'percent'],
        rows: data
      }

      this.chartProvince.options = {
        max: data.length === 0 ? 1 : Math.max(...data.map(_ => parseInt(_.count, 10))),
        labelMap: {
          name: this.activeProvince === 'china' ? '省份' : '国家',
          count: '攻击次数',
          percent: '占比'
        },
        position: this.activeProvince === 'china' ? 'china' : 'world'
      }
      this.loading = false
    },

    async init(params = {}) {
      params = {
        ...this.params,
        ...params
      }
      this.getProvince(params)
    }
  }
}
</script>
