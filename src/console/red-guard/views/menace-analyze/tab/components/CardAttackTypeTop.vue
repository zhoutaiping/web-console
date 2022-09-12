<template>
  <DmCard
    :loading="loading"
    title="TOP10 攻击类型"
  >
    <ChartPie
      :data="data"
      :options="options"
      :extend="extend"
      :loading="false"
      :height="330"
      style="margin-top: -30px"
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'CardAttackLine',

  data() {
    return {
      loading: true,
      data: {
        columns: [],
        row: []
      },
      options: {
        baseUnit: '次',
        radius: 80
      },
      extend: {
        legend: {
          show: false
        }
      }
    }
  },

  methods: {
    async startLoading() {
      this.loading = true
    },

    async setData(data) {
      const { top_waf_attack_name = [] } = data
      this.data = {
        columns: ['attack_name', 'count'],
        rows: top_waf_attack_name
      }
      this.loading = false
    }
  }
})
</script>
