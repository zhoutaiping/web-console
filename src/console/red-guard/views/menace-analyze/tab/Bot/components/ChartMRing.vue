<template>
  <div>
    <ChartPie
      :data="chartData"
      :height="420"
      :options="options"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      chartData: {},
      options: {
        baseUnit: '次'
      }
    }
  },

  methods: {
    setData(data) {
      this.chartData = data
    }
  }
}
</script>
