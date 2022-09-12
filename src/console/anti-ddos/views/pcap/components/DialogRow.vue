<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="600px"
    title-label="任务"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :rules="formRules"
      :model="form"
      label-width="140px"
      label-position="right"
    >
      <el-form-item
        label="任务名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="名称"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="目标IP/端口">
        <el-input
          v-model="form.dstIp"
          placeholder="默认全部"
          style="width: 120px"
        /> :
        <el-input
          v-model="form.dstPort"
          placeholder="端口"
          style="width: 80px"
        />
      </el-form-item>
      <el-form-item label="源IP/端口">
        <el-input
          v-model="form.srcIp"
          placeholder="默认全部"
          style="width: 120px"
        /> :
        <el-input
          v-model="form.srcPort"
          placeholder="端口"
          style="width: 80px"
        />
      </el-form-item>
      <el-form-item label="抓包数量">
        <el-input-number
          v-model="form.sampleNum"
          :min="1"
          :max="100000"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="抓包集群">
        <yd-form-select
          :selects="adsSelectCluster"
          v-model="form.clusterId"
        />
      </el-form-item>
      <el-form-item label="抓包方向">
        <yd-form-radio
          v-model="form.stage"
          :radios="adsSelects.stage"
        />
      </el-form-item>
      <el-form-item label="抓包协议">
        <yd-form-radio
          v-model="form.protocol"
          :radios="adsSelects.protocol"
        />
      </el-form-item>
      <el-form-item label="采样比">
        <yd-form-radio
          v-model="form.sampleRatio"
          :radios="adsSelects.sampleRatio"
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
      formDefault: {
        name: '',
        clusterId: '',
        sampleNum: 1000,
        sampleRatio: 1000,
        dstIp: '',
        dstPort: '',
        srcIp: '',
        srcPort: '',
        protocol: '',
        nohealth: false,
        stage: 'all'
      },
      formRules: {
        name: {
          required: true,
          message: '请填写名称'
        }
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.adsFetchClusterList()
      this.$refs.Form.clearValidate()
      this.mode = form.clusterId ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })
      try {
        await this.$Ads.post('admin/pcap/saveApi', this.form)
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
