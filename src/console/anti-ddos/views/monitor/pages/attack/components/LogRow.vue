<template>
  <div>
    <DmDialog ref="Dialog" :title="title" :action-visible="false" width="900px">
      <DmTable :loading="loading" min-height>
        <el-table :data="infoArray">
          <el-table-column label="攻击类型" prop="type" />
          <el-table-column label="入流量(Mbps)" prop="total_bytes">
            <template slot-scope="scope">
              {{ scope.row.total_bytes && Number(scope.row.total_bytes) / 1000000 }}
            </template>
          </el-table-column>
          <el-table-column label="入流量(pps)" prop="total_packets" />
          <el-table-column label="转发流量(Mbps)" prop="forward_bytes">
            <template slot-scope="scope">
              {{ scope.row.total_bytes && Number(scope.row.forward_bytes) / 1000000 }}
            </template>
          </el-table-column>
          <el-table-column label="转发流量(pps)" prop="forward_packets" />
          <el-table-column label="丢弃流量(Mbps)" prop="drop_bytes">
            <template slot-scope="scope">
              {{ scope.row.total_bytes && Number(scope.row.drop_bytes) / 1000000 }}
            </template>
          </el-table-column>
          <el-table-column label="丢弃流量(pps)" prop="drop_packets" />
        </el-table>
      </DmTable>
    </DmDialog>
  </div>
</template>

<script>
import createDialog from '@/utils/createDialog'
export default createDialog({
  data() {
    return {
      loading: true,
      title: '攻击详情',
      formDefault: {
        dstIp: '',
        infoArray: []
      },
      infoArray: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.infoArray = []
      const { dstIp, infoArray } = form
      this.title = dstIp !== '' ? '【' + dstIp + '】' + '攻击详情' : '攻击详情'
      setTimeout(() => {
        this.infoArray = infoArray || []
        this.loading = false
      }, 500)
    }
  }
})
</script>
