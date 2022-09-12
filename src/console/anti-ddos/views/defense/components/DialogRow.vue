<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    :title="title"
    width="650px"
    title-label="防御域"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :rules="formRules"
      :model="form"
      label-width="140px"
      label-position="right"
    >
      <h3>基本信息</h3>
      <el-form-item
        label="域名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="域名称"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item
        label="IP地址"
        prop="ipList"
      >
        <el-input
          v-model="form.ipList"
          placeholder="0.0.0.0"
          type="textarea"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item
        label="描述"
        prop="description"
      >
        <el-input
          v-model="form.description"
          placeholder="描述"
          maxlength="32"
          show-word-limit
          style="width: 180px"
        />
      </el-form-item>
      <h3>清洗配置</h3>
     
      <el-form-item
        label="清洗设备集群"
        prop="agentClusterId"
      >
        <yd-form-select
          :selects="adsSelectCluster"
          :disabled="mode === 'Edit' || ((isChild || isChildren) && mode === 'Create')"
          v-model="form.agentClusterId"
        />
      </el-form-item>
      <el-form-item label="复制配置模板">
        <template v-if="isChild || isChildren">
          <!-- Template List + extendsParent -->
          <yd-form-select
            :selects="adsSelectTemplatePublicWithId(form.protectTemplateId)"
            v-model="form.protectTemplateId"
          />
        </template>
        <template v-else>
          <!-- Create: Template List, Edit: Template List + extendsParent -->
          <yd-form-select
            :selects="adsSelectTemplatePublic"
            v-model="form.protectTemplateId"
          />
        </template>
      </el-form-item>
      <h3>告警配置</h3>
      <el-form-item
        label="告警方式"
        prop="alarmType"
      >
        <yd-form-checkbox
          :checks="adsSelects.alarmType"
          v-model="form.alarmType"
        />
      </el-form-item>
      <el-form-item
        label="告警阈值"
        prop="alarmThreshold"
      >
      <span class="inlineBox">
        攻击宽带阈值 >=
      </span>
        <el-input-number
          v-model="alarmThreshold"
          :min="0"
          :max="10000"
          controls-position="right"
          label="描述文字"
        />
        <yd-form-select
          v-model="alarmThresholdUnit"
          :selects="selectAlarmThresholdUnit"
          style="width: 100px; margin-left: 10px"
        />
        <!-- <span
          class="color--text-regular"
          style="margin-left: 10px"
        >Mbps</span> -->
      </el-form-item>
      <el-form-item>
        <span class="inlineBox">
          <el-checkbox v-model="form.enableAlarmSecond">
          且连续超过阈值时长 >=
          </el-checkbox>
        </span>
        
        <el-input-number
          v-model="alarmSecond"
          :disabled="!form.enableAlarmSecond"
          :min="0"
          :max="alarmSecondUnit ==='second' ? 60 : 10000"
          controls-position="right"
          label="描述文字"
        />
        <yd-form-select
          v-model="alarmSecondUnit"
          :selects="selectalarmSecondUnit"
          :disabled="!form.enableAlarmSecond"
          style="width: 100px; margin-left: 10px"
        />
      </el-form-item>
       <el-form-item
        label="告警联系人"
        prop="alarmReceiver"
      >
        <yd-form-select
          :selects="adsSelectReceiver"
          v-model="form.alarmReceiver"
          multiple
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

  props: {
    isChild: Boolean
  },

  data() {
    return {
      isCreateChildren: false,
      isChildren: false,
      title: '',
      alarmThresholdUnit: 'mb',
      alarmThreshold: 200,
      alarmSecondStatus:false,
      alarmSecond: 30,
      alarmSecondUnit: 'second',
      formDefault: {
        name: '',
        ipList: '',
        enableAlarmSecond:false,
        alarmThreshold: 200,
        agentClusterId: '',
        protectTemplateId: ''
      },
      selectAlarmThresholdUnit: [
        {
          label: 'Mbps',
          value: 'mb'
        },
        {
          label: 'Gbps',
          value: 'gb'
        }
      ],
      selectalarmSecondUnit:[
        {label:'秒', value:'second'},
        {label:'分钟', value:'minute'}
      ],
      formRules: {
        name: {
          required: true,
          message: '请填写名称'
        },
        ipList: {
          required: true,
          message: '请填写IP'
        },
        agentClusterId: {
          required: true,
          message: '请选择'
        }
      },

      default_protectTemplateId: ''
    }
  },

  methods: {
    beforeOpen(form, options) {
      this.adsFetchReceiverList()
      this.adsFetchClusterList()
      this.adsFetchTemplateList()
      if (form.uuid) {
        form.alarmType = form.alarmType.split(',').filter(Boolean)
        form.alarmReceiver = form.alarmReceiver.split(',').filter(Boolean)
        this.default_protectTemplateId = form.protectTemplateId
        if (form.protectTemplateName === '') form.protectTemplateId = ''
      }

      if (form.alarmThreshold > 10000) {
        this.alarmThreshold = form.alarmThreshold / 1000
        this.alarmThresholdUnit = 'gb'
      } else {
        this.alarmThreshold = form.alarmThreshold || 200
        this.alarmThresholdUnit = 'mb'
      }

      // this.alarmSecondStatus = Number(form.alarmSecond) > 0
      if(form.alarmSecond > 60) {
        this.alarmSecond = form.alarmSecond / 60
        this.alarmSecondUnit = 'minute'
      }else {
        this.alarmSecond = form.alarmSecond || 30
        this.alarmSecondUnit = 'second'
      }

      if (options.isChild) {
        form.protectTemplateId = ''
      }
    },

    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.mode = form.uuid ? 'Edit' : 'Create'

      if (options.title && this.mode === 'Create') {
        this.title = `创建子域（${options.title}）`
        this.isCreateChildren = true
      } else {
        this.title = ''
        this.isCreateChildren = false
      }

      this.isChildren = !!options.title
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })
      const form = {
        ...this.form
      }
      form.protectTemplateId = form.protectTemplateId || this.default_protectTemplateId
      try {
        await this.$Ads.post('admin/defense/saveApi', {
          ...form,
          alarmThreshold: this.alarmThresholdUnit === 'mb' ? this.alarmThreshold : this.alarmThreshold * 1000,
          alarmSecond: this.alarmSecondUnit === 'second' ? this.alarmSecond : this.alarmSecond * 60,
          alarmType: form.alarmType ? form.alarmType.join(',') : '',
          alarmReceiver: form.alarmReceiver ? form.alarmReceiver.join(',') : ''
        })
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
<style lang="scss" scoped>
h3 {
  padding-left: 20px;
}
.inlineBox {
  display: inline-block;
  width: 180px;
}
</style>