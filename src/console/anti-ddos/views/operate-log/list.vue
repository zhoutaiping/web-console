<template>
  <div>
    <ToolbarLogCommon
      show-export
      @submit="handleSearch"
      @click-export="downloadFile"
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
            prop="timestamp"
          />
          <el-table-column
            label="操作对象"
            min-width="300"
            prop="target"
          />
          <el-table-column
            label="操作IP"
            min-width="150"
            prop="ip"
          >
            <template slot-scope="{ row }">
              {{ row.ip }}
              <span v-show="row.client_port">： {{ row.client_port }}</span>
            </template>
          </el-table-column>
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
          <el-table-column
            label="操作结果"
            min-width="100"
            prop="result"
          >
            <template slot-scope="scope">
              {{ scope.row.result ? '成功' :'失败' }}
              <span v-if="!scope.row.result && scope.row.extend">
                ({{ scope.row.extend }})
              </span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ColumnList from '@/components/Column/ColumnList'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'
import Help from '@/utils/help'
import consoleData from '@/mixins/consoleDataAds'
export default {
  components: { ColumnList, ToolbarLogCommon, PopoverEllipsis },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'admin/operation/query',
      bindParams: {}
    }
  },

  methods: {
    async downloadFile(params) {
      const { start_time, end_time, keyword } = params
      const param = {
        method: 'post',
        api: this.API_INDEX,
        data: this.formatParams({
          keyword: keyword || '',
          startTime: start_time || '',
          endTime: end_time || '',
          download: true
        })

      }
      const response = await this.Fetch.post('V4/ads.api', param)
      if (response.download_url) Help.download(response.download_url)
    },

    async handleSearch(params) {
      const { start_time, end_time, keyword } = params
      this.bindParams.keyword = keyword
      this.bindParams.startTime = start_time
      this.bindParams.endTime = end_time
      this.$refs.DmData.initPage()
    }
  }
}
</script>
