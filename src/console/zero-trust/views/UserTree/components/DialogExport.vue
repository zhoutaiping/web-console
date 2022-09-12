<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="550px"
    title="导出"
    submit-text="导出"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      label-position="top"
      label-width="100px"
    >
      <el-form-item
        prop="groups"
        label="请勾选需要"
      >
        <el-tree
          v-loading="loadingTree"
          ref="Tree"
          :data="treeData"
          :expand-on-click-node="false"
          :default-checked-keys="defaultChecked"
          style="background: rgba(0,0,0,0)"
          default-expand-all
          show-checkbox
          node-key="id"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <div class="custom-tree-node-wrapper">
              <span class="custom-tree-node-label">
                {{ node.label }}
              </span>
            </div>
          </span>
        </el-tree>
      </el-form-item>
      <el-form-item prop="withUser">
        <el-checkbox v-model="form.withUser">
          同时导出组织架构下的员工
        </el-checkbox>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { downloadFile } from '@/utils/export'

function formatTree(list) {
  return list.map(item => {
    item.label = item.name
    if (item.subGroups && item.subGroups.length) {
      item.children = formatTree(item.subGroups)
    }
    return item
  })
}

export default createDialog({
  data() {
    return {
      id: '',
      loadingTree: true,
      defaultChecked: [],
      treeData: [],
      formDefault: {
        groups: [],
        withUser: false
      }
    }
  },

  methods: {
    async initOptions(form) {
      this.defaultChecked = [form.id]
      this.fetchTree()
    },

    async fetchTree() {
      this.loadingTree = true
      const data = await this.Fetch.post('V4/zero.trust.yunad.organization.all', this.treeParams)
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

    async fetchSubmit() {
      const groups = this.$refs.Tree.getCheckedKeys()

      const form = {
        ...this.form,
        groups
      }

      const data = await this.Fetch.post('V4/zero.trust.yunad.user.export', form)
      const { key } = data
      downloadFile(key)
    },

    async handleSubmit(form) {
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
