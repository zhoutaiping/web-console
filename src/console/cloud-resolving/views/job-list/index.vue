<template>
  <console-page-layout>
    <DmToolbar>
      <yd-form-radio-button
        v-model="bindParams.status"
        :radios="TASK_STATUS"
        @change="handleSearch"
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
            prop="created_at"
            label="创建时间"
            min-width="180"
          />
          <el-table-column
            prop="typeView"
            label="操作类型"
            min-width="120"
          />
          <el-table-column
            label="状态"
            min-width="120"
          >
            <template slot-scope="scope">
              <span :class="`color--${scope.row.statusColor}`">{{ scope.row.statusView }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="任务详情"
            min-width="350"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleDetail(scope.row)"
              >{{ scope.row.desc }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'

const Labels = {
  statusColor: {
    0: 'warning',
    1: 'warning',
    2: 'danger',
    3: 'success'
  }
}

export default {
  mixins: [consoleData],

  data() {
    return {
      Labels,
      TASK_STATUS: [
        {
          label: '执行中',
          value: 1
        },
        {
          label: '历史任务',
          value: ''
        }
      ],
      API_INDEX: 'V4/CloudDns.DomainRecords.batchList',
      bindParams: {
        status: ''
      }
    }
  },

  methods: {
    formatResponse(response) {
      const { status_list, type_list } = response
      response.list.forEach(item => {
        const status = Number(item.status)
        item.status = status
        item.statusView = status_list[status]
        item.statusColor = Labels.statusColor[status]
        item.typeView = type_list[Number(item.type)]
      })
      return response
    },

    handleDetail(row) {
      if (row.status === 0 || row.status === 1) {
        this.$message.warning('任务未执行成功，暂无详情')
        return
      }
      this.$router.push({
        name: 'cloud-resolving.router.jobList__detail-list',
        query: { id: row.id }
      })
    }
  }
}
</script>
