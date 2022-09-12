<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="模板"
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
        label="模板名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="模板名称"
          style="width: 220px"
          maxlength="32"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          placeholder="描述"
          style="width: 220px"
          maxlength="32"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        v-if="false"
        label="默认模板"
        prop="title"
      >
        <el-switch v-model="form.isDefault" />
      </el-form-item>
      <el-form-item
        label="复制模板"
        prop="title"
      >
        <yd-form-select
          :selects="filterPrivate(adsSelectTemplate)"
          v-model="form.referTemplateId"
          style="width: 220px"
          default-text="复制模板"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import adsMixins from '../../../mixins/ads'

export default createDialog({
  mixins: [adsMixins],

  data() {
    return {
      selectTemplate: [],
      formDefault: {
        name: '',
        description: '',
        // isDefault: true,
        referTemplateId: ''
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
    filterPrivate(list) {
      return list.filter(_ => !_.label.includes('private') && _.value !== this.form.uuid)
    },

    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.adsFetchTemplateList()
      this.mode = form.uuid ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      try {
        await this.$Ads.post('admin/template/saveApi', this.form)
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
