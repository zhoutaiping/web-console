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
        placeholder="分组名称"
        @submit="handleSearch"
      />
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable>
        <el-table :data="list">
          <el-table-column
            label="分组名称"
            min-width="150"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'access-management.router.groups__id',
                  params: {id :scope.row.id}
                }"
              >
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
      subuserId: this.$route.params.id,
      API_INDEX: 'V4/permission.get.subUserGroupList',
      bindParams: {
        subuser_id: this.$route.params.id
      }
    }
  },

  methods: {
    handleJoinGroup() {
      this.$refs.DialogGroup.handleOpen({
        group_ids: this.list.map(_ => _.id),
        sub_user_ids: [this.subuserId]
      })
    },

    async handleUnBind(row) {
      this.$confirm('是否确定将该用户移出用户组来解除此随组关联策略？移出用户组后该用户将无法获得该策略所描述的相关权限。', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('V4/permission.group.bind.user', {
            action: 'unbind',
            sub_user_ids: [this.subuserId],
            group_id: row.id
          })
        } catch (e) {
          return
        }
        this.fetchList()
        this.Message('ACTION_SUCCESS')
      })
    }
  }
}
</script>
