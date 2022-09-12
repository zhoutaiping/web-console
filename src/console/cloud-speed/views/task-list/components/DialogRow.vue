<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    width="800px"
    title="任务详情"
  >
    <DmData
      ref="DmData"
      :auto-init="false"
      class="margin-top"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            width="150px"
            label="编辑时间"
          >
            <template slot-scope="scope">
              {{ scope.row.update_at }}
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            label="规则 ID"
            prop="code"
          />
          <el-table-column label="规则详情">
            <template slot-scope="scope">
              <ColumnRules :items="scope.row.rules" />
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>

<script>
import consoleLog from '@/mixins/consoleLog'
import createDialog from '@/utils/createDialog'

export default createDialog({

  mixins: [consoleLog],

  data() {
    return {
      API_INDEX: '../agw/batch/console/v1/subtask/info',
      bindParams: {
        mainid: ''
      }
    }
  },

  methods: {
    afterOpen(row) {
      this.bindParams.task_id = row.id
      this.$nextTick(() => {
        this.fetchList()
      })
    }
  }
})
</script>
