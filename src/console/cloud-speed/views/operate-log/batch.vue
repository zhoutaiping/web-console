<template>
  <div>
    <DmToolbar>
      <ToolbarLog
        ref="toolbar"
        @search="handleSearch"
        @export="handleExport"
      />
    </DmToolbar>
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
            min-width="150"
            prop="update_at"
            label="操作时间"
          />
          <el-table-column
            prop="domains"
            label="操作对象"
            min-width="180"
          />
          <el-table-column
            min-width="180"
            prop="ip"
            label="操作IP"
          />
          <el-table-column
            prop="title"
            label="详情"
            min-width="300"
          />
          <el-table-column
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === '1'"
                class="color-success"
              >成功</span>
              <span
                v-else
                class="color-danger"
              >失败</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="error"
            min-width="180"
            label="原因"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ToolbarLog from './ToolbarLog'
import { downloadFile } from '@/utils/export'

export default {
  components: { ToolbarLog },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: '/V4/Web.Domain.batch.log.search',
      bindParams: {}
    }
  },

  methods: {
    formatDomains(data) {
      try {
        const { _domains } = JSON.parse(data)
        return Object.values(_domains).join(',')
      } catch (e) {
        return ''
      }
    },

    formatError(data) {
      try {
        const { status } = JSON.parse(data)
        if (status && status.code !== 1) {
          return status.message
        } else {
          return '成功'
        }
      } catch (e) {
        return '-'
      }
    },

    formatResponse(response) {
      const { list } = response
      list.forEach(item => {
        item.domains = this.formatDomains(item.params)
        item.error = this.formatError(item.result)
      })
      return response
    },

    async handleSearch(params) {
      this.bindParams = params
      this.$refs.DmData.initPage()
    },

    async handleExport(params) {
      const data = await this.Fetch.get('/V4/Web.Domain.batch.log.export', params)
      const { key } = data
      downloadFile(key)
    }
  }
}
</script>
