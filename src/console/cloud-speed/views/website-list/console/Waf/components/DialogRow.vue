<template>
  <DmDialogForm
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="500px"
    title="新增规则集"
    label-width="120px"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-position="right"
      label-width="120px"
      style="margin-top: 16px"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          ref="InputName"
          v-model="form.name"
          placeholder="名称"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          style="width: 280px"
          placeholder="备注"
        />
      </el-form-item>
    </el-form>
  </DmDialogForm>
</template>

<script>
import createDialog from '@/utils/createDialog'
import wafMixins from '@/console/red-guard/mixins/waf'
import DmDialogForm from '@/components/Dm/DmDialogForm'

export default createDialog({
  components: { DmDialogForm },

  mixins: [wafMixins],

  data() {
    return {
      id: '',
      mode: 'Create',
      formDefault: {
        name: '',
        remark: '',
        from: 'diy'
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id
      this.$refs.InputName.focus()
    },

    async fetchSubmit() {
      const form = this.form
      form.domain_id = this.$route.params.id
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/firewall.policyGroup.save', form)
        } else {
          form.id = this.id
          await this.Fetch.post(`V4/firewall.policyGroup.save`, form)
        }
      } catch (e) {
        throw new Error()
      }
      this.Message('ACTION_SUCCESS')
    },

    async handleSubmit(form) {
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
