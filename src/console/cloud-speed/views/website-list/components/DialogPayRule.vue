<template>
  <DialogForm
    ref="Dialog"
    v-model="form"
    :rules="rules"
    :form-default="formDefault"
    :title="titleFirst ? '设置计费方式' : '变更计费方式'"
    cancel-button-type="text"
    @submit="handleSubmit"
  >
    <template slot="header">
      <yd-alert>
        <p>1. 性能优化计费方式仅支持按带宽计费或按流量计费</p>
        <p>2. 允许变更计费方式，变更计费方式后，次日生效</p>
        <p>3. 变更计费方式时，默认用户已同意<a href="/documents/#/?name=cdn_agreement_cose" target="_blank">《CDN套餐服务计费协议》</a></p>
      </yd-alert>
    </template>
    <el-form-item label="计费方式">
      <yd-form-radio-button
        v-model="form.accounting_rules"
        :radios="SELECT_RULES"
      />
    </el-form-item>
  </DialogForm>
</template>

<script>
import createDialog from '@/utils/createDialog'
import Lockr from 'lockr'

export default createDialog({
  props: {
    titleFirst: Boolean
  },
  data() {
    return {
      rules: {},
      formDefault: {
        plan_id: '',
        accounting_rules: 1
      },
      form: {},
      SELECT_RULES: [
        {
          label: '流量计费',
          value: 1
        },
        {
          label: '带宽峰值',
          value: 2
        }
      ]
    }
  },

  methods: {
    async handleSubmit() {
      const form = {
        ...this.form,
        member_id: Lockr.get('user_id')
      }
      try {
        await this.Fetch.post('V4/order.cdn.open', form)
      } catch (e) {
        this.resetSubmitLoading()
        return
      }
      this.Message('ACTION_SUCCESS')
      this.handleClose()
      this.$emit('submit')
    }
  }
})
</script>
