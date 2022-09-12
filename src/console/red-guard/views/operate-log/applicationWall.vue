<template>
  <div>
    <ToolbarLogCommon
      ref="toolbar"
      @submit="fetchInit"
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
            prop="updated_at"
          />
          <el-table-column
            :label="$t('column.operationTarget')"
            min-width="150"
            prop="domain"
          />
          <el-table-column
            :label="$t('column.operationIp')"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.ip || $t('text.unknown') }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('column.operationContent')"
            min-width="250"
            prop="info"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'

export default {
  components: { ToolbarLogCommon },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/WebCdn.logs.list',
      bindParams: {
        type: 3
      }
    }
  },

  methods: {
    formatParams(params) {
      params.info = params.keyword
      return params
    }
  }
}
</script>
