<template>
  <div>
    <ToolbarLogCommon
      show-export
      @submit="handleSearch"
      @click-export="downloadLog(bindParams)"
    />
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="操作时间"
            min-width="180"
            prop="create_at"
          />
          <el-table-column
            label="操作对象"
            min-width="300"
          >
            <template slot-scope="scope">
              <ColumnList :list="scope.row.targetData" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作IP"
            min-width="150"
            prop="ip"
          />
          <el-table-column
            label="操作内容"
            min-width="300"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.content"
                :url="false"
                :max-length="200"
                line-feed
              />
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleLog from '@/mixins/consoleLog'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ColumnList from '@/components/Column/ColumnList'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'
import { downloadLog, formatTarget } from '@/api/oplog'

export default {
  components: { ColumnList, ToolbarLogCommon, PopoverEllipsis },

  mixins: [consoleLog],

  data() {
    return {
      API_INDEX: '../agw/oplog/console/user/oplog/list',
      bindParams: {
        biz_type: '零信任',
        data_key: ''
      }
    }
  },

  methods: {
    downloadLog,

    formatResponse(response) {
      const { list = [], data_key_map } = response
      list.forEach(item => {
        const targetData = formatTarget(item.data_key, data_key_map)
        item.targetData = targetData.length ? targetData : ['-']
      })
      return response
    },

    async handleSearch(params) {
      const { start_time, end_time, keyword } = params
      this.bindParams.data_key = keyword
      this.bindParams.start_time = start_time
      this.bindParams.end_time = end_time
      this.$refs.DmData.initPage()
    }
  }
}
</script>
