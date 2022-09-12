<template>
  <div class="PageUserTree">
    <DmAlert>云目录功能为用户提供了企业内员工的组织架构、账号、分组的身份管理功能</DmAlert>
    <DmAlert>
      1. 右键选中企业组织架构子组织，针对该子组织进行相关管理操作<br>
      2. 支持对子组织内的用户进行相关管理操作
    </DmAlert>
    <el-container class="PageUserTree-wrap">
      <el-aside
        v-loading="loadingTree"
        class="PageUserTree-aside"
        width="300px"
      >
        <DmToolbar>
          <InputSearch
            v-model="treeParams.search"
            placeholder="支持模糊查询"
            style="width: 100%"
            @submit="fetchTree"
          />
        </DmToolbar>
        <el-tree
          ref="Tree"
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          style="background: rgba(0,0,0,0)"
          default-expand-all
          node-key="id"
          @node-click="handleNodeClick"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <div class="custom-tree-node-wrapper">
              <span class="custom-tree-node-label">
                {{ node.label }}
              </span>
              <span class="operate-btns">
                <DotDropdown
                  :data="data"
                  @create="handleCreateTree"
                  @edit="handleEditTree"
                  @delete="handleDeleteTree"
                  @export="handleExportTree"
                />
              </span>
            </div>
          </span>
        </el-tree>
      </el-aside>
      <el-main
        :span="16"
        class="PageUserTree-main"
        style="padding: 0; height: 100%"
      >
        <DmCard>
          <DmToolbar>
            <el-button
              type="primary"
              @click="$refs.DialogUser.handleOpen({groups:bindParams.groupId })"
            >新增用户</el-button>
            <router-link :to="{name: 'zero-trust.router.menus__userTree__import'}">
              <el-button
                type="primary"
              >批量导入组织架构</el-button>
            </router-link>
            <el-button
              :disabled="multipleActionDisable"
              @click="handleDelete"
            >删除</el-button>
            <template slot="right">
              <yd-form-select
                v-model="bindParams.enabled"
                :selects="selectEnable"
                default-text="全部状态"
                style="width: 120px"
                @change="handleSearch"
              />
              <InputSearch
                v-model="bindParams.search"
                placeholder="邮箱/姓名/手机号"
                @submit="handleSearch"
              />
            </template>
          </DmToolbar>
          <DmData
            ref="DmData"
            @init="fetchList"
          >
            <DmTable
              :loading="loading"
              type="white"
              min-height
            >
              <el-table
                :data="list"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  label="用户名称"
                  prop="name"
                  min-width="100"
                />
                <el-table-column
                  label="手机号"
                  prop="mobile"
                  min-width="100"
                />
                <el-table-column
                  label="邮箱"
                  prop="email"
                  min-width="100"
                />
                <el-table-column
                  label="是否启用"
                  align="left"
                  min-width="80"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enabled"
                      @change="op => handleUserRowStatusChange(op, scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="right"
                  min-width="180"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.confirmed === false">
                      <el-button
                        type="text"
                        @click="$refs.DialogConfirm.handleOpen(scope.row)"
                      >重发邀请</el-button>
                      <el-divider direction="vertical" />
                    </template>
                    <template v-else>
                      <el-button
                        type="text"
                        @click="$refs.DialogResetPassword.handleOpen(scope.row)"
                      >重置密码</el-button>
                      <el-divider direction="vertical" />
                    </template>
                    <el-button
                      type="text"
                      @click="handleUserRowEdit(scope.row)"
                    >编辑</el-button>
                    <!-- <el-divider direction="vertical" /><el-button
                        type="text"
                        @click="handleUserRowDetail(scope.row)"
                      >删除</el-button>
                      -->
                    <el-divider direction="vertical" />
                    <router-link
                      :to="{
                        name: 'zero-trust.router.menus__userDetail',
                        params: {
                          userId: scope.row.id,
                          realmId: scope.row.realmId
                        }
                    }">
                      <el-button type="text">详情</el-button>
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </DmData>
        </DmCard>
      </el-main>
    </el-container>
    <DialogTree
      ref="DialogTree"
      @init="fetchTree"
    />
    <DialogUser
      ref="DialogUser"
      @init="fetchList"
    />
    <DialogExport ref="DialogExport" />
    <DialogResetPassword ref="DialogResetPassword" />
    <DialogConfirm ref="DialogConfirm" />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogUser from './components/DialogUser'
import DialogTree from './components/DialogTree'
import DotDropdown from './components/DotDropdown'
import DialogExport from './components/DialogExport'
import DialogConfirm from './components/DialogConfirm'
import DialogResetPassword from './components/DialogResetPassword'

function formatTree(list) {
  return list.map(item => {
    item.label = item.name
    if (item.subGroups && item.subGroups.length) {
      item.children = formatTree(item.subGroups)
    }
    return item
  })
}

export default {
  components: { DialogUser, DialogTree, DotDropdown, DialogExport, DialogConfirm, DialogResetPassword },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.yunad.organization.user.list',
      API_METHOD: 'post',
      menuVisible: false,
      selectEnable: [
        {
          label: '已启用',
          value: true
        },
        {
          label: '未启用',
          value: false
        }
      ],
      treeData: [],
      defaultProps: [],
      selectType: [
        {
          label: '用户名称',
          value: 'group_name'
        }
        // {
        //   label: '手机号',
        //   value: 'domain'
        // },
        // {
        //   label: '邮箱',
        //   value: 'domain'
        // },
        // {
        //   label: '启用状态',
        //   value: 'domain'
        // }
      ],
      bindParams: {
        type: 'group_name',
        keyword: '',
        groupId: 'root',
        realmId: '',
        enabled: ''
        // enabled: true
      },
      treeParams: {
        search: ''
      },
      loadingTree: false,
      contextMenuTarget: null,
      contextMenuVisible: false
    }
  },

  created() {
    this.fetchTree()
  },

  methods: {
    handleCreateTree(data) {
      this.$refs.DialogTree.handleOpen({
        parentName: data.name,
        parentId: data.id
      })
    },

    handleEditTree(data) {
      this.$refs.DialogTree.handleOpen({
        parentId: data.parentId,
        id: data.id,
        name: data.name,
        realmId: data.realmId,
        description: data.description
      })
    },

    async handleUserRowStatusChange(op, row) {
      try {
        await this.Fetch.post('V4/zero.trust.yunad.user.batch', {
          operation: op ? 'on' : 'off',
          userIdList: [row.id]
        })
      } catch (e) {
        return
      } finally {
        this.fetchList()
      }
      this.Message('ACTION_SUCCESS')
    },

    handleExportTree(data) {
      this.$refs.DialogExport.handleOpen(data)

    // const res = await this.Fetch.post('V4/zero.trust.yunad.organization.del', {
    //             groupId: data.id,
    //             realmId: data.realmId
    //           })
    },

    handleDeleteTree(data) {
      this.$confirm('是否确认删除该子组织，删除后将无法恢复', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.post('V4/zero.trust.yunad.organization.del', {
            groupId: data.id,
            realmId: data.realmId
          })
        } finally {
          this.fetchTree()
        }
      })
    },

    handleUserRowEdit(row) {
      this.$refs.DialogUser.handleOpen(row)
    },

    async fetchTree() {
      this.loadingTree = true
      const data = await this.Fetch.post('V4/zero.trust.yunad.organization.all', this.treeParams)
      // if (list.length) {
      //   const item = list[0]
      //   this.fetchGroupData(item.id)
      // }
      delete data._status
      if (!data || !data.length) {
        this.treeData = [
          {
            label: '我的组织',
            id: 'root'
          }
        ]
      } else {
        this.treeData = formatTree(data)
      }
      this.loadingTree = false
    },

    handleNodeClick(data) {
      if (this.bindParams.groupId === data.id) return
      this.bindParams.groupId = data.id
      // this.bindParams.realmId = data.realmId
      this.handleSearch()
    },

    handleDelete() {
      this.$confirm('确认操作？', '提示', {
        type: 'warning'
      }).then(() => {
        this.fetchDeleteUser()
      })
    },

    async fetchDeleteUser() {
      try {
        await this.Fetch.post('V4/zero.trust.yunad.user.batch', {
          operation: 'del',
          userIdList: this.multipleSelection.map(_ => _.id)
        })
      } finally {
        this.fetchList()
      }
    },

    formatParams(params) {
      const { type, keyword } = params
      return {
        ...params,
        [type]: keyword
      }
    },

    formatResponse(response) {
      const { params = {}, data = [] } = response
      return {
        list: data,
        total: params.totalCount
      }
    },

    async handleRowDelete(row) {
      const { id: group_id } = row
      try {
        await this.Fetch.post('V4/cloud.dns.domain.group.del', { group_id })
      } catch (e) {
        return
      }
      this.fetchList()
    }
  }
}
</script>

<style lang="scss">
.PageUserTree-wrap {
  background-color: #fafafa;
}

.PageUserTree {
  &-aside {
    padding: 16px;
  }

  .el-tree-node.is-expanded.is-current.is-focusable {
    .el-tree-node__content {
      background: $--background-color-base !important;

      &:active,
      &:hover {
        background: $--background-color-base !important;
      }
    }
  }
}

.el-tree-node__content {
  position: relative;
  .operate-btns {
    position: absolute;
    right: 2px;
    display: none;
  }
  // 鼠标悬停时，展示
  &:hover,
  :focus-within {
    .operate-btns {
      display: inline;
    }
  }
}
</style>
