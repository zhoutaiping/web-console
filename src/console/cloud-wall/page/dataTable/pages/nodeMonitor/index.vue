<template>
  <div>
    <ChartDelay ref="ChartDelay"/>
    <ChartAvailability ref="ChartAvailability" class="margin-top"/>
  </div>
</template>

<script>
import ChartDelay from './components/ChartDelay'
import ChartAvailability from './components/ChartAvailability'
import cwReport from '../../../../mixins/cwReport'

export default {
  components: {
    ChartDelay,
    ChartAvailability
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
      this.$refs.ChartDelay.fetchData()
      this.$refs.ChartAvailability.fetchData()
    }
  }
}
</script>
