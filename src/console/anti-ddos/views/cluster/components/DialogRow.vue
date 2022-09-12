<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="集群"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-width="140px"
      label-position="right"
    >
      <el-form-item
        label="集群名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="集群名称"
          style="width: 240px"
          maxlength="64"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="note"
      >
        <el-input
          v-model="form.note"
          placeholder="备注"
          style="width: 240px"
          maxlength="64"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="是否启用"
        prop="title"
      >
        <el-switch v-model="form.status" />
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
        status: true,
        note: ''
      },
      formRules: {
        name: {
          required: true,
          message: '请填写名称',
          trigger: 'blur'
        }
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = form.uuid ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      try {
        await this.$Ads.post('admin/cluster/saveApi', this.form)
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
