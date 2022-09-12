<template>
  <DmCard title="CC攻击事件">
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="sub_domain"
            label="受攻击对象"
            min-width="220"
          />
          <el-table-column
            prop="start_time"
            label="开始时间"
            min-width="150"
          />
          <el-table-column
            prop="end_time"
            label="结束时间"
            min-width="150"
          />
          <el-table-column
            prop="attack_cnt"
            label="攻击总次数"
            min-width="150"
          />
          <el-table-column
            label="事件分析"
            min-width="100"
            align="right"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'cloud-speed.router.menaceAnalyze__CCAttackEventDetail',
                  query: {
                    sub_domain: scope.row.sub_domain,
                    start_time: scope.row.start_time,
                    end_time: scope.row.end_time,
                    attack_cnt: scope.row.attack_cnt
                  }
              }">
                <a
                  type="text"
                  @click="handleDetail(scope.row)"
                >详情</a>
              </router-link>
            </template>
          </el-table-column>
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
      API_METHOD: 'post',
      API_INDEX: 'V4/stati.data.get',
      bindParams: {
        router: 'cc.attack.event.list'
      }
    }
  },

  methods: {
    formatResponse(response) {
      return response
      // const data = { 'status': { 'code': 200, 'message': 'SUCCESS', 'time_comsuming': '0' }, 'data': { 'total': 1, 'list': [{ 'start_time': '2021-11-24 11:50:00', 'end_time': '2021-11-24 14:15:00', 'sub_domain': 'jkxg.fseihapq.com', 'attack_cnt': 947147, 'ip_list': ['218.88.26.249', '124.160.214.120', '120.231.12.231', '112.97.180.47', '39.130.71.186', '39.144.99.210', '112.64.119.202', '61.165.37.15', '223.104.165.185', '223.104.65.95', '113.246.164.239', '113.200.205.95', '116.253.22.154', '117.136.81.253', '183.61.0.60', '223.104.67.40', '39.190.185.199', '1.81.196.25', '223.104.159.216', '36.19.105.2', '117.136.46.14', '223.104.15.219', '117.136.74.150', '110.157.79.58', '112.97.163.206', '223.104.5.172', '223.104.104.223', '14.150.16.156', '183.193.124.131', '112.17.245.110', '120.244.50.199', '113.83.193.188', '106.127.2.209', '1.28.193.122', '223.104.160.29', '112.17.247.110', '114.85.144.193', '183.198.206.229', '27.128.5.242', '36.5.239.98', '223.104.65.115', '223.104.10.252', '106.39.42.238', '218.92.173.114', '117.136.12.173', '27.149.122.12', '42.228.228.55', '218.26.55.49', '49.93.131.116', '27.43.168.13', '117.136.67.145', '223.104.25.224', '36.5.46.203', '223.104.212.152', '220.170.153.97', '117.136.30.105', '117.136.119.218', '183.197.47.217', '39.144.95.207', '117.136.66.69', '39.154.171.23', '223.104.163.89', '117.136.55.107', '112.243.224.11', '49.78.147.131', '112.20.210.159', '218.205.55.101', '111.179.60.242', '223.104.204.43', '175.10.238.65', '223.104.13.166', '112.115.228.59', '49.93.80.123', '124.117.79.86', '14.16.221.177', '211.90.236.217', '99.242.17.65', '123.151.172.137', '223.104.219.23', '183.225.147.185', '220.195.66.176', '49.70.185.183', '111.75.44.237', '223.104.26.157', '117.136.121.16', '223.104.112.237', '180.110.48.251', '113.143.192.246', '112.17.247.252', '124.160.216.241', '111.38.48.7', '222.244.78.162', '106.42.166.113', '221.192.179.109', '223.104.6.62', '113.107.164.69', '112.224.32.109', '121.25.228.250', '220.196.194.20', '221.2.244.66'] }] }}
      // return { list: data.data.list }
    }
  }
}
</script>
