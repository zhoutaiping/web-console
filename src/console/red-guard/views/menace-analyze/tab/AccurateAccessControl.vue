<template>
  <div>
    <DmToolbar>
      <SelectWebsite @submit="handleDomainSelect" />
      <InputSearch
        v-model="params.rule_id"
        style="width: 240px"
        placeholder="规则ID"
        @submit="init()"
      />
      <template slot="right">
        <yd-form-select
          v-model="params.action"
          :selects="wafSelects.actionType"
          default-text="全部"
          style="width: 120px; margin-right: 8px"
          @change="init()"
        />
        <DateSelection
          custom-secound
          style="vertical-align: top;"
          @timevalue="handleDateChange"
        />
      </template>
    </DmToolbar>
    <yd-card>
      <item-number-group>
        <item-number
          v-for="(item, index) in listIndex"
          :loading="loading"
          :key="index"
          :value="item.value"
          :title="item.title"
          :color="item.color"
          unit="次"
        />
      </item-number-group>
    </yd-card>
    <DmData
      ref="dmData"
      :inner-card="false"
      style="margin-top: 12px"
      @init="initPage"
      @auto-init="false"
    >
      <DmTable
        :loading="loading"
        animate
      >
        <el-table :data="list">
          <el-table-column
            min-width="150"
            label="规则集ID"
          >
            <template slot-scope="scope">
              {{ scope.row.ruleset_id }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="规则ID"
          >
            <template slot-scope="scope">
              <PopoverWallRuleId :id="scope.row.rule_id">
                {{ scope.row.rule_id }}
              </PopoverWallRuleId>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="触发对象"
          >
            <template slot-scope="scope">
              {{ scope.row.target }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="处理方式"
          >
            <template slot-scope="scope">
              <column-wall-record-action-status :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="触发次数"
          >
            <template slot-scope="scope">
              <a @click="handleToDetail(scope.row)">
                <strong>{{ scope.row.rule_num }} 次</strong>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            align="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleToDetail(scope.row)"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import { vPagination } from '@/utils/array'
import NavbarPage from '@/components/Navbar/NavbarPage'
import ColumnWallRecordActionStatus from '@/components/Column/ColumnWallRecordActionStatus'
import ItemNumber from '@/components/Item/ItemNumber'
import ItemNumberGroup from '@/components/Item/ItemNumberGroup'
import PopoverWallRuleId from '@/components/Popover/PopoverWallRuleId'
import DateSelection from '@/components/DateSelect/DateSelection'
import wafMixins from '@/console/red-guard/mixins/waf'
import InputSearch from '@/components/Input/InputSearch'
import SelectWebsite from '../components/SelectWebsite'

export default {
  components: { SelectWebsite, NavbarPage, ItemNumber, DateSelection, ItemNumberGroup, PopoverWallRuleId, ColumnWallRecordActionStatus, InputSearch },

  mixins: [wafMixins],

  data() {
    return {
      listIndex: [],
      loading: false,
      list: [],
      listRaw: [],
      params: {
        rule_id: '',
        action: '',
        start_time: '',
        end_time: '',
        sub_domain: [],
        type: 'firewall'
      }
    }
  },

  created() {
    this.wafFetchSettings()
    this.wafFetchDomainList()
    this.params.rule_id = this.$route.query.rule_id
  },

  methods: {
    initPage(params) {
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    },

    handleDomainSelect({ sub_domain }) {
      this.params.sub_domain = sub_domain
      this.init()
    },

    handleDateChange(start_time, end_time) {
      this.params.start_time = start_time
      this.params.end_time = end_time

      this.init()
    },

    handleToDetail(row) {
      const { rule_id, ruleset_id } = row
      const { start_time, end_time } = this.params
      this.$router.push({
        name: 'cloud-speed.router.menaceAnalyze__AccurateAccessControlId',
        params: {
          id: rule_id
        },
        query: {
          http_host: row.domain,
          ruleset_id,
          start_time,
          end_time
        }
      })
    },

    handleTypeChange(value) {
      const path = value.path
      this.params.type = path
      window.sessionStorage.wallDashboardSelectType = path
      this.init()
    },

    async init(params = {}) {
      this.loading = true
      this.list = []
      const { action } = params
      const data = await this.Fetch.post('V4/stati.data.get', {
        router: 'access.control.rules.stats',
        ...params,
        ...this.params
      })
      let { list = [] } = data

      if (action) list = list.filter(item => item.action === action)

      list.forEach(item => {
        item.target = item.domain
      })

      this.listRaw = list
      const listIndex = [
        {
          title: '命中规则总次数',
          value: data.total,
          color: 'primary'
        },
        {
          title: '命中观察次数',
          value: data.watch_total,
          color: 'primary'
        },
        {
          title: '命中人机识别次数',
          value: data.verification_total,
          color: 'primary'
        },
        {
          title: '命中阻断次数',
          value: data.deny_total,
          color: 'danger'
        },
        {
          title: '命中封禁次数',
          value: data.block_total,
          color: 'warning'
        },
        {
          title: '命中放行次数',
          value: data.pass_total,
          color: 'green'
        },
        {
          title: '命中蜜网牵引次数',
          value: data.web_pot_total,
          color: 'warning'
        }
      ]

      this.$refs.dmData.init({ total: list.length })
      this.initPage({ page: 1, per_page: 10 })
      this.listIndex = listIndex
      this.loading = false
    }
  }
}
</script>
