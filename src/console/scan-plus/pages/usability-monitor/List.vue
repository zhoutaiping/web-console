<template>
  <div>
    <DmToolbar>
      <!-- <el-button
        type="primary"
        @click="addMonitorList"
      > + 添加监控</el-button> -->
      <el-button
        :disabled="multipleSelection.length === 0"
        @click="handleAction('enable')"
      >开启</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        @click="handleAction('disable')"
      >暂停</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        @click="handleAction('delete')"
      >删除</el-button>
      <InputSearch
        slot="right"
        v-model="bindParams.target"
        placeholder="监控IP / 任务名称"
        @submit="handleSearch"
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
        <el-table
          :data="list"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="监控对象"
            min-width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.name }} [{{ scope.row.target || scope.row.domain }}]
            </template>
          </el-table-column>
          <el-table-column
            prop="protocol"
            label="监控协议"
            min-width="100"
          />
          <el-table-column
            label="监控频率"
            min-width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.frequency }} 分钟
            </template>
          </el-table-column>
          <el-table-column
            label="目标状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.target_status === '1'"
                class="color--success"
              >正常</span>
              <span
                v-else
                class="color--danger"
              >宕机</span>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="3"
                inactive-value="1"
                @change="handleChangeStatus(scope)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="120"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="handleRowEdit(scope.row)"
                >配置</el-button>
                <router-link :to="{path :`detail/${scope.row.uuid}`, query: {target: scope.row.target, pageTitle: scope.row.target}}">
                  <el-button type="text">统计</el-button>
                </router-link>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddUsabilityMonitor
      ref="DialogAddUsabilityMonitor"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogAddUsabilityMonitor from '../propertys/components/DialogAddUsabilityMonitor'

export default {
  components: { DialogAddUsabilityMonitor },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/cloud.monitor.task.list',
      API_METHOD: 'post',
      multipleSelection: [],
      bindParams: {
        target: ''
      }
    }
  },

  created() {
    const property_id = this.$route.params.id
    if (property_id) {
      this.API_INDEX = 'V4/smgc.property.info'
      this.bindParams = { property_id }
      this.formatResponse = function (response) {
        response.list = response.monitor_task_list
        response.total = response.monitor_task_list.length
        return response
      }
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleRowEdit(row) {
      this.$refs.DialogAddUsabilityMonitor.handleOpen(row)
    },

    async handleChangeStatus(scope) {
      const { row } = scope
      const { status, uuid } = row
      const params = {
        uuid: [uuid]
      }

      try {
        if (status === '3') {
          await this.Fetch.post('V4/cloud.monitor.task.enable', params)
        } else {
          await this.Fetch.post('V4/cloud.monitor.task.disable', params)
        }
        this.Message('ACTION_SUCCESS')
      } catch (e) {
        return
      } finally {
        this.fetchList()
      }
    },

    async handleMonitor(selection, handleOperate) {
      const params = {
        uuid: selection.map(_ => _.uuid)
      }

      try {
        await this.Fetch.post(`V4/cloud.monitor.task.${handleOperate}`, params)
        this.Message('ACTION_SUCCESS')
      } catch (e) {
        return
      } finally {
        this.fetchList()
      }
    },

    handleAction(operate) {
      this.$confirm('确认操作？', '提示', {
        type: 'warning'
      }).then(() => {
        this.handleMonitor(this.multipleSelection, operate)
      })
    }
  }
}
</script>
