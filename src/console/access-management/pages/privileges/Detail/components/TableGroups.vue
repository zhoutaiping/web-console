<template>
  <div>
    <DialogGroup
      ref="DialogGroup"
      @init="fetchList"
    />
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleJoinGroup"
      >加入分组</el-button>
      <InputSearch
        slot="right"
        v-model="bindParams.group_name"
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
            label="分组名称"
            prop="group_name"
            min-width="150"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'access-management.router.groups__id',
                  params: {id :scope.row.group_id}
              }">
                {{ scope.row.group_name }}
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
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogGroup from './DialogGroup'

export default {
  components: { DialogGroup },

  mixins: [consoleData],

  data() {
    return {
      strategyId: this.$route.params.id,
      API_INDEX: 'V4/permission.strategy.groups',
      bindParams: {
        strategy_id: this.$route.params.id,
        group_name: ''
      }
    }
  },

  methods: {
    handleJoinGroup() {
      this.$refs.DialogGroup.handleOpen({
        belong_type: 'group',
        strategy_ids: [this.strategyId]
      })
    },

    async handleUnBind(row) {
      try {
        await this.Fetch.post('V4/permission.strategy.bind', {
          action: 'unbind',
          belong_type: 'group',
          strategy_ids: [this.strategyId],
          belong_ids: [row.group_id]
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
