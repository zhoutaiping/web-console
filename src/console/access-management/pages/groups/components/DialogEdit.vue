<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="850px"
    title-label="组织"
    @submit="handleSubmit"
  >
    <el-form label-width="100px">
      <el-form-item label="组织名称">
        <el-input
          v-model="form.group_name"
          placeholder="组织名称"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          placeholder="备注"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item label="组内账号">
        <el-button
          type="primary"
          @click="e=>{
            subUsersList()
            handleRowAdd()
          }"
        >加入用户</el-button>
        <DmTable
          :loading="loading"
          :add-button="false"
          @click-add-button="handleRowAdd"
        >
          <el-table :data="list">
            <el-table-column
              label="用户名"
              min-width="150"
              prop="user_name"
            >
              <template slot-scope="scope">
                <template v-if="scope.row.id === 'add'">
                  <ColumnForm
                    :ref="`sub_user_id-${scope.$index}`"
                    :rules="rowRules"
                    :model="scope.row"
                    prop="sub_user_id"
                  >
                    <el-select
                      v-model="scope.row.sub_user_id"
                      clearable
                    >
                      <el-option
                        v-for="item in selectUser"
                        :disabled="item.disabled"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </ColumnForm>
                </template>
                <template v-else>
                  {{ scope.row.user_name }}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              prop="created_at"
              min-width="150"
            />
            <el-table-column
              label="备注"
              prop="remark"
              min-width="150"
            />
            <el-table-column
              label="操作"
              prop="created_at"
              min-width="150"
            >
              <template slot-scope="scope">
                <template v-if="row.id === 'add'">
                  <el-button
                    type="text"
                    @click="handleRowDelete(scope.$index)"
                  >删除</el-button>
                </template>
                <template v-else>
                  <el-button
                    type="text"
                    @click="handleRemove(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-form-item>
    </el-form>
    <DialogUser
      ref="DialogUser"
      @init="fetchList"
    />

  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import accessMixins from '../../../mixins/access'
import consoleTable from '@/mixins/consoleTable'
import ColumnForm from '@/components/Column/ColumnForm'
export default createDialog({
  components: { ColumnForm },
  mixins: [consoleTable, accessMixins],

  data() {
    return {
      mode: '',
      id: '',
      list: [],
      formDefault: {
        group_name: '',
        remark: ''
      },
      row: {
        id: 'add',
        sub_user_id: '',
        group_id: this.id
      },
      rowKey: ['sub_user_id'],
      rowRules: { sub_user_id: [{ required: true, message: ' ' }] },
      selectUser: [],
      loading: true,
      form: {}
    }
  },

  methods: {
    initOptions(form) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id
      this.fetchList()
    },

    async fetchList() {
      const params = {
        group_id: this.id,
        page: 1,
        per_page: 999
      }
      this.loading = true
      try {
        const data = await this.Fetch.get('V4/permission.group.users', params)
        this.list = data.list || []
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 200)
      }
    },
    async subUsersList() {
      const data = await this.Fetch.get('V4/permission.get.subUsersList.unbind_group', { per_page: 999 })
      this.selectUser = data.list.map(_ => {
        return {
          label: _.user_name,
          value: _.id,
          disabled: this.list.findIndex(i => i.sub_user_id === _.id) > -1
        }
      })
    },
    handleJoin() {
      this.$refs.DialogUser.handleOpen({
        group_id: this.id
      })
    },
    async handleRemove(row) {
      try {
        await this.Fetch.post('V4/permission.group.bind.user', {
          action: 'unbind',
          group_id: this.id,
          sub_user_ids: [row.sub_user_id]
        })
      } catch (e) {
        return
      }
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    },
    async fetchSubmit() {
      await this.handleCheckList()
      const form = {
        ...this.form,
        id: this.id,
        sub_users: this.list.map(i => i.sub_user_id)
      }

      try {
        await this.Fetch.put('V4/permission.edit.subUserGroup', {
          ...form
        })
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
