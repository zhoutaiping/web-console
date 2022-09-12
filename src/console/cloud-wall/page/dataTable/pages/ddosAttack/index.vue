<template>
  <div>
    <ChartAttackLine ref="ChartAttackLine" />
    <!-- <TableDDoSAttack
      ref="TableDDoSAttack"
      class="margin-top"
    /> -->
  </div>
</template>

<script>
import ChartAttackLine from './components/ChartAttackLine'
import TableDDoSAttack from './components/TableDDoSAttack'
import cwReport from '../../../../mixins/cwReport'

export default {
  components: {
    ChartAttackLine,
    TableDDoSAttack
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
      this.$refs.ChartAttackLine.fetchData()
      // this.$refs.TableDDoSAttack.fetchInit(this.reportParams)
    }
  }
}
</script>
