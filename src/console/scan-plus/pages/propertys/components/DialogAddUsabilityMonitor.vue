<template>
  <DialogStep
    ref="Dialog"
    :steps="steps"
    :active.sync="active"
    :mode="mode"
    :submit-loading="submitLoading"
    width="500px"
    title-label="服务可用性监测"
    close-on-click-modal
    @submit="handleSubmit"
    @next="handleNext"
  >
    <div style="margin-left: 50px;">
      <el-form
        v-show="active===1"
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="100px"
      >
        <el-form-item
          label="任务名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder="任务名称"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item :label="Number(form.property_type) === 0 ? '监控域名':'监控IP'">
          <el-input
            v-model="form.property_object"
            disabled
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item
          label="端口"
          prop="port"
        >
          <el-input
            v-model="form.port"
            placeholder="请输入端口"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="监控协议">
          <template v-if="Number(form.property_type) === 0">
            <yd-form-radio
              :radios="[
                { 'value': 'HTTP', 'label': 'HTTP' },
                { 'value': 'HTTPS', 'label': 'HTTPS' },
              ]"
              v-model="form.protocol"
              border
            />
          </template>
          <template v-else>
            <yd-form-radio
              :radios="[
                { 'value': 'HTTP', 'label': 'HTTP' },
                { 'value': 'HTTPS', 'label': 'HTTPS' },
                { 'value': 'TCP', 'label': 'TCP' }
              ]"
              v-model="form.protocol"
              border
            />
          </template>
        </el-form-item>
        <template v-if="form.protocol !== 'TCP'">
          <!-- <el-form-item  // 2022-3-17 https://jira.baishancloud.com/browse/STORY-1330
            v-if="Number(form.property_type) === 0"
            :label="Number(form.property_type) === 1 ? '站点':'域名'"
            :prop="Number(form.property_type) === 1 ? '':'domain'"
          >
            <el-input
              v-model="form.domain"
              placeholder="www.demo.com"
            />
          </el-form-item> -->
          <el-form-item
            label="监控路径"
            prop="path"
          >
            <el-input
              v-model="form.path"
              placeholder="/"
            />
          </el-form-item>
          <el-form-item label="监控方法">
            <yd-form-radio
              :radios="[
                { 'value': 'HEAD', 'label': 'HEAD' },
                { 'value': 'GET', 'label': 'GET' }
              ]"
              v-model="form.method"
              border
            />
          </el-form-item>
        </template>
        <el-form-item label="监控频率">
          <yd-form-radio-button
            :radios="[
              { 'value': 1, 'label': '1分钟' },
              { 'value': 3, 'label': '3分钟' },
              { 'value': 5, 'label': '5分钟' }
            ]"
            v-model="form.frequency"
          />
        </el-form-item>
        <el-form-item
          label="预期HTTP状态码"
          prop="expectStatusCode"
        >
          <el-input
            v-model="form.expectStatusCode"
            style="width: 180px"
            placeholder="如果监控结果状态码和预期不一致, 则判定监控失败"
          />
        </el-form-item>
      </el-form>
      <FormNotice
        v-show="active === 2"
        ref="FormNotice"
        :uuid="uuid"
        class="margin-top"
      />
    </div>
  </DialogStep>
</template>

<script>
import createDialog from '@/utils/createDialog'
import DialogStep from '@/components/Dialog/DialogStep'
import FormNotice from './FormNotice'

export default createDialog({
  name: 'DialogAddDnsMonitor',

  components: { DialogStep, FormNotice },

  data() {
    return {
      submitLoading: false,
      active: 1,
      mode: 'Create',
      steps: [
        {
          title: '监控配置',
          icon: 'el-icon-setting'
        },
        {
          title: '通知告警',
          icon: 'el-icon-bell'
        }
      ],
      formDefault: {
        property_ids: '',
        name: '',
        property_object: '',
        port: '',
        protocol: 'HTTP',
        domain: '',
        path: '',
        method: 'HEAD',
        frequency: 1,
        expectStatusCode: ''
      },
      rules: {
        port: [
          {
            required: true,
            message: '请填写'
          }
        ],
        domain: [
          {
            required: true,
            message: '请填写'
          }
        ],
        path: [
          {
            required: true,
            message: '请填写'
          }
        ]
      },
      uuid: ''
    }
  },
  methods: {
    async fetchInfo() {
      const data = await this.Fetch.post('V4/cloud.monitor.task.info', { uuid: this.uuid })
      data.property_object = data.target || data.domain
      data.property_type = data.target !== '' ? 1 : 0
      return data
    },

    async beforeOpen(form) {
      this.form = {
        ...this.formDefault
      }
    },

    async initOptions(form) {
      this.active = 1
      this.mode = form.uuid ? 'Edit' : 'Create'
      this.$refs.FormNotice.restForm()
      if (this.mode === 'Edit') {
        this.uuid = form.uuid
        form = await this.fetchInfo()
        const { alert_setting } = form

        Object.assign(this.form, form)

        alert_setting.alert_receivers = alert_setting.receivers_list.filter(_ => _.checked).map(_ => _.value)
        this.$refs.FormNotice.setForm(alert_setting)
      }
    },

    handleNext() {
      this.active++
    },

    async handleSubmit() {
      const formNotice = await this.$refs.FormNotice.getForm()
      const form = {
        ...this.form,
        ...formNotice
      }
      delete form.property_object

      this.submitLoading = true
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/cloud.monitor.task.add', form)
        } else {
          form.uuid = this.uuid
          await this.Fetch.post('V4/cloud.monitor.task.save', form)
        }
      } catch (e) {
        return
      } finally {
        this.submitLoading = false
      }

      this.Message('ACTION_SUCCESS')
      this.handleClose()
      this.$emit('init')
    }
  }
})
</script>
