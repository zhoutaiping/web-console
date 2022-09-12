<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="加入分组"
    @submit="handleSubmit"
  >
    <el-form :model="form">
      <el-form-item
        label="选择分组"
        prop="group_id"
      >
        <yd-form-select
          :selects="selectGroup"
          v-model="form.belong_ids"
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
        belong_type: 'group',
        belong_ids: [],
        strategy_ids: []
      },
      selectGroup: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.fetchGroupList()
    },

    async fetchGroupList() {
      const res = await this.Fetch.get('V4/permission.get.subUserGroupList', { per_page: 1000 })
      const { list = [] } = res
      this.selectGroup = list.map(_ => {
        return {
          label: _.group_name,
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
