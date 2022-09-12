<template>
  <div title="规则详情">
    <DmToolbar>
      <router-link to="/dataReport/accurateAccessControl">
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
        v-if="!showAll"
        slot="pagination-desc"
      >
        最多显示 10,000 条记录
      </template>
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            width="150"
            label="访问时间"
          >
            <template slot-scope="scope">
              {{ scope.row.timestamp }}
            </template>
          </el-table-column>
          <el-table-column
            width="130"
            label="访客IP"
          >
            <template slot-scope="scope">
              {{ scope.row.remote_addr }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="params.type === 'firewall'"
            label="访问域名"
          >
            <template slot-scope="scope">
              {{ scope.row.http_host }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="params.type === 'firewall_tcp'"
            label="所属套餐"
          >
            <template slot-scope="scope">
              {{ scope.row.package_name }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="params.type === 'firewall'"
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
            v-if="params.type === 'firewall_tcp'"
            label="被攻击IP/端口"
          >
            <template slot-scope="scope">
              {{ scope.row.server_addr }} / {{ scope.row.server_port }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="40"
            label="防护动作"
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
      showAll: true
    }
  },

  created() {
    const { start_time, end_time, type = 'firewall' } = this.$route.query
    const { id } = this.$route.params

    const params = {
      rule_id: id,
      type,
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
      const { rule_id, type, start_time, end_time } = this.params

      Object.assign(params, {
        rule_id,
        type,
        start_time,
        end_time
      })

      const data = await this.Fetch.get('V4/firewall.report.package.block.details', params)
      const { list = [], total = 0 } = data
      this.listRaw = list
      this.showAll = total <= 10000
      this.$refs.dmData.init({ total: total > 10000 ? 10000 : total })

      this.initPage({ page: 1, per_page: 10 })
      this.loading = false
      this.initFirst = false
    }
  }
}
</script>
