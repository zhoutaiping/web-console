<template>
  <DialogForm
    ref="Dialog"
    v-model="form"
    :rules="rules"
    :form-default="formDefault"
    title="删除URL"
    cancel-button-type="text"
    @submit="handleSubmit"
  >

    <el-form-item
      label="URL"
      prop="urls"
    >
      <el-input
        :rows="10"
        v-model="form.urls"
        type="textarea"
        placeholder="请输入URL地址，用回车分隔，最多可输入1000条"
      />
    </el-form-item>
  </DialogForm>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      rules: {
        urls: {
          required: true, message: '请输入URL地址'
        },
        remark: []
      },
      formDefault: {
        domain: '',
        url_list: [],
        snapshot_list: [],
        urls: ''
      },
      form: {}
    }
  },

  methods: {
    async handleSubmit() {
      const url_list = this.form.urls.split(/[\n\r]/g).filter(_ => _)
      if (url_list.length > 1000) {
        this.$message.warning('url最多1000条')
        throw new Error()
      }
      const form = {
        ...this.form
      }
      form.url_list = url_list
      delete form.urls
      try {
        await this.Fetch.post('V4/replaceMirror.mirror.delmirrorurl', form)
      } catch (e) {
        this.resetSubmitLoading()
        this.handleClose()
        return
      }
      this.Message('ACTION_SUCCESS')
      this.handleClose()
    }
  }
})
</script>
