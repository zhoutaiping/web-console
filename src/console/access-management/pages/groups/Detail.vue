<template>
  <console-page-layout>
    <DmCard title="基本信息">
      <el-row>
        <el-col :span="8">
          分组名称：{{ groupData.group_name }}
        </el-col>
        <el-col :span="8">
          备注：{{ groupData.remark }}
        </el-col>
        <el-col :span="8">
          创建时间：{{ groupData.created_at }}
        </el-col>
      </el-row>
    </DmCard>
    <DmCard
      title="策略管理"
      class="margin-top"
    >
      <TablePrivileges />
    </DmCard>
    <DmCard
      title="用户管理"
      class="margin-top"
    >
      <TableUsers />
    </DmCard>
  </console-page-layout>
</template>

<script>
import TablePrivileges from './components/TablePrivileges'
import TableUsers from './components/TableUsers'

export default {
  components: { TablePrivileges, TableUsers },

  data() {
    return {
      groupData: {},
      groupId: this.$route.params.id
    }
  },

  provide() {
    return {
      groupId: this.groupId
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const res = await this.Fetch.get('V4/permission.group.info', {
        group_id: this.groupId
      })
      this.groupData = res
    }
  }
}
</script>
