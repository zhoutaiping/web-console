<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleJoin"
      >加入用户</el-button>
      <InputSearch
        slot="right"
        v-model="bindParams.user_name"
        @submit="handleSearch"
      />
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            label="用户名"
            prop="user_name"
            min-width="150"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'access-management.router.accounts__id',
                  params: {id: scope.row.sub_user_id}
              }">
                <el-button type="text">{{ scope.row.user_name }}</el-button>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remark"
            min-width="150"
          />
          <el-table-column
            label="创建时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="操作"
            prop="created_at"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRemove(scope.row)"
              >
                删除用户
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogUser
      ref="DialogUser"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogUser from './DialogUser'

export default {
  components: { DialogUser },

  mixins: [consoleData],

  data() {
    return {
      strategyId: this.$route.params.id,
      API_INDEX: 'V4/permission.strategy.users',
      bindParams: {
        strategy_id: this.$route.params.id,
        user_name: ''
      }
    }
  },

  methods: {
    handleJoin() {
      this.$refs.DialogUser.handleOpen({
        belong_type: 'user',
        strategy_ids: [this.strategyId]
      })
    },

    async handleRemove(row) {
      try {
        await this.Fetch.post('V4/permission.strategy.bind', {
          action: 'unbind',
          belong_type: 'user',
          strategy_ids: [this.strategyId],
          belong_ids: [row.sub_user_id]
        })
      } catch (e) {
        return
      }
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    }
  }
}
</script>
