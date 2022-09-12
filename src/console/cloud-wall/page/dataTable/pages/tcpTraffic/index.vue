<template>
  <div>
    <ChartTCPFlow ref="ChartTCPFlow" />
    <ChartTCPWidth
      ref="ChartTCPWidth"
      class="margin-top"
    />
  </div>
</template>

<script>
import ChartTCPFlow from './components/ChartTCPFlow'
import ChartTCPWidth from './components/ChartTCPWidth'
import cwReport from '../../../../mixins/cwReport'

export default {
  components: {
    ChartTCPFlow,
    ChartTCPWidth
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
      this.$refs.ChartTCPFlow.fetchData()
      this.$refs.ChartTCPWidth.fetchData()
    }
  }
}
</script>
