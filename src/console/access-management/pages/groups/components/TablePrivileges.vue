<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleBind"
      >关联策略</el-button>
      <InputSearch
        slot="right"
        v-model="bindParams.strategy_name"
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
            label="策略名"
            min-width="150"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: scope.row.strategy_type === 'custom' ? 'access-management.router.privileges__custom__id' : 'access-management.router.privileges__system__id',
                  params: {id :scope.row.strategy_id}
              }">
                {{ scope.row.strategy_name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="关联时间"
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
                @click="handleUnBind(scope.row)"
              >
                解除关联
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogPrivilege
      ref="DialogPrivilege"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogPrivilege from './DialogPrivilege'

export default {
  components: { DialogPrivilege },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/permission.strategy.get_binds',
      groupId: this.$route.params.id,
      bindParams: {
        group_id: this.$route.params.id,
        belong_type: 'group',
        strategy_name: ''
      }
    }
  },

  methods: {
    handleBind() {
      this.$refs.DialogPrivilege.handleOpen({
        belong_ids: [this.groupId]
      })
    },

    async handleUnBind(row) {
      try {
        await this.Fetch.post('V4/permission.strategy.bind', {
          action: 'unbind',
          belong_type: 'group',
          belong_ids: [this.groupId],
          strategy_ids: [row.strategy_id]
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
