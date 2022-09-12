<template>
  <DmCard
    :loading="loading"
    title="攻击类型"
  >
    <ChartPie
      :data="data"
      :options="options"
      :extend="extend"
      :height="330"
      :loading="false"
      :data-empty="!loading && !data.rows.length"
      style="margin-top: -30px"
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
        row: []
      },
      options: {
        radius: 100
      },
      extend: {
        legend: {
          show: false
        }
      }
    }
  },

  methods: {
    async init(params) {
      this.loading = true
      const data = await this.$Ads.post('admin/analyzeAttack/ackTypePercentage', params)
      delete data._status
      this.data = {
        columns: ['item', 'percent'],
        rows: data
      }
      this.loading = false
    }
  }
})
</script>
