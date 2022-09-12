<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="700px"
    title="加入分组"
    @submit="handleSubmit"
  >
    <DmAlert>
      一个子账号仅可绑定至一个组织
    </DmAlert>
    <el-form :model="form">
      <el-form-item label="请选择组织">
        <el-cascader
          v-model="form.group_id"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'group_name',
            expandTrigger: 'hover'
          }"
          change-on-select
          style="width: 280px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({

  data() {
    return {
      formDefault: {
        group_id: ''
      },
      treeData: []
    }
  },

  methods: {
    beforeOpen(form) {
      if (form.group_list && form.group_list.length) {
        form.group_id = form.group_list[0].id
      }
    },

    initOptions(form, options) {
      this.fetchTree()
    },

    async fetchTree() {
      const { list = [] } = await this.Fetch.get('V4/permission.get.subUserGroupTree')
      this.treeData = list
    },

    async fetchSubmit() {
      const group_id = this.form.group_id

      const form = {
        ...this.form,
        action: 'bind',
        group_id: group_id.length ? group_id[group_id.length - 1] : 0
      }
      await this.Fetch.post('V4/permission.group.bind.user', form)
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
