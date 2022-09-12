<template>
  <DmCard
    :loading="loading"
    :title="title"
  >
    <ChartPie
      :data="data"
      :options="options"
      :extend="extend"
      :height="330"
      :loading="false"
      :data-empty="!loading && !data.rows.length"
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  props: {
    title: String
  },

  data() {
    return {
      loading: true,
      data: {},
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
    async setData(rows) {
      this.data = {
        columns: ['name', 'value'],
        rows
      }
      this.loading = false
    }
  }
})
</script>
