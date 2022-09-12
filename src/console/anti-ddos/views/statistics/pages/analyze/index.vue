<template>
  <div>
    <DmToolbar>
      <yd-form-select
        :selects="adsSelectDefense"
        v-model="defenseId"
        default-text="全部"
        @change="fetchSelectIP"
      />
      <yd-form-select
        :selects="selectIP"
        v-model="bindParams.dstIp"
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
      <Trend
        ref="Trend"
        class="margin-top"
      />
    </div>
  </div>
</template>

<script>
import { arrToSelect } from '@/utils/format'
import Trend from './components/Trend'
import adsMixins from '../../../../mixins/ads'

export default {
  components: { Trend },

  mixins: [adsMixins],

  data() {
    return {
      isEmpty: false,
      defenseId: '',
      selectIP: [],
      selectIPMap: {},
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
      bindParams: {
        timeType: '15m',
        dstIp: ''
      }
    }
  },

  mounted() {
    this.adsFetchDefenseList()
    this.fetchSelectIP()
  },

  methods: {
    async fetchSelectIP(uuid) {
      this.bindParams.dstIp = ''
      const list = await this.$Ads.get('admin/defense/getAllDefense', { ipList: true, uuid })
      delete list._status
      const selectIP = arrToSelect(list)

      this.selectIP = selectIP
      if (selectIP.length) {
        this.bindParams.dstIp = selectIP[0].value
        this.fetchData()
      } else {
        this.bindParams.dstIp = ''
      }
    },

    fetchData() {
      const params = this.bindParams
      if (!params.dstIp) return
      this.$nextTick(() => {
        this.$refs.Trend && this.$refs.Trend.fetchData(params)
      })
    }
  }
}
</script>
