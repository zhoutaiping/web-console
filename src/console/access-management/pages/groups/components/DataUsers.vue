<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleJoin"
      >添加子账号</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        type="white"
      >
        <el-table :data="list">
          <el-table-column
            label="账号名称"
            min-width="150"
          >
            <template slot-scope="scope">
              <a @click="$refs.DialogCreate.handleOpen(scope.row)">{{ scope.row.user_name }}</a>
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
                删除
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
    <DialogCreate ref="DialogCreate" @init="fetchList"/>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogUser from './DialogUser'
import DialogCreate from '../../accounts/components/DialogCreate.vue'

export default {
  components: { DialogUser, DialogCreate },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/permission.group.users',
      bindParams: {
        group_id: ''
      }
    }
  },

  methods: {
    formatResponse(response) {
      response.list && response.list.forEach(item => {
        item.id = item.sub_user_id
      })
      return response
    },

    fetchData(params) {
      Object.assign(this.bindParams, params)
      this.fetchList()
    },

    handleJoin() {
      this.$refs.DialogUser.handleOpen({
        group_id: this.bindParams.group_id
      })
    },

    async handleRemove(row) {
      await this.Fetch.post('V4/permission.group.bind.user', {
        action: 'unbind',
        group_id: this.bindParams.group_id,
        sub_user_ids: [row.sub_user_id]
      })
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    }
  }
}
</script>
