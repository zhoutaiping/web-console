<template>
  <ConsolePageLayout>
    <el-row :gutter="12">
      <el-col :span="6">
        <CardUser :app-total="appTotal" />
      </el-col>
      <el-col :span="10">
        <CardApps :app-total="appTotal" />
      </el-col>
      <el-col :span="8">
        <CardConnector :app-total="appTotal" />
      </el-col>
    </el-row>
    <DmToolbar class="margin-top">
      <template slot="right">
        <DateSelection
          custom-secound
          @timevalue="handleDateChange"
        />
      </template>
    </DmToolbar>
    <el-row
      :gutter="12"
      class="margin-top"
    >
      <el-col :span="16">
        <CardActiveData
          ref="CardActiveData"
          style="height: 450px"
        />
      </el-col>
      <el-col :span="8">
        <CardLoginInfo :data="appLoginInfo" />
      </el-col>
    </el-row>
    <el-row
      :gutter="12"
      class="margin-top"
    >
      <el-col :span="16">
        <CardLocation
          ref="CardLocation"
          :loading="loadingDashboardData"
        />
      </el-col>
      <el-col :span="8">
        <CardTop10
          :loading="loadingDashboardData"
          :data="top10User"
          :table-height="540"
          style="height: 625px"
          title="用户成功登陆TOP10"
        />
      </el-col>
    </el-row>
    <el-row
      :gutter="12"
      class="margin-top"
    >
      <el-col :span="16">
        <CardLineActiveApp
          ref="CardLineActiveApp"
          :loading="loadingDashboardData"
          style="height: 450px"
        />
      </el-col>
      <el-col :span="8">
        <CardTop10
          :loading="loadingDashboardData"
          :data="top10App"
          title="应用访问TOP10:"
        />
      </el-col>
    </el-row>
    <DmCard
      :loading="loadingConnectorData"
      title="连接器"
      class="margin-top"
    >
      <el-row :gutter="12">
        <el-col :span="8">
          <CardPie
            ref="DeviceCity"
            title="连接器设备地理位置分布"
          />
        </el-col>
        <el-col :span="8">
          <CardPie
            ref="DeviceOS"
            title="连接器设备操作系统分布"
          />
        </el-col>
        <el-col :span="8">
          <CardTop10
            :data="top10Duration"
            title="最近一次在线时长TOP10"
          />
        </el-col>
      </el-row>
    </DmCard>
  </ConsolePageLayout>
</template>

<script>
import moment from 'moment'
import SelectDaterange from '@/components/Select/SelectDaterange'
import CardUser from './components/CardUser'
import CardApps from './components/CardApps'
import CardConnector from './components/CardConnector'
import CardLoginInfo from './components/CardLoginInfo'
import CardTop10 from './components/CardTop10'
import CardActiveData from './components/CardActiveData'
import CardLineActiveApp from './components/CardLineActiveApp'
import CardPie from './components/CardPie'
import CardLocation from './components/CardLocation'
import DateSelection from '@/components/DateSelect/DateSelection'

function formatDataM(data, dateformat = 'M月D日 H:mm') {
  const { legend: columns = [] } = data
  const rows = data.x_data.map((time, index) => {
    const row = {
      '时间': moment(time, 'YYYY-MM-DD HH:mm:ss').format(dateformat)
    }
    Object.keys(data).forEach(key => {
      const item = data[key]
      if (columns.includes(item.name)) {
        row[item.name] = item.value[index]
      }
    })

    return row
  })

  return {
    columns: ['时间', ...columns],
    rows
  }
}

export default {
  components: { DateSelection, SelectDaterange, CardUser, CardApps, CardConnector, CardLoginInfo, CardTop10, CardActiveData, CardLineActiveApp, CardPie, CardLocation },

  data() {
    return {
      params: {},
      appTotal: {
        distinct_user_identity: 0, // 今日活跃用户数
        distinct_app_id: 0, // 今日活跃应用数
        self_host_app_count: 0, // 自建应用
        protocol_app_count: 0, // 协议应用
        saas_app_count: 0, // saas应用
        connector_count: 0, // 连接器总数
        device_count: 0, // 设备总数
        device_online_count: 0, // 设备在线
        device_offline_count: 0, // 设备离线
        month_active_user: 0, // 本月活跃用户数
        month_active_app: 0 // 本月活跃应用数
      },
      appLoginInfo: {},
      top10App: [],
      top10User: [],
      top10Location: [],
      locationData: [],
      locationTotal: 0,
      top10Duration: [],
      loadingDashboardData: true,
      loadingConnectorData: true
    }
  },

  created() {
    this.fetchOverview()
    this.fetchLocationData()
    this.fetchDashboardData()
    this.fetchConnectorData()
  },

  methods: {
    // 日期选择切换
    handleDateChange(start_time, end_time, type) {
      this.params.start_time = start_time
      this.params.end_time = end_time
      this.fetchLocationData()
      this.fetchDashboardData()
      this.fetchConnectorData()
    },

    async fetchOverview() {
      const res = await this.Fetch.post('V4/zero.trust.dashboard.overview.data', this.params)
      this.appTotal = res
    },

    async fetchLocationData() {
      this.loadingDashboardData = true
      let res
      try {
        res = await this.Fetch.post('V4/zero.trust.dashboard.user.login.location.data', this.params)
      } finally {
        this.loadingDashboardData = false
      }
      this.$refs.CardLocation.setTotal(res.total_user)
      this.$refs.CardLocation.setTop(res.top_10_location)
      this.$refs.CardLocation.setData(res.location_data.map(_ => {
        return {
          name: _.name,
          value: _.value,
          percent: _.percent / 100
        }
      }))
    },

    async fetchDashboardData() {
      const res = await this.Fetch.post('V4/zero.trust.dashboard.data', this.params)

      this.appLoginInfo = res
      // 活跃数据分布
      this.$refs.CardActiveData.setData(formatDataM(res.month_active_data_line))
      // 活跃应用分布
      this.$refs.CardLineActiveApp.setData(formatDataM(res.month_active_app_line))
      // 活跃用户 TOP10
      this.top10App = res.top_10_app
      this.top10User = res.top_10_user
    },

    async fetchConnectorData() {
      this.loadingConnectorData = true
      let res
      try {
        res = await this.Fetch.post('V4/zero.trust.dashboard.connector.data', this.params)
      } finally {
        this.loadingConnectorData = false
      }
      this.$refs.DeviceCity.setData(res.device_city_data)
      this.$refs.DeviceOS.setData(res.device_os_data)

      this.top10App = res.top_10_app
      this.top10User = res.top_10_user
      this.top10Duration = res.device_online_duration
    }
  }
}
</script>
