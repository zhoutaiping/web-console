<template>
  <div>
    <ChartTCPSession ref="ChartTCPSession" />
  </div>
</template>

<script>
import ChartTCPSession from './components/ChartTCPSession'
import cwReport from '../../../../mixins/cwReport'

export default {
  components: {
    ChartTCPSession
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
      this.$refs.ChartTCPSession.fetchData()
    }
  }
}
</script>
