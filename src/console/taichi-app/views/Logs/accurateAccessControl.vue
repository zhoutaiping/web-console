<template>
  <div>
    <toolbar-wall-log
      ref="toolbar"
      @init="initSearch"
      @click-export="handleExport"
    />
    <DmData
      ref="DmData"
      :params="params"
      @init="init"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            width="200"
            label="操作时间"
          >
            <template slot-scope="scope">
              {{ scope.row.create_at }}
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="操作对象"
          >
            <template slot-scope="scope">
              <div>
                {{ params.bank === 'firewall' ? scope.row.data.domain : scope.row.data.package_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作IP"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.ip || '未知' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作类型"
            min-width="80"
          >
            <template slot-scope="scope">
              <column-wall-log-type :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column label="对象详情" min-width="300">
            <template slot-scope="scope">
              <div v-if="scope.row.rules && scope.row.rules.rules">
                <ColumnRules :items="scope.row.rules.rules" />
              </div>
              <div v-else-if="scope.row.policys">
                <div
                  v-for="(item, index) in scope.row.policys"
                  :key="item.id"
                >
                  <hr
                    v-if="index > 0"
                    class="dotted"
                  >
                  <ColumnRules :items="item.rules" />
                </div>
              </div>
              <div v-else>
                <div v-if="scope.row.data && scope.row.data.policy_codes">
                  [鼠标移至 ID 查看详情]：
                  <span
                    v-for="(item, index) in scope.row.data.policy_codes"
                    :key="index"
                  >
                    <template v-if="index > 0">|</template>
                    <popover-wall-rule-id :id="item">{{ item }}</popover-wall-rule-id>
                  </span>
                </div>
                <div v-else>--</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import { downloadFile } from '@/utils/export'
import ColumnProtectedMode from '@/components/Column/ColumnProtectedMode'
import ColumnDomainService from '@/components/Column/ColumnDomainService'
import ColumnDomainStatus from '@/components/Column/ColumnDomainStatus'
import ColumnRules from '@/console/red-guard/components/TableWAF/components/ColumnRules'
import ColumnRulesStatus from '@/components/Column/ColumnRulesStatus'
import ColumnRulesAction from '@/components/Column/ColumnRulesAction'
import ColumnWallLogType from '@/components/Column/ColumnWallLogType'
import PopoverWallRuleId from '@/components/Popover/PopoverWallRuleId'
import ToolbarWallLog from '@/components/Toolbar/ToolbarWallLog'
import { deepClone } from '@/utils'
import { mapState } from 'vuex'
import wafMixins from '@/console/taichi-app/mixins/waf'

export default {
  components: { PopoverWallRuleId, ColumnProtectedMode, ColumnRules, ColumnDomainService, ColumnDomainStatus, ColumnRulesStatus, ColumnRulesAction, ColumnWallLogType, ToolbarWallLog },

  mixins: [wafMixins],

  data() {
    return {
      loading: true,
      list: [],
      popoverRule: {
        loading: false,
        data: {}
      },
      params: {
        bank: 'firewall_app'
      },
      popoverId: null
    }
  },

  computed: {
    ...mapState({
      MATCHING_ALL_TYPE: state => state.wall.MATCHING_ALL_TYPE
    })
  },

  created() {
    this.wafFetchSettings()
  },

  methods: {
    async handleExport(params) {
      params = deepClone(params)
      Object.assign(params, this.params)

      params.keyword = this.formatKeyword(params.keyword)
      const data = await this.Fetch.post('V4/firewall.oplog.export', params)
      const { key } = data
      downloadFile(key)
    },

    handleTypeChange(value) {
      const bank = value.path
      const params = this.$refs.DmData.getParams()
      params.bank = bank
      this.params.bank = bank
      this.$refs.toolbar.init()
      this.init(params)
    },

    initSearch() {
      this.$refs.DmData.initPage()
    },

    formatKeyword(val) {
      let data
      if (val && /.*[\u4e00-\u9fa5]+.*$/.test(val)) {
        data = this.MATCHING_ALL_TYPE.find(_ => _.label.indexOf(val) !== -1)
      }
      return data && data.value ? data.value : val
    },

    async init(params) {
      params = deepClone(params)
      this.loading = true

      Object.assign(params, this.$refs.toolbar.getParams())
      Object.assign(params, this.params)

      const { keyword } = params
      params.keyword = this.formatKeyword(keyword)

      const data = await this.Fetch.get('V4/firewall.oplog?bank=firewall', params)
      const total = parseInt(data.total, 10)
      this.$refs.DmData.init({ total })
      const { list = [] } = data

      list.forEach(item => {
        item.rules = JSON.parse(item.params)
        item.ids = JSON.parse(item.ids)
        const data = item.data ? JSON.parse(item.data) : {}
        item.data = data

        if (data.policys) {
          const list = []
          for (const k in data.policys) {
            list.push(data.policys[k])
          }
          item.policys = list
        }
      })

      this.list = list
      this.loading = false
    }
  }
}
</script>
