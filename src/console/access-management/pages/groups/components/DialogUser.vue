<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="添加子账号"
    @submit="handleSubmit"
  >
    <el-form :model="form">
      <el-form-item label="子账号">
        <yd-form-select
          :selects="selectUser"
          v-model="form.sub_user_ids"
          multiple
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
        action: 'bind',
        sub_user_ids: [],
        group_id: []
      },
      selectUser: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.fetchList()
    },

    async fetchList() {
      const data = await this.Fetch.get('V4/permission.get.subUsersList.unbind_group', { per_page: 999 })
      this.selectUser = data.list.map(_ => {
        return {
          label: _.user_name,
          value: _.id
        }
      })
    },

    async fetchSubmit() {
      const form = {
        action: 'bind',
        ...this.form
      }
      try {
        await this.Fetch.post('V4/permission.group.bind.user', form)
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
