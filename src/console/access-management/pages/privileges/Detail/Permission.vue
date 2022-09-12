<template>
  <div>
    <DmCard title="关联用户">
      <TableUsers />
    </DmCard>
    <DmCard
      title="关联分组"
      class="margin-top"
    >
      <TableGroups />
    </DmCard>
  </div>
</template>

<script>
import TableGroups from './components/TableGroups'
import TableUsers from './components/TableUsers'

export default {
  components: { TableGroups, TableUsers }
}
</script>
