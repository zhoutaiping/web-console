<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="550px"
    title-label="连接器"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-position="left"
      label-width="140px"
    >
      <el-form-item
        label="连接器名称"
        prop="connector_name"
      >
        <el-input
          v-model="form.connector_name"
          placeholder="连接器名称"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item prop="location">
        <template slot="label">应用位置
          <TipsTooltip slot="label">
            选择离您的应用最近的位置可降低网络延迟提升业务稳定性
          </TipsTooltip>
        </template>
        <yd-form-radio-button
          :disabled="mode === 'Edit'"
          :radios="selectLocation"
          v-model="form.location"
          style="width: 280px"
          border
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">内部DNS地址
          <TipsTooltip slot="label">
            明确内部DNS服务器地址，以保障同网络内应用域名通过该DNS进行解析
          </TipsTooltip>
        </template>
        <InputMultiple
          v-model="form.dns"
          style="width: 280px"
          placeholder="支持IPv4和IPv6"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remarks"
      >
        <el-input
          v-model="form.remarks"
          style="width: 280px"
          type="textarea"
          placeholder="备注"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import { selectObjFormat } from '@/utils/form'
import InputMultiple from '@/components/Input/InputMultiple'

export default createDialog({
  components: { TipsTooltip, InputMultiple },

  data() {
    return {
      formDefault: {
        name: '',
        title: '',
        dns: []
      },
      formRules: {
        connector_name: { required: true, message: '请输入' },
        location: { required: true, message: '请选择' }
      },
      selectLocation: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.mode = form.connector_id ? 'Edit' : 'Create'
      this.fetchLocation()
    },

    async fetchLocation() {
      const data = await this.Fetch.get('V4/zero.trust.connector.location')
      delete data._status
      this.selectLocation = selectObjFormat(data)
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/zero.trust.connector.add', this.form)
        } else {
          await this.Fetch.post('V4/zero.trust.connector.save', this.form)
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
