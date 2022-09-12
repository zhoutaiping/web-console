<template>
  <div>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.dstIp"
        placeholder="IP地址"
        @submit="handleSearch"
      />
      <template slot="right">
        <SelectDateFilter
          slot="right"
          v-model="params"
          :disabled-date-value="365"
          type="today"
          @change="handleSearch"
        />
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList(getParms())"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="防护IP"
            prop="dstIp"
          />
          <el-table-column label="入流量(Mbps)">
            <template slot-scope="scope">
              {{ (Number(scope.row.totalBytes)/1000000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            label="入流量(pps)"
            prop="totalPackets"
          />
          <el-table-column
            label="丢弃流量(Mbps)"
            prop="synDropBytes"
          >
            <template slot-scope="scope">
              {{ (Number(scope.row.totalDropBytes)/1000000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            label="丢弃流量(pps)"
            prop="totalDropPackets"
          />
          <el-table-column
            label="TCP新建连接数"
            prop="tcpConnectPps"
          />
          <el-table-column
            label="TCP并发连接数"
            prop="tcpConnects"
          />
          <el-table-column
            label="攻击类型"
            prop="attackType"
          />
          <el-table-column
            label="开始时间"
            prop="startTime"
          />
          <el-table-column
            label="峰值时间"
            prop="time"
          />
          <el-table-column
            label="持续时间(s)"
            prop="durationTime"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'anti-ddos.router.monitorAttackLog__Detail',
                  params: {
                    id: scope.row.uuid
                  },
                  query: {
                    dstIp: scope.row.dstIp,
                    startTime: scope.row.startTime,
                    endTime: scope.row.endTime
                  }
              }">
                <el-button type="text">详情</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import moment from 'moment'
import consoleDataAds from '@/mixins/consoleDataAds'
import SelectDateFilter from '@/components/Select/SelectDateFilter'

export default {
  components: { SelectDateFilter },

  mixins: [consoleDataAds],

  data() {
    return {
      API_INDEX: 'admin/attackEvent/query',
      params: {
        start_time: '',
        end_time: ''
      },
      bindParams: {
        dstIp: '',
        startTime: '',
        endTime: ''
      }
    }
  },

  methods: {
    formatResponse(response) {
      response.list.forEach(item => {
        item.endTime = moment(item.startTime, 'YYYY-MM-DD HH:mm:ss').add(item.durationTime, 'second').format('YYYY-MM-DD HH:mm:ss')
      })
      return response
    },

    getParms() {
      return {
        startTime: this.params.start_time,
        endTime: this.params.end_time
      }
    },

    resetTiem() {
      this.params.start_time = ''
      this.params.end_time = ''
      this.handleSearch()
    }
  }
}
</script>
