<template>
  <div>
    <ChartTCPMap ref="ChartTCPMap" />
  </div>
</template>

<script>
import ChartTCPMap from './components/ChartTCPMap'
import cwReport from '../../../../mixins/cwReport'

export default {
  components: {
    ChartTCPMap
  },

  mixins: [cwReport],

  watch: {
    utime() {
      this.init()
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.$refs.ChartTCPMap.fetchData()
    }
  }
}
</script>
