<template>
  <div>
    <DmToolbar>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAction('enable')"
      >开启</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAction('disable')"
      >暂停</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAction('delete')"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.domain"
          @submit="fetchList"
        />
      </div>
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
            prop="domain"
            min-width="200"
          />
          <el-table-column
            label="所属套餐 / 名称"
            min-width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.meal_flag }} <br>
              {{ scope.row.plan_diy_name }}
            </template>
          </el-table-column>
          <el-table-column
            label="监控状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <template v-if="Number(scope.row.task_status) === 1">
                <span class="color--success">
                  正常
                </span>
              </template>
              <template v-else>
                <span class="color--danger">
                  被劫持
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="监控频率"
            min-width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.frequency }} 分钟
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            min-width="200"
          >
            <template slot-scope="scope">
              <template v-if="Number(scope.row.status) === 1">
                <span class="color--success">
                  开启
                </span>
              </template>
              <template v-else>
                <span class="color--danger">
                  关闭
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="180"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="handleRowEdit(scope.row)"
                >配置</el-button>
                <PopoverConfirm
                  content="确认删除"
                  @submit="handleRowDelete(scope.row)"
                >
                  <el-button type="text">删除</el-button>
                </PopoverConfirm>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddDnsMonitor
      ref="DialogAddDnsMonitor"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogAddDnsMonitor from '../propertys/components/DialogAddDnsMonitor'

export default {
  components: { DialogAddDnsMonitor },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/dns.hijack.task.list',
      API_METHOD: 'post',
      bindParams: {
        domain: ''
      },
      selectionId: []
    }
  },

  created() {
    const property_id = this.$route.params.id
    if (property_id) {
      this.API_INDEX = 'V4/smgc.property.info'
      this.bindParams = { property_id }
      this.formatResponse = function(response) {
        response.list = response.dns_hijack_task_list
        response.total = response.dns_hijack_task_list.length
        return response
      }
    }
  },

  methods: {
    handleSelectionChange(selection) {
      this.selectionId = selection.map(_ => _.task_uuid)
    },

    formatResponse(response) {
      return response
    },

    handleRowEdit(row) {
      this.$refs.DialogAddDnsMonitor.handleOpen(row)
    },

    async fetchAction(params, operate) {
      try {
        await this.Fetch.post(`V4/dns.hijack.task.${operate}`, params)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    handleRowDelete(row) {
      this.fetchAction({ task_uuids: [row.task_uuid] }, 'delete')
    },

    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(() => {
        this.fetchAction({ task_uuids: this.selectionId }, operate)
      })
    }
  }
}
</script>
