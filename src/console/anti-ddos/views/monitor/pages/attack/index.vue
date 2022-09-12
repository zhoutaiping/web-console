<template>
  <div>
    <DmToolbar>
      <SelectAutoRefresh slot="right" @update="fetchData" />
    </DmToolbar>
    <TableAttackIP ref="TableAttackIP" />
    <ChartFlow
      ref="ChartFlow"
      class="margin-top"
    />
  </div>
</template>

<script>
import SelectAutoRefresh from '@/components/Select/SelectAutoRefresh'
import TableAttackIP from './components/TableAttackIP'
import ChartFlow from './components/ChartFlow'

export default {
  components: { SelectAutoRefresh, TableAttackIP, ChartFlow },

  methods: {
    fetchData() {
      this.$refs.TableAttackIP && this.$refs.TableAttackIP.fetchList()
      this.$refs.ChartFlow && this.$refs.ChartFlow.fetchData()
    }
  }
}
</script>
