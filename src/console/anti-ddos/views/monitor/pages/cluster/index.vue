<template>
  <div>
    <TableCluster />
    <TableDevice class="margin-top" />
  </div>
</template>

<script>
import TableCluster from './components/TableCluster'
import TableDevice from './components/TableDevice'

export default {
  components: { TableCluster, TableDevice }
}
</script>
