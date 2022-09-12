<template>
  <DmCard :title="title">
    <DmData
      ref="DmData"
      :show-pagination="false"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column label="攻击类型" prop="type" />
          <el-table-column label="入流量(Mbps)" prop="total_bytes">
            <template slot-scope="scope">
              {{ (Number(scope.row.total_bytes) / 1000000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="入流量(pps)" prop="total_packets" />
          <el-table-column label="转发流量(Mbps)" prop="forward_bytes">
            <template slot-scope="scope">
              {{ (Number(scope.row.forward_bytes) / 1000000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="转发流量(pps)" prop="forward_packets" />
          <el-table-column label="丢弃流量(Mbps)" prop="drop_bytes">
            <template slot-scope="scope">
              {{ (Number(scope.row.drop_bytes) / 1000000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="丢弃流量(pps)" prop="drop_packets" />
        </el-table>
      </DmTable>
    </DmData>
  </DmCard>
</template>

<script>
import consoleDataAds from '@/mixins/consoleDataAds'

export default {
  mixins: [consoleDataAds],

  data() {
    return {
      API_INDEX: 'admin/attackEvent/query',
      title: '攻击详情 [' + this.$route.query.dstIp + ']',
      bindParams: {
        uuid: this.$route.params.id
      }
    }
  },

  methods: {
    formatResponse(response) {
      const { list = [] } = response
      if (list.length) {
        return { list: list[0].infoArray }
      } else {
        return { list: [] }
      }
    }
  }
}
</script>
