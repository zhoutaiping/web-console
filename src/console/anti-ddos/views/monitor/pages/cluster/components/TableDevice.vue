<template>
  <DmCard title="清洗设备状态">
    <DmToolbar>
      <yd-form-select
        :selects="adsSelectCluster"
        v-model="bindParams.clusterName"
        default-text="全部集群"
        @change="handleChangeCluster"
      />
      <yd-form-select
        :selects="selectIP"
        v-model="bindParams.deviceIp"
        default-text="全部IP"
        filterable
        @change="handleSearch"
      />
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            label="设备"
            prop="ip"
            min-width="150"
          />
          <el-table-column
            label="所属集群"
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
            label="CPU使用率"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnProgress v-model="scope.row.cpu" />
            </template>
          </el-table-column>
          <el-table-column
            label="内存使用率"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnProgress v-model="scope.row.memory" />
            </template>
          </el-table-column>
          <el-table-column
            label="网卡故障率"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnProgress v-model="scope.row.cardRate" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="80"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogNetworkCard.handleOpen(scope.row)"
              >查看网卡</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogNetworkCard ref="DialogNetworkCard" />
  </DmCard>
</template>

<script>
import consoleData from '@/mixins/consoleDataAds'
import { arrToSelect } from '@/utils/format'
import DialogNetworkCard from './DialogNetworkCard'
import ColumnProgress from './ColumnProgress'
import adsMixins from '../../../../../mixins/ads'

export default {
  components: { DialogNetworkCard, ColumnProgress },

  mixins: [consoleData, adsMixins],

  data() {
    return {
      API_INDEX: 'admin/clusterStatus/query',
      selectIP: [],
      selectIPMap: {},
      bindParams: {
        clusterName: '',
        deviceIp: ''
      }
    }
  },

  created() {
    this.adsFetchClusterList()
    this.fetchClusterIP()
  },

  methods: {
    async fetchClusterList() {
      const { list = [] } = await this.$Ads.post('admin/cluster/query', { page: 1, pagesize: 100 })

      this.selectCluster = list.map(_ => {
        return {
          label: _.name,
          value: _.name
        }
      })
    },

    handleChangeCluster(name) {
      this.bindParams.deviceIp = ''
      this.selectIP = arrToSelect(this.selectIPMap[name || 'ipAll'])
      this.handleSearch()
    },

    async fetchClusterIP(clusterName) {
      this.selectIPMap = await this.$Ads.post('admin/clusterStatus/queryAllIp')
      this.handleChangeCluster()
    },

    formatResponse(response) {
      return response
    }
  }
}
</script>
