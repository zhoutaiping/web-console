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
            label="监控项目"
            min-width="150"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
              <div>{{ scope.row.target }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="监控协议"
            prop="protocol"
            min-width="150"
          />
          <el-table-column
            label="故障发送时间"
            prop="down_time"
            min-width="150"
          />
          <el-table-column
            label="故障恢复时间"
            prop="up_time"
            min-width="150"
          />
          <el-table-column
            label="故障持续时间"
            prop="durationView"
            min-width="150"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import { formatSeconds } from '@/utils/filter'

export default {
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/cloud.monitor.event.list',
      bindParams: {
        target: this.$route.query.property_object
      }
    }
  },

  methods: {
    formatResponse(response) {
      response.list.forEach(item => {
        item.durationView = formatSeconds(item.duration)
      })
      return response
    }
  }
}
</script>
