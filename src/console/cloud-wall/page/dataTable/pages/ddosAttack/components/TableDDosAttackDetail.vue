<template>
  <DmCard>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
        >
          <el-table-column
            label="攻击IP"
            prop="ipView"
            min-width="180"
          />
          <el-table-column
            label="攻击峰值（Mbps）"
            prop="trafficin_0"
            min-width="180"
          />
          <el-table-column
            label="攻击时间"
            prop="timestamp"
            min-width="180"
          />
        </el-table>
      </DmTable>
    </DmData>
  </DmCard>
</template>

<script>
import consoleData from '@/mixins/consoleData'

export default {
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/statistic.tjkd.plus.ddos.detailList',
      bindParams: {}
    }
  },

  methods: {
    formatResponse(response) {
      response.list = response.other_data.ip_list
      response.list.forEach(item => {
        item.ipView = `${item.ip}（${item.ip_location}）`
      })
      response.total = response.other_data.ip_count
      return response
    }
  }
}
</script>
