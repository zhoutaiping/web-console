<template>
  <div>
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
            prop="property_object"
            label="扫描对象"
            min-width="150"
          />
          <el-table-column
            prop="scan_pattern"
            label="扫描模式"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ Number(scope.row.scan_pattern) | labelView(consoleLabel.scan_pattern) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="scan_agreement"
            label="配置类型"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.is_plan === '0' ? '立即任务' : '计划任务' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="terrace"
            label="扫描情况"
            min-width="100"
          >
            <template slot-scope="scope">
              <span> {{ scope.row.scan_status_name }} </span>
              <template v-if="scope.row.is_plan === '1'">
                第{{ scope.row.use_number }}次 <span v-show="scope.row.is_cancel">({{ scope.row.is_cancel }})</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="添加时间"
            min-width="140"
          />
          <el-table-column
            label="操作"
            min-width="100"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  :disabled="!scope.row.is_ban"
                  type="text"
                  @click="handleRowEdit(scope.row)"
                >配置</el-button>
                <PopoverConfirm @submit="handleCancelCycleScan(scope.row.id)">
                  <el-button
                    v-popover:cancelCycleScan
                    :disabled="!scope.row.is_ban"
                    type="text"
                  >取消剩余计划</el-button>
                </PopoverConfirm>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddScanWeb
      ref="DialogAddScanWeb"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import PopoverConfirm from '@/components/Popover/PopoverConfirm'
import DialogAddScanWeb from '../propertys/components/DialogAddScanWeb'

export default {
  components: { PopoverConfirm, DialogAddScanWeb },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/shield.scan.task.list',
      bindParams: {
        property_object: this.$route.query.property_object
      }
    }
  },

  methods: {
    formatResponse(response) {
      return response
    },

    async handleCancelCycleScan(scan_task_id) {
      try {
        await this.Fetch.put('/V4/shield.cycle.scan.cancel', { scan_task_id })
      } catch (err) {
        return
      }
      this.Message('ACTION_SUCCESS')
    },

    async handleRowEdit(row) {
      const data = await this.Fetch.post('V4/shield.scan.setting.info', { scan_task_id: row.id })
      data.is_plan = Number(data.is_plan)
      data.is_agree = Number(data.is_agree)
      data.scan_pattern = Number(data.scan_pattern)
      data.protocol = Number(data.protocol)
      data.notice_type = data.notice_type.map(Number)
      data.id = row.id
      // TODO
      this.$refs.DialogAddScanWeb.handleOpen(data, { mode: 'Edit' })
    }
  }
}
</script>
