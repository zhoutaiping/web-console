<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="联系人"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item
        label="姓名"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="姓名"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="form.email"
          placeholder="邮箱"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="phone"
      >
        <el-input
          v-model="form.phone"
          placeholder="手机号"
          style="width: 200px"
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
        email: '',
        phone: ''
      },
      formRules: {
        name: {
          required: true,
          type: 'string',
          message: '请填写'
        },
        email: {
          required: true,
          type: 'string',
          message: '请填写'
        },
        phone: {
          required: true,
          type: 'string',
          message: '请填写'
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
        await this.$Ads.post('admin/receiver/saveApi', this.form)
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
