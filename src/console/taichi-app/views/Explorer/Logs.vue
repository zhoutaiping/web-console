<template>
  <div>
    <ToolbarLogCommon
      placeholder="IP"
      @submit="handleSearch"
    />
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
        >
          <el-table-column
            label="时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="变更前"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnListMore v-model="scope.row.before_change_ips"/>
            </template>
          </el-table-column>
          <el-table-column
            label="变更后"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnListMore v-model="scope.row.after_change_ips"/>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'

export default {
  components: { ColumnListMore, ToolbarLogCommon },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/tjkd.app.package.pool.change.log',
      bindParams: {
        package_id: this.$route.params.id
      }
    }
  },
  methods: {
    formatResponse(response) {
      return response
    },

    async handleSearch(params) {
      const { start_time, end_time, keyword } = params
      this.bindParams.ip_string = keyword
      this.bindParams.start_time = start_time
      this.bindParams.end_time = end_time
      this.$refs.DmData.initPage()
    }
  }
}
</script>
