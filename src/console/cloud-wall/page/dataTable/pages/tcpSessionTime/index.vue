<template>
  <div>
    <ChartTCPSessionTime ref="ChartTCPSessionTime" />
  </div>
</template>

<script>
import ChartTCPSessionTime from './components/ChartTCPSessionTime'
import cwReport from '../../../../mixins/cwReport'

export default {
  components: {
    ChartTCPSessionTime
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
      this.$refs.ChartTCPSessionTime.fetchData()
    }
  }
}
</script>
