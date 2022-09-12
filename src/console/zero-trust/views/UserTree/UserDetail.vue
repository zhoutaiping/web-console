<template>
  <div>
    <DmCard title="基本信息">
      <el-row>
        <el-col :span="8">
          账号名称：{{ userData.name }}
        </el-col>
        <el-col :span="8">
          手机号：{{ userData.mobile || '-' }}
        </el-col>
        <el-col :span="8">
          邮箱：{{ userData.email || '-' }}
        </el-col>
      </el-row>
      <el-row class="margin-top">
        <el-col :span="8">
          ID：{{ userData.id || '-' }}
        </el-col>
        <el-col :span="8">
          备注：{{ userData.remarks || '-' }}
        </el-col>
      </el-row>
    </DmCard>

    <DmCard
      title="分组信息"
      class="margin-top"
    >
      <div
        v-for="(item, index) in userData.groupList"
        :key="index"
      >{{ item.path }}</div>
    </DmCard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {}
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const { userId, realmId } = this.$route.params
      const res = await this.Fetch.get('V4/zero.trust.yunad.user.info', {
        userId,
        realmId
      })

      this.userData = res
      // console.log(res)
    },

    handleUpdateStatus() { }
  }
}
</script>

