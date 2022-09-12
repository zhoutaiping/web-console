<template>
  <div>
    <ToolbarLogCommon
      ref="toolbar"
      show-export
      @submit="fetchInit"
      @click-export="handleExport"
    />
    <DmData
      ref="DmData"
      min-height
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            :label="$t('column.operationTime')"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.create_at }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('column.operationTarget')"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.data.domain }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('column.operationIp')"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.ip || $t('text.unknown') }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('column.operationType')"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnWallLogType :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('column.operationContent')"
            min-width="250"
          >
            <template slot-scope="scope">
              <ColumnRules :items="scope.row.rules.rules" />
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import { downloadFile } from '@/utils/export'
import consoleData from '@/mixins/consoleData'
import wafMixins from '@/console/red-guard/mixins/waf'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'
import ColumnWallLogType from '@/components/Column/ColumnWallLogType'
import ColumnRules from '@/components/Column/ColumnRules'

export default {
  components: { ToolbarLogCommon, ColumnRules, ColumnWallLogType },

  mixins: [consoleData, wafMixins],

  data() {
    return {
      API_INDEX: 'V4/firewall.oplog',
      bindParams: {
        bank: 'firewall'
      }
    }
  },

  created() {
    this.wafFetchSettings()
  },

  methods: {
    async handleExport(params) {
      const data = await this.Fetch.post('V4/firewall.oplog.export', params)
      const { key } = data
      downloadFile(key)
    },

    formatResponse(response) {
      const { list = [] } = response
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
      return response
    }

  }
}
</script>
