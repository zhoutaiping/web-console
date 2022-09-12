<template>
  <DmCard :title="title">
    <div id="chart" />
  </DmCard>
</template>

<script>
import consoleDataAds from '@/mixins/consoleDataAds'
import { byteView } from '@/utils/filter'

export default {
  mixins: [consoleDataAds],

  data() {
    return {
      title: '流量趋势 [' + this.$route.query.dstIp + ']',
      bindParams: {
        dstIp: this.$route.query.dstIp,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        unit: 'bps'
      }
    }
  },

  mounted() {
    this.init()
    this.fetchData()
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

      chart.axis('packets', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          },
          formatter: function formatter(value) {
            return byteView(value)
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
        return {
          name: type,
          value: byteView(packets)
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
}
</script>
