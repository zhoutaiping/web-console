<template>
  <DmDialog
    ref="Dialog"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    width="500px"
    title-label="QQ"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="80px"
    >
      <el-form-item
        prop="qq"
        label="QQ"
      >
        <el-input
          v-model="form.qq"
          placeholder="QQ"
          style="width: 250px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import qs from 'qs'

export default createDialog({
  data() {
    return {
      formDefault: {
        qq: ''
      },
      rules: {
        qq: [{
          require: true,
          trigger: 'blur'
        }]
      }
    }
  },

  methods: {
    initOptions(form) {
      this.mode = 'Edit'
    },

    async fetchSubmit() {
      const form = {
        qq: this.form.qq
      }
      await this.Fetch.post(`sso/V4/modifyQq`, qs.stringify(form))
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
