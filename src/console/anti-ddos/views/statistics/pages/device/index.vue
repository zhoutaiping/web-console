<template>
  <div>
    <DmToolbar>
      <yd-form-select
        :selects="adsSelectCluster"
        v-model="clusterName"
        default-text="全部集群"
        @change="handleChangeCluster"
      />
      <yd-form-select
        :selects="selectIP"
        v-model="bindParams.ip"
        filterable
        @change="fetchData"
      />
      <template slot="right">
        <yd-form-radio-button
          :radios="SelectTime"
          v-model="bindParams.timeType"
          @change="fetchData"
        />
      </template>
    </DmToolbar>
    <div
      v-loading="isEmpty"
      element-loading-text="无数据"
      element-loading-spinner="el-icon-remove-outline"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <TableSystem
        ref="TableSystem"
        class="margin-top"
      />
      <NetworkCard
        ref="NetworkCard"
        class="margin-top"
      />
    </div>
  </div>
</template>

<script>
import { arrToSelect } from '@/utils/format'
import TableSystem from './components/TableSystem'
import NetworkCard from './components/NetworkCard'
import adsMixins from '../../../../mixins/ads'

export default {
  components: { TableSystem, NetworkCard },

  mixins: [adsMixins],

  data() {
    return {
      SelectTime: [
        {
          label: '15分钟',
          value: '15m'
        },
        {
          label: '30分钟',
          value: '30m'
        },
        {
          label: '1小时',
          value: '1h'
        },
        {
          label: '3小时',
          value: '3h'
        },
        {
          label: '1天',
          value: '1d'
        }
      ],
      selectIP: [],
      selectIPMap: {},
      clusterName: '',
      isEmpty: false,
      bindParams: {
        timeType: '15m',
        ip: ''
      }
    }
  },

  created() {
    this.adsFetchClusterList()
    this.fetchClusterIP()
  },

  methods: {
    handleChangeCluster(name) {
      const selectIP = arrToSelect(this.selectIPMap[name || 'ipAll'])
      this.selectIP = selectIP
      if (selectIP.length) {
        this.bindParams.ip = selectIP[0].value
        this.fetchData()
      } else {
        this.bindParams.ip = ''
      }
    },

    async fetchClusterIP(clusterName) {
      const data = await this.$Ads.post('admin/clusterStatus/queryAllIp')
      const { ipAll = [] } = data
      if (!ipAll.length) {
        this.isEmpty = true
        return
      }
      this.selectIPMap = data
      this.handleChangeCluster()
    },

    fetchData() {
      const params = this.bindParams
      if (!params.ip) return
      this.$refs.TableSystem.init(params)
      this.$refs.NetworkCard.init(params)
    }
  }
}
</script>
