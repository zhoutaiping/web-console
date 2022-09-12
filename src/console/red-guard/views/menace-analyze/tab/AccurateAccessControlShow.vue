<template>
  <div title="规则详情">
    <DmToolbar>
      <router-link :to="{ name: 'cloud-speed.router.menaceAnalyze__AccurateAccessControl' }">
        <el-button>返回</el-button>
      </router-link>
      <toolbar-wall-dashboard-detail
        slot="right"
        :type="params.type"
        @init="init"
      />
    </DmToolbar>
    <dm-data
      ref="dmData"
      @init="initPage"
    >
      <template
        v-if="showAll"
        slot="pagination-desc"
      >
        共 {{ totalRaw }} 条记录（最多显示 3,000 条记录）
      </template>
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            min-width="150"
            label="访问时间"
          >
            <template slot-scope="scope">
              {{ scope.row.timestamp }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="访客IP"
          >
            <template slot-scope="scope">
              {{ scope.row.remote_addr }} [{{ scope.row.areaView }}]
            </template>
          </el-table-column>
          <el-table-column
            min-width="60"
            label="IP类型"
          >
            <template slot-scope="scope">
              {{ scope.row.remote_addr_info.type || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="访问域名"
          >
            <template slot-scope="scope">
              {{ scope.row.http_host }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            label="请求URL"
          >
            <template slot-scope="scope">
              <popover-ellipsis
                v-model="scope.row.request_url"
                :max-length="40"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="80"
            label="处置动作"
          >
            <template slot-scope="scope">
              <column-wall-record-action-status :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            align="right"
            label="规则ID"
          >
            <template slot-scope="scope">
              <popover-wall-rule-id :id="scope.row.rule_id">
                {{ scope.row.rule_id }}
              </popover-wall-rule-id>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </dm-data>
  </div>
</template>

<script>
import { vPagination } from '@/utils/array'
import ColumnRuleTirggerStatus from '@/components/Column/ColumnRuleTirggerStatus'
import DateSelection from '@/components/DateSelect/date-selection'
import ToolbarWallDashboardDetail from '@/components/Toolbar/ToolbarWallDashboardDetail'
import PopoverWallRuleId from '@/components/Popover/PopoverWallRuleId'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ColumnWallRecordActionStatus from '@/components/Column/ColumnWallRecordActionStatus'

function formatAreaView(data) {
  const { country, province, city } = data
  return [country === '中国' ? '' : country, province, city].filter(Boolean).join('-')
}

export default {
  components: { ColumnRuleTirggerStatus, DateSelection, ToolbarWallDashboardDetail, PopoverWallRuleId, PopoverEllipsis, ColumnWallRecordActionStatus },

  data() {
    return {
      loading: false,
      params: {},
      dateRange: [],
      list: [],
      listRaw: [],
      initFirst: true,
      type: null,
      showAll: false,
      totalRaw: 0
    }
  },

  created() {
    const { start_time, end_time, ruleset_id, http_host } = this.$route.query
    const { id: rule_id } = this.$route.params

    const params = {
      http_host,
      ruleset_id,
      rule_id,
      start_time,
      end_time
    }
    this.params = params
  },

  methods: {
    initPage(params) {
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    },

    async init(params = {}) {
      this.loading = true
      params = {
        router: 'access.control.rules.detail',
        ...this.params,
        ...params
      }

      const data = await this.Fetch.post('V4/stati.data.get', params)
      const { list = [], total, page_total: totalRaw } = data
      list.forEach(item => {
        item.areaView = formatAreaView(item.remote_addr_info)
      })

      this.totalRaw = totalRaw
      this.listRaw = list
      this.showAll = total < totalRaw
      this.$refs.dmData.init({ total })

      this.initPage({ page: 1, per_page: 10 })
      this.loading = false
      this.initFirst = false
    }
  }
}
</script>
