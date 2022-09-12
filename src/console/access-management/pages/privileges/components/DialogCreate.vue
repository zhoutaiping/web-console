<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="新增策略"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-position="right"
      label-width="120px"
    >
      <el-form-item
        label="策略名称"
        prop="strategy_name"
      >
        <el-input
          v-model="form.strategy_name"
          style="width: 180px"
          placeholder="策略名称"
        />
      </el-form-item>
      <el-form-item
        label="描述"
        prop="desc"
      >
        <el-input
          v-model="form.desc"
          style="width: 180px"
          placeholder="描述"
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
        strategy_name: '',
        desc: ''
      }
    }
  },

  methods: {
    async fetchSubmit() {
      const form = {
        ...this.form
      }
      try {
        await this.Fetch.post('V4/permission.add.strategy', form)
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
