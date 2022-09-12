<style lang="scss" scoped>
.group-box {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleCreate()"
      >创建子账号</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleJoinGroup({sub_user_ids: selectionId})"
      >加入组织</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleDelete(selectionId)"
      >删除</el-button>
      <div slot="right">
        <!-- <yd-form-select
          v-model="bindParams.status"
          :selects="STATUS"
          style="width: 150px"
          default-text="全部状态"
          @change="handleSearch"
        />
        <yd-form-select
          v-model="bindParams.group_id"
          :selects="[]"
          style="width: 150px"
          default-text="全部组织"
          @change="handleSearch"
        />
        <el-date-picker
          v-model="time"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator=" "
          style="width: 200px"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建时间"
          end-placeholder=""
          @change="e =>{
            bindParams.start_time = ''
            bindParams.end_time = ''
            if(e) {
              bindParams.start_time = e && e[0] && e[0] || ''
              bindParams.end_time = e && e[1] && e[1] || ''
            }
            $refs.DmData.initPage()
          }"
        /> -->
        <InputSearch
          v-model="bindParams.user_name"
          placeholder="根据名称查询"
          @submit="handleSearch"
        />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="账号名称"
            min-width="150"
          >
            <template slot-scope="scope">
              <a
                @click="handleRowEdit(scope.row)"
              >{{ scope.row.user_name }}</a>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="created_at"
            width="150"
          />
          <el-table-column
            label="最近登录"
            prop="updatd_at"
            width="150"
          />
          <el-table-column
            label="状态"
            prop="status"
            width="100"
          >
            <template slot-scope="scope">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.status"
                @change="val => handleUpdateStatus(val, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="所属组织"
            prop="updatd_at"
            min-width="250"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.group_list && scope.row.group_list.length">
                <span
                  v-for="(item, index) in scope.row.group_list"
                  :key="index"
                  style="margin-right: 5px;"
                >
                  {{ item.group_name }}
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remark"
            min-width="150"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="280"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowEdit(scope.row)"
              >管理</el-button>
              <el-divider direction="vertical" />
              <!-- <el-button
                type="text"
                @click="$refs.DialogPrivilege.handleOpen({belong_ids: [scope.row.id], belong_type: 'user'})"
              >关联策略</el-button>
              <el-divider direction="vertical" /> -->
              <el-button
                type="text"
                @click="handleJoinGroup({sub_user_ids: [scope.row.id],group_list:scope.row.group_list})"
              >加入组织</el-button>
              <el-divider direction="vertical" />
              <!-- <router-link :to="{
                  name: 'access-management.router.accounts__id',
                  params: {id: scope.row.id}
              }">
                <el-button type="text">管理</el-button>
              </router-link>
              <el-divider direction="vertical" /> -->
              <el-button
                type="text"
                @click="handleRowDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogCreate
      ref="DialogCreate"
      @init="fetchList"
    />
    <DialogGroup
      ref="DialogGroup"
      @init="fetchList"
    />
    <DialogPrivilege
      ref="DialogPrivilege"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ItemCopy from '@/components/Item/ItemCopy'
import DialogCreate from './components/DialogCreate'
import DialogGroup from './components/DialogGroup'
import DialogPrivilege from './components/DialogPrivilege'

export default {
  components: { ItemCopy, DialogCreate, DialogGroup, DialogPrivilege },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/permission.get.subUsersList',
      dateRange: [],
      bindParams: {
        user_name: '',
        start_time: '',
        end_time: '',
        status: null
      },
      time: '',
      selectionId: [],
      STATUS: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  },

  methods: {
    async handleCreate() {
      const data = await this.Fetch.get('sso/V4/isMemberCertificationPassed')
      if (!data.is_passed) {
        const h = this.$createElement
        this.$message({
          message: h('p', null, [
            h('span', null, '请先完成'),
            h('a', { attrs: { href: '/console/user-center/authentication' }}, '用户认证')
          ]),
          type: 'warning'
        })
        return
      }

      this.$refs.DialogCreate.handleOpen()
    },

    async handleUpdateStatus(status, row) {
      await this.Fetch.put('sso/V4/subuser/switchStatus', { id: row.id, status })
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    handleRowEdit(row) {
      this.$refs.DialogCreate.handleOpen(row)
    },

    async handleRowDelete(row) {
      this.handleDelete(row.id)
    },

    async handleDelete(id) {
      const params = {
        id: Array.isArray(id) ? id.join(',') : id
      }

      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.delete('V4/permission.del.subUser', params)
        } catch (e) {
          return
        }
        this.fetchList()
      })
    },

    async handleJoinGroup(form) {
      this.$refs.DialogGroup.handleOpen(form)
    },

    formatParams(params) {
      const [start_time, end_time] = this.dateRange || []
      return {
        ...params,
        start_time,
        end_time
      }
    },

    formatResponse(response) {
      response.list && response.list.forEach(item => {
        item.status = Number(item.status)
      })
      return response
    }
  }
}
</script>
