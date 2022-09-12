<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <DmCard
          :loading="loading"
          title="TOP5 今日被攻击IP/端口"
        >
          <DmTable type="white">
            <el-table :data="topServer">
              <el-table-column
                prop="url"
                label="IP/端口"
              />
              <el-table-column
                prop="format_count"
                label="攻击次数"
                width="90"
              >
                <template slot-scope="scope">
                  {{ scope.row.format_count }}{{ scope.row.unit }}
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmCard>
      </el-col>
      <el-col :span="12">
        <DmCard
          :loading="loading"
          title="TOP5 今日攻击IP"
        >
          <DmTable type="white">
            <el-table :data="topRemote">
              <el-table-column
                prop="ip"
                label="攻击IP"
              />
              <el-table-column
                prop="format_count"
                label="拦截次数"
                width="90"
              >
                <template slot-scope="scope">
                  {{ scope.row.format_count }}{{ scope.row.unit }}
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmCard>
      </el-col>
    </el-row>
    <ChartCCAttack ref="ChartCCAttack" class="margin-top" />
    <ChartCCAttackMap ref="ChartCCAttackMap" class="margin-top" />
  </div>
</template>

<script>
import ColumnRatio from '@/components/Column/ColumnRatio'
import cwReport from '../../../../mixins/cwReport'
import ChartCCAttack from './components/ChartCCAttack'
import ChartCCAttackMap from './components/ChartCCAttackMap'

export default {
  components: {
    ColumnRatio,
    ChartCCAttack,
    ChartCCAttackMap
  },

  mixins: [cwReport],

  data() {
    return {
      loading: true,
      topServer: [],
      topRemote: []
    }
  },

  watch: {
    utime(val) {
      this.init()
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      this.fetchData()
      this.$refs.ChartCCAttack.fetchData()
      this.$refs.ChartCCAttackMap.fetchData()
    },

    async fetchData() {
      const params = this.reportParams
      this.loading = true
      const data = await this.Fetch.get('V4/statistic.tjkd.plus.tcp.cc.top', params)
      this.topServer = data.top_server_addr
      this.topRemote = data.top_remote_addr
      this.loading = false
    }
  }
}
</script>
