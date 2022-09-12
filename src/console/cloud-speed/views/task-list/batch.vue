<template>
  <div>
    <DmToolbar>
      <template slot="right">
        <yd-form-select
          :selects="selectStatus"
          v-model="bindParams.exec_status"
          default-text="任务状态"
          @change="handleSearch"
        />
      </template>
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
            prop="bank"
            label="操作类型"
            min-width="300"
          />
          <el-table-column
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.exec_status === STATUS_VAR.WAIT"
                class="color--warning"
              >未开始</span>
              <span
                v-else-if="scope.row.exec_status === STATUS_VAR.PROGRESS"
                class="color--primary"
              >进行中</span>
              <span
                v-else
                class="color--success"
              >完成</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="详情"
            align="right"
          >
            <template slot-scope="scope">
              <router-link :to="{name: 'cloud-speed.router.taskList__operateLogBatch__Detail', query: {id: scope.row._id }}">
                共操作 {{ scope.row.total }} 个域名，成功 {{ scope.row.total_ok }} 个，失败 {{ scope.row.total_fail }} 个
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleLog from '@/mixins/consoleLog'
import moment from 'moment'
import { STATUS_VAR } from './constants'

export default {
  mixins: [consoleLog],

  data() {
    return {
      STATUS_VAR,
      API_INDEX: '../agw/batch/console/v1/task/list',
      selectStatus: [
        {
          label: '未开始',
          value: STATUS_VAR.WAIT
        },
        {
          label: '进行中',
          value: STATUS_VAR.PROGRESS
        },
        {
          label: '完成',
          value: STATUS_VAR.FINISH
        }
      ],
      bindParams: {
        exec_status: ''
      }
    }
  },

  methods: {
    formatResponse(response) {
      let { list = [] } = response
      if (list === null) list = []
      list.forEach(item => {
        item.update_at = moment(item.update_at).format('YYYY-MM-DD H:mm:ss')
      })
      return response
    }
  }
}
</script>
