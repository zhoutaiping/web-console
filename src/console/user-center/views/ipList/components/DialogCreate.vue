<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="IP列表"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 200px"
          placeholder="名称"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          style="width: 200px"
          placeholder="备注"
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
        name: '',
        remark: ''
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/user.ip.add', this.form)
        } else {
          await this.Fetch.put('V4/user.ip.save', this.form)
        }
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
