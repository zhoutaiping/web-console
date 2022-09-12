<template>
  <DialogForm
    ref="Dialog"
    v-model="form"
    :rules="rules"
    :form-default="formDefault"
    title="更新网站快照"
    cancel-button-type="text"
    @submit="handleSubmit"
  >
    <el-form-item label="指定URL更新">
      <yd-form-radio
        v-model="form.update_type"
        :radios="UPDATE_TYPE"
      />
    </el-form-item>
    <el-form-item
      v-if="form.update_type === 'appoint'"
      prop="urls"
    >
      <el-input
        :rows="10"
        v-model="form.urls"
        type="textarea"
        placeholder="请输入指定URL，格式如http(s)://www.demo.com"
      />
    </el-form-item>
  </DialogForm>
</template>

<script>
import createDialog from '@/utils/createDialog'

const UPDATE_TYPE = [
  {
    label: '全站更新',
    value: 'global'
  },
  {
    label: '指定URL更新',
    value: 'appoint'
  }
]

export default createDialog({
  data() {
    return {
      rules: {},
      formDefault: {
        domain: '',
        id: '',
        update_type: 'appoint',
        urls: ''
      },
      form: {},
      UPDATE_TYPE
    }
  },

  methods: {
    async handleSubmit() {
      const form = {
        ...this.form
      }

      form.domain = `http://${form.domain}`
      form.urls = form.urls.split(/[\n\r]/g).filter(_ => _)
      try {
        await this.Fetch.post('V4/replaceMirror.mirror.refresh', form)
      } catch (e) {
        this.resetSubmitLoading()
        return
      }
      this.Message('ACTION_SUCCESS')
      this.handleClose()
    }
  }
})
</script>
