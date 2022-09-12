<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="关联策略"
    @submit="handleSubmit"
  >
    <el-form :model="form">
      <el-form-item
        label="选择策略"
        prop="group_id"
      >
        <yd-form-select
          :selects="selectStrategy"
          v-model="form.strategy_ids"
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
        belong_type: 'group',
        belong_ids: []
      },
      selectStrategy: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.fetchList()
    },

    async fetchList() {
      const data = await this.Fetch.get('V4/permission.get.strategyList', { per_page: 999 })
      this.selectStrategy = data.list.map(_ => {
        return {
          label: _.strategy_name,
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
