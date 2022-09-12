<template>
  <console-page-layout>
    <DmAlert>
      云目录功能为客户提供了了企业内员工的组织架构、账号、分组的身份管理功能；<br>
      1. 右键选中企业组织架构子组织，针对该子组织进行相关管理操作；<br>
      2. 支持对子组织内的用户进行相关管理操作；
    </DmAlert>
    <el-container class="AccessGroup">
      <el-aside
        v-loading="loadingTree"
        class="AccessGroup-aside"
        width="300px"
      >
        <el-header>
          <el-button
            type="primary"
            @click="$refs.DialogCreate.handleOpen()"
          >创建组织</el-button>
        </el-header>
        <el-main class="tree">
          <el-tree
            ref="Tree"
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            default-expand-all
            draggable
            node-key="id"
            @node-drop="handleDrop"
            @node-click="handleNodeClick"
          />
        </el-main>
      </el-aside>
      <el-main :span="16">
        <DmToolbar>
          <!--  -->
        </DmToolbar>
        <DmTable
          :loading="loadingGroup"
          type="white"
        >
          <el-table
            ref="InfoTable"
            :data="[groupData]"
            style="width: 100%"
          >
            <el-table-column
              label="组织名称"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.group_name }}
              </template>
            </el-table-column>
            <el-table-column
              label="组织层级"
              min-width="80"
            >
              <template slot-scope="scope">
                {{ scope.row.pathDeep }}级组织
              </template>
            </el-table-column>
            <el-table-column
              label="子账号数量"
              min-width="90"
            >
              <template slot-scope="scope">
                {{ scope.row.users.length }}
              </template>
            </el-table-column>
            <el-table-column
              label="授权对象数量"
              prop="object_count"
              min-width="100"
            />
            <el-table-column
              label="备注"
              prop="remark"
              min-width="100"
            />
            <el-table-column
              label="创建时间"
              prop="created_at"
              min-width="160"
            />
            <el-table-column
              label="操作"
              align="right"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleRowEdit(scope.row)"
                >编辑</el-button>
                <el-divider direction="vertical" />
                <a
                  v-if="scope.row.isRoot"
                  disabled
                >权限配置</a>
                <router-link
                  v-else
                  :to="toSetting(scope.row)"
                >
                  权限配置
                </router-link>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="handleRowDelete([scope.row.id])"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-main>
    </el-container>
    <DialogCreate
      ref="DialogCreate"
      @init="fetchTree"
    />
  </console-page-layout>
</template>

<script>
import PopoverConfirm from '@/components/Popover/PopoverConfirm'
import ColumnListMore from '@/components/Column/ColumnListMore'
import DialogCreate from './components/DialogCreate'
import DialogEdit from './components/DialogEdit'
import DataUsers from './components/DataUsers'

function getSortsById(list, id) {
  for (const item of list) {
    if (item.id === id) {
      return list.map(_ => _.id)
    }
    if (item.children) {
      const ret = getSortsById(item.children, id)
      if (ret) return ret
    }
  }
  return null
}

export default {
  components: { DialogCreate, DialogEdit, DataUsers, PopoverConfirm, ColumnListMore },

  data() {
    return {
      loadingTree: true,
      toSetting: (row) => {
        return {
          name: 'access-management.router.setting__id',
          params: { id: row.id }
        }
      },
      toGroup: (row) => {
        return {
          name: 'access-management.router.groups__id',
          params: { id: row.id }
        }
      },
      defaultProps: {
        label: 'group_name'
      },
      bindParams: {
        group_name: ''
      },
      loadingGroup: true,
      treeData: [],
      groupData: {}
    }
  },

  created() {
    this.fetchTree()
  },

  methods: {
    async handleDrop(draggingNode, dropNode, dropType, ev) {
      const data = draggingNode.data
      const sorts = getSortsById(this.treeData, data.id)

      const parentData = dropType === 'inner' ? dropNode.data : dropNode.parent.data
      try {
        await this.Fetch.put('V4/permission.edit.subUserGroupV1', {
          group_name: data.group_name,
          id: data.id,
          sorts,
          parent_group_id: parentData.id
        })
      } catch (e) {
        return
      } finally {
        this.fetchTree()
      }
    },

    handleNodeClick({ group_name, id: group_id }) {
      this.bindParams.group_name = group_name
      this.fetchGroupData(group_id)
    },

    async fetchGroupData(group_id) {
      this.loadingGroup = true
      await this.fetchGroupInfo({ group_id })

      this.$refs.DataUsers.fetchData({ group_id })
      this.loadingGroup = false
    },

    async fetchTree() {
      this.loadingTree = true
      const { list = [] } = await this.Fetch.get('V4/permission.get.subUserGroupTree')
      if (list.length) {
        const item = list[0]
        this.fetchGroupData(item.id)
      }
      this.treeData = list
      this.loadingTree = false
    },

    async fetchGroupInfo({ group_id }) {
      const res = await this.Fetch.get('V4/permission.group.info', { group_id, with_count_obj: 1 })

      const group_node_path = res.group_node_path
      this.groupData = {
        ...res,
        pathDeep: group_node_path.split(',').length,
        isRoot: Number(res.parent_group_id) === 0
      }

      this.$nextTick(() => {
        this.$refs.InfoTable.doLayout()
      })
    },

    handleRowEdit(row) {
      this.$refs.DialogCreate.handleOpen(row)
    },

    async handleDeleteTree() {
      const ids = this.$refs.Tree.getCheckedKeys()
      if (!ids.length) {
        this.$message.error('请选择需要删除的组织')
        return
      }
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        await this.handleDelete(ids)
        this.fetchTree()
      })
    },

    async handleDelete(id) {
      const params = {
        id: Array.isArray(id) ? id.join(',') : id
      }
      await this.Fetch.delete('V4/permission.del.subUserGroup', params)
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    handleRowDelete(ids) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(() => {
        this.handleDelete(ids)
      })
    }
  }
}
</script>

<style lang="scss">
.AccessGroup {
  background: #fff;

  &-aside {
    .el-header {
      padding: 16px;
    }

    .el-main {
    }

    .tree {
      overflow-y: hidden;
      overflow-x: scroll;
      // width: 80px;
    }
    .el-tree {
      min-width: 100%;
      display: inline-block !important;
    }
  }
}
</style>
