<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <DmCard
          :loading="loading"
          title="TOP5 今日被攻击页面"
        >
          <DmTable type="white">
            <el-table :data="topFiveURL">
              <el-table-column
                prop="url"
                label="URL"
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
            <el-table :data="topFiveIP">
              <el-table-column
                prop="ip"
                label="攻击IP"
              />
              <el-table-column
                prop="format_count"
                label="拦截次数"
              >
                <template slot-scope="scope">
                  {{ scope.row.format_count }}{{ scope.row.unit }}
                </template>
              </el-table-column>
              <el-table-column
                prop="loaction.province"
                label="归属地"
              />
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
      topFiveURL: [],
      topFiveIP: []
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
      const params = {
        package_id: this.reportParams.package_id
      }
      this.loading = true
      const data = await this.Fetch.get('V4/statistic.tjkd.plus.web.cc.top', params)
      const { top_request_url = [], top_remote_addr = [] } = data
      if (top_request_url.length) {
        this.topFiveURL = top_request_url.slice(0, 5)
      }

      if (top_remote_addr.length) {
        this.topFiveIP = top_remote_addr.slice(0, 5)
      }
      this.loading = false
    }
  }
}
</script>
