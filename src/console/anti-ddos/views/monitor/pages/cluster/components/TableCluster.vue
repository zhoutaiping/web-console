<template>
  <DmCard title="清洗集群状态">
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            label="集群名称"
            prop="clusterName"
            min-width="150"
          />
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
            min-width="150"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === '2'"
                class="color--success"
              >正常</span>
              <span
                v-else-if="scope.row.status === '0'"
                class="color--warning"
              >异常</span>
              <span
                v-else-if="scope.row.status === '1'"
                class="color--warning"
              >局部异常</span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </DmCard>
</template>

<script>
import consoleData from '@/mixins/consoleDataAds'

export default {
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'admin/clusterStatus/queryCluster',
      bindParams: {}
    }
  },

  methods: {
    formatResponse(response) {
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
