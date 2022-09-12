<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="添加用户"
    @submit="handleSubmit"
  >
    <el-form :model="form">
      <el-form-item label="选择用户">
        <yd-form-select
          :selects="selectUser"
          v-model="form.belong_ids"
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
        belong_type: 'user',
        belong_ids: [],
        strategy_ids: []
      },
      selectUser: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.fetchList()
    },

    async fetchList() {
      const data = await this.Fetch.get('V4/permission.get.subUsersList', { per_page: 999 })
      this.selectUser = data.list.map(_ => {
        return {
          label: _.user_name,
          value: _.id
        }
      })
    },

    async fetchSubmit() {
      const form = {
        ...this.form
      }
      try {
        await this.Fetch.post('V4/permission.strategy.bind', form)
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
