<template>
  <DmData
    ref="DmData"
    :auto-init="false"
    :show-pagination="false"
    @init="fetchList"
  >
    <DmTable
      :loading="loading"
      border
    >
      <el-table
        ref="list"
        :data="list"
        :height="400"
      >
        <el-table-column
          label="规则创建时间/规则ID"
          min-width="150"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.create_at }}
            </div>
            <div>
              {{ scope.row.id }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="匹配条件"
          min-width="120"
        >
          <template slot-scope="scope">
            <ColumnRules :items="scope.row.rules" />
          </template>
        </el-table-column>
        <el-table-column
          label="处置方式"
          min-width="120"
        >
          <template slot-scope="scope">
            <ColumnRulesAction :data="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmData>
</template>

<script>
import create from '@/utils/create-basic'
import consoleData from '@/mixins/consoleData'
import wafMixins from '@/console/red-guard/mixins/waf'
import ColumnRulesAction from '@/console/red-guard/components/TableWAF/components/ColumnRulesAction'
import ColumnRules from '@/console/red-guard/components/TableWAF/components/ColumnRules'
export default create({
  components: { ColumnRules, ColumnRulesAction },
  mixins: [consoleData, wafMixins],

  props: {
    id: [Boolean, String]
  },

  data() {
    return {
      bindParams: {
        group_id: ''
      },
      API_INDEX: 'V4/firewall.policy.tpl.get'
    }
  },

  methods: {
    init() {
      this.bindParams.group_id = this.id
      this.bindParams.per_page = 999
      this.bindParams.pagesize = 999
      this.fetchList()
    }

  }
})
</script>
