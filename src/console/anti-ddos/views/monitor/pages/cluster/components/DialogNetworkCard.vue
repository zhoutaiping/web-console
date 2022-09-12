<template>
  <DmDialog
    ref="Dialog"
    :mode="mode"
    :title="title"
    :action-visible="false"
    width="800px"
  >
    <DmData
      ref="DmData"
      :show-pagination="false"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
      >
        <el-table :data="list">
          <el-table-column
            label="网卡名称"
            min-width="150"
          >
            <template slot-scope="scope">
              网卡{{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column
            label="RX流量(Mbps)"
            prop="rxBps"
            min-width="100"
          />
          <el-table-column
            label="RX报文(pps)"
            prop="rxPps"
            min-width="100"
          />
          <el-table-column
            label="TX流量(Mbps)"
            prop="txBps"
            min-width="100"
          />
          <el-table-column
            label="TX报文(pps)"
            prop="txPps"
            min-width="100"
          />
          <el-table-column
            label="状态"
            prop="status"
            min-width="100"
          />
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import consoleData from '@/mixins/consoleDataAds'

export default createDialog({
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'admin/clusterStatus/card',
      title: '',
      bindParams: {
        ip: ''
      }
    }
  },

  methods: {
    beforeOpen(form) {
      this.title = form.ip
      this.bindParams.ip = form.ip

      this.fetchList()
    },

    formatResponse(response) {
      return {
        list: response
      }
    }
  }
})
</script>
