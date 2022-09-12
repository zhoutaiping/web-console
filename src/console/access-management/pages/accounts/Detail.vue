<template>
  <console-page-layout>
    <DmCard title="基本信息">
      <el-row>
        <el-col :span="6">
          子账号名称：{{ userData.user_name }}
        </el-col>
        <el-col :span="6">
          密码：
          <ItemPwd :value="userData.remark" />
        </el-col>
        <el-col :span="6">
          状态：
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="userData.status"
            @change="handleUpdateStatus"
          />
        </el-col>
        <el-col :span="6">
          备注：{{ userData.remark || '-' }}
        </el-col>
      </el-row>
      <el-row class="margin-top">
        <el-col :span="6">
          手机号：{{ userData.mobile || '-' }}
        </el-col>
        <el-col :span="6">
          邮箱：{{ userData.email || '-' }}
        </el-col>
        <el-col :span="6">
          创建时间：{{ userData.created_at || '-' }}
        </el-col>
        <el-col :span="6">
          最近登录时间：{{ userData.last_login || '-' }}
        </el-col>
      </el-row>
    </DmCard>
    <DmCard
      title="策略管理"
      class="margin-top"
    >
      <TablePrivileges @action-group="$refs.TableGroups.handleJoinGroup()" />
    </DmCard>
    <DmCard
      title="分组管理"
      class="margin-top"
    >
      <TableGroups ref="TableGroups" />
    </DmCard>
    <!--  -->
  </console-page-layout>
</template>

<script>
import ItemPwd from '@/components/Item/ItemPwd'
import TablePrivileges from './components/TablePrivileges'
import TableGroups from './components/TableGroups'

export default {
  components: { ItemPwd, TablePrivileges, TableGroups },

  data() {
    return {
      userData: {},
      id: this.$route.params.id
    }
  },

  provide() {
    return {
      userId: this.id
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async handleUpdateStatus(status) {
      await this.Fetch.put('sso/V4/subuser/switchStatus', { id: this.id, status })
      this.Message('ACTION_SUCCESS')
      this.fetchData()
    },

    async fetchData() {
      const res = await this.Fetch.get('V4/permission.child.info', {
        subuserid: this.id
      })
      res.status = Number(res.status)
      this.userData = res
    }
  }
}
</script>
