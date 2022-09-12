<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleCreate()"
      >新增</el-button>
      <el-button @click="handleBatchCreate()">批量新增</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column label="协议类型">
            <template slot-scope="scope">
              {{ scope.row.protocol | labelView(moduleLabel['cloud-speed'].PROTOCOL_TYPE) }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="监听端口"
            prop="listen_port"
          />
          <el-table-column
            min-width="120"
            label="取源协议"
          >
            <template slot-scope="scope">
              {{ scope.row.get_source_protocol | labelView(moduleLabel['cloud-speed'].SOURCE_PROTOCOL) }}
            </template>
          </el-table-column>
          <el-table-column
            label="源站地址"
            min-width="230"
          >
            <template slot-scope="scope">
              <ColumnListIp :list="scope.row.records_list" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowEdit(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <PopoverConfirm
                content="确认删除？"
                @submit="handleRowDelete(scope.row)"
              >
                <el-button type="text">刪除</el-button>
              </PopoverConfirm>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListIp from '@/components/Column/ColumnListIp'
import DialogRow from './components/DialogRow'
import panelMixins from '../../panelMixins'

export default {
  components: { ColumnListIp, DialogRow },

  mixins: [consoleData, panelMixins],

  data() {
    return {
      API_INDEX: 'V4/Web.Domain.listenPort.list',
      bindParams: {
        domain_id: this.$route.params.id
      }
    }
  },

  methods: {
    async handleCreate() {
      await this.confirmAction()
      this.$refs.DialogRow.handleOpen()
    },

    async handleBatchCreate() {
      await this.confirmAction()
      this.$refs.DialogRow.handleOpen({}, { batch: true })
    },

    async handleRowEdit(row) {
      await this.confirmAction()
      this.$refs.DialogRow.handleOpen(row)
    },

    async handleRowDelete(row) {
      await this.confirmAction()
      try {
        await this.Fetch.delete('V4/Web.Domain.listenPort.del', { domain_id: this.domainId, id: row.id })
      } catch (e) {
        return
      }
      this.fetchList()
    },

    formatResponse(response) {
      const { list = [] } = response
      list.forEach(_ => {
        // TODO PHP
        _.back_source_type = Number(_.back_source_type)
        _.get_source_protocol = Number(_.get_source_protocol)
        _.load_balance = Number(_.load_balance)
        _.protocol = Number(_.protocol)
      })
      this.$emit('forbiddenPorts', response.forbiddenPorts)
      return response
    }
  }
}
</script>
