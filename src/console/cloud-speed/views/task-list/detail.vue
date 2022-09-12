<template>
  <div>
    <DmToolbar>
      <template slot="right">
        <yd-form-select
          :selects="selectStatus"
          v-model="bindParams.exec_status"
          default-text="任务状态"
          style="width: 120px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.data_key"
          placeholder="请输入域名进行查询"
          @submit="handleSearch"
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
            label="域名"
            prop="bank"
            min-width="250"
          >
            <template slot-scope="scope">
              {{ scope.row.request.req_data.data_key }}
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            prop="api_name"
            min-width="250"
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
                v-else-if="scope.row.exec_status === STATUS_VAR.FINISH"
                class="color--success"
              >成功</span>
              <span
                v-else-if="scope.row.exec_status === STATUS_VAR.FAIL"
                class="color--success"
              >失败</span>
            </template>
          </el-table-column>
          <el-table-column
            label="原因"
            min-width="200"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.exec_msg">
                {{ scope.row.exec_msg }}
              </template>
              <template v-else>
                <span class="color--success">成功</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow ref="DialogRow" />
  </div>
</template>

<script>
import consoleLog from '@/mixins/consoleLog'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'
import DialogRow from './components/DialogRow'
import { STATUS_VAR } from './constants'

export default {
  components: { ToolbarLogCommon, DialogRow },

  mixins: [consoleLog],

  data() {
    return {
      STATUS_VAR,
      API_INDEX: '../agw/batch/console/v1/subtask/list',
      bindParams: {
        exec_status: '',
        data_key: ''
      },
      selectStatus: [
        {
          label: '成功',
          value: STATUS_VAR.FINISH
        },
        {
          label: '失败',
          value: STATUS_VAR.FAIL
        }
      ]
    }
  },

  methods: {
    formatParams(params) {
      return {
        ...params,
        task_id: this.$route.query.id
      }
    },

    formatResponse(response) {
      return response
    }
  }
}
</script>
