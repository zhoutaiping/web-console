<template>
  <DmCard
    :loading="loading"
    title="实时流量"
  >
    <template slot="action">
      <yd-form-select
        :selects="selectUnit"
        v-model="bindParams.unit"
        style="width: 100px; margin-right: 12px"
        @change="handleChangeUnit"
      />
      <yd-form-select
        :selects="selectsType"
        v-model="bindParams.attackType"
        style="width: 150px; margin-right: 12px"
        @change="fetchData"
      />
      <yd-form-select
        :selects="adsSelectDefense"
        v-model="defenseId"
        default-text="全部"
        style="width: 150px; margin-right: 12px"
        @change="fetchSelectIP"
      />
      <yd-form-select
        :selects="selectIP"
        v-model="bindParams.dstIp"
        filterable
        @change="fetchData"
      />
    </template>
    <div id="chart" />
  </DmCard>
</template>

<script>
import { arrToSelect } from '@/utils/format'
import create from '@/utils/create-basic'
import { byteView } from '@/utils/filter'
import numeral from 'numeral'
import adsMixins from '../../../../../mixins/ads'

const selectsType = [
  {
    label: '全部类型',
    value: 'all'
  },
  {
    label: 'SYN',
    value: 'syn'
  },
  {
    label: 'SYN INVALID',
    value: 'syn_invalid'
  },
  {
    label: 'ACK',
    value: 'ack'
  },
  {
    label: 'SYN ACK',
    value: 'syn_ack'
  },
  {
    label: 'FIN RST',
    value: 'fin_rst'
  },
  {
    label: 'TCP CONNECT',
    value: 'tcp_connect'
  },
  {
    label: 'TCP INVALID',
    value: 'tcp_invalid'
  },
  {
    label: 'UDP',
    value: 'udp'
  },
  {
    label: 'ICMP',
    value: 'icmp'
  },
  {
    label: 'OTHER',
    value: 'other'
  },
  {
    label: 'TCP FRAGMENT',
    value: 'tcp_fragment'
  },
  {
    label: 'UDP FRAGMENT',
    value: 'udp_fragment'
  },
  {
    label: 'BW LIST',
    value: 'bw_list'
  },
  {
    label: 'SINGLE PACKET',
    value: 'single_packet'
  }
]

export default create({
  name: 'CardAttackIpTop',

  mixins: [adsMixins],

  data() {
    return {
      selectsType,
      defenseId: '',
      selectIP: [],
      bindParams: {
        attackType: 'all',
        unit: 'bps',
        dstIp: ''
      },
      selectUnit: [
        {
          label: 'bps',
          value: 'bps'
        },
        {
          label: 'pps',
          value: 'pps'
        }
      ],
      loading: true,
      data: {
        columns: [],
        rows: []
      },
      chart: {},
      extend: {
        connectNulls: true,
        tooltip: {
          trigger: 'item'
        }
      },
      options: {
        yAxisType: ['bits'],
        connectNulls: true,
        grid: {
          top: 40,
          left: 100
        }
      }
    }
  },

  mounted() {
    this.init()
    this.adsFetchDefenseList()
    this.fetchSelectIP()
  },

  methods: {
    init() {
      // eslint-disable-next-line no-undef
      var chart = new G2.Chart({
        container: 'chart',
        forceFit: true,
        padding: 'auto'
      })

      const defs = {
        'time': {
          type: 'time',
          nice: false,
          mask: 'YYYY-MM-DD HH:mm:ss',
          tickCount: 9
        }
      }
      chart.source(null, defs)
      chart.axis('time', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      })

      const unit = this.bindParams.unit

      chart.axis('packets', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          },
          formatter: function formatter(value) {
            if (unit === 'bps') {
              value = byteView(value)
            } else {
              value = numeral(value).format('0.0a')
            }
            return value
          }
        }
      })
      // 配置图表图例
      chart.legend({
        useHtml: true,
        position: 'top',
        reactive: true,
        legendStyle: {
          MARKER_CLASS: {
            width: '18px',
            height: '18px',
            lineHeight: '18px',
            borderRadius: '50px',
            marginRight: '4px',
            fontZize: '10px',
            float: 'left',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#ccc'
          }
        }
      })

      chart.line().position('time*packets').color('type').tooltip('type*packets', function(type, packets) {
        let value
        if (unit === 'bps') {
          value = byteView(packets)
        } else {
          value = numeral(packets).format('0.0a')
        }

        return {
          name: type,
          value
        }
      })
      chart.render()
      this.chart = chart
    },

    handleChangeUnit() {
      this.chart.destroy()
      this.init()
      this.fetchData()
    },

    async fetchSelectIP(uuid) {
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

    async fetchData() {
      this.loading = true
      const data = await this.$Ads.post('admin/realtimeAttack/dstIpAck', {
        unit: 'bps',
        attackType: 'all',
        scale: 1,
        ...this.bindParams
      })
      delete data._status
      this.chart.changeData(data)
      this.loading = false
    }
  }
})
</script>
