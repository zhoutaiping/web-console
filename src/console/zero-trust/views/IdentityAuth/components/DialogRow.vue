<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="用户组"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="120px"
    >
      <el-form-item
        label="分组名称"
        prop="group_name"
      >
        <el-input
          v-model="form.group_name"
          placeholder="分组名称"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          placeholder="备注"
          style="width: 250px"
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
        group_name: '',
        remark: ''
      },
      formRules: {
        group_name: {
          required: true,
          message: '请填写分组名称',
          trigger: 'blur'
        }
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = {
        ...this.form
      }
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/zero.trust.app.access.group.add', form)
        } else {
          await this.Fetch.post('V4/zero.trust.app.access.group.save', {
            group_id: form.id,
            ...form
          })
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
