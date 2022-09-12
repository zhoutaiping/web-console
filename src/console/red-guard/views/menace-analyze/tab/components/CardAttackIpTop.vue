<template>
  <DmCard
    :loading="loading"
    title="TOP5 攻击IP"
  >
    <ChartBar
      :data="data"
      :options="options"
      :height="300"
      :extend="extend"
      loading
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'CardAttackIpTop',

  data() {
    return {
      loading: true,
      data: {
        columns: [],
        rows: []
      },
      options: {
        baseUnit: '次',
        grid: {
          top: 40,
          left: 100
        },
        labelMap: {
          ip: 'IP',
          count: '攻击次数'
        }
      },
      extend: {
        barWidth: 25,
        xAxis: {
          boundaryGap: true
        }
      }
    }
  },

  methods: {
    startLoading() {
      this.loading = true
    },

    async setData(data) {
      const { top_remote_addr = [] } = data
      this.data = {
        columns: ['ip', 'count'],
        rows: top_remote_addr
      }
      this.loading = false
    }
  }
})
</script>
