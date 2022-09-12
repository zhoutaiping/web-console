<template>
  <DialogStep
    ref="Dialog"
    :steps="steps"
    :mode="mode"
    :submit-loading="submitLoading"
    :active.sync="active"
    width="500px"
    title-label="DNS劫持监控"
    @submit="handleSubmit"
    @next="handleNext"
  >
    <div style="margin-left: 50px;">
      <el-form
        v-show="active === 1"
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="监控对象">
          <el-input
            v-model="form.property_object"
            style="width: 280px"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="监控频率"
          prop="frequency"
        >
          <yd-form-radio-button
            :radios="selects.frequency"
            v-model="form.frequency"
          />
        </el-form-item>
        <el-form-item
          label="可信IP/IP段"
          prop="ip_strings"
        >
          <el-input
            v-model="form.ip_strings"
            style="width: 280px"
            type="textarea"
            placeholder="请输入可信IP/IP段，多个IP请使用逗号隔开；若您的网站已NS接入云加速厂商，请输入加速节点段；"
          />
        </el-form-item>
      </el-form>
      <FormNoticeBasic
        v-show="active === 2"
        ref="FormNoticeBasic"
      />
    </div>
  </DialogStep>
</template>

<script>
import RULE from '@/utils/verify'
import createDialog from '@/utils/createDialog'
import DialogStep from '@/components/Dialog/DialogStep'
import FormNoticeBasic from './FormNoticeBasic'

function ipVaildate(rule, value, callback) {
  if (!value) callback(new Error('请填写'))
  value = value.split(/[\n\r,]/g)
  value = value.filter(_ => _)

  value.forEach(item => {
    if (!RULE.ipReg.test(item) && !RULE.cidrREG.test(item) && !RULE.ipRangeReg.test(item)) {
      callback(new Error('格式有误'))
    }
  })
  callback()
}

export default createDialog({
  name: 'DialogAddDnsMonitor',

  components: { DialogStep, FormNoticeBasic },

  data() {
    return {
      submitLoading: false,
      task_uuid: '',
      active: 1,
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
        property_object: '',
        frequency: 1
      },
      form: {},
      rules: {
        ip_strings: [
          {
            validator: ipVaildate,
            trigger: 'blur'
          }
        ]
      },
      selects: {
        frequency: [
          { value: 1, label: '1分钟' },
          { value: 3, label: '3分钟' },
          { value: 5, label: '5分钟' }
        ]
      }
      // Form: {},
      // option: {
      //   form: {
      //     size: 'small',
      //     labelWidth: '80px',
      //     labelPosition: 'top'
      //   },
      //   submitBtn: {
      //     show: false
      //   },
      //   row: {
      //     gutter: 12
      //   }
      // },
      // rule: [
      //   {
      //     type: 'hidden',
      //     value: [],
      //     field: 'property_ids'
      //   },
      //   {
      //     type: 'input',
      //     title: '监控对象',
      //     field: 'property_object',
      //     props: {
      //       disabled: true
      //     }
      //   },
      //   {
      //     type: 'radio',
      //     field: 'frequency',
      //     title: '监控频率',
      //     value: 1,
      //     options: [
      //       { 'value': 1, 'label': '1分钟' },
      //       { 'value': 3, 'label': '3分钟' },
      //       { 'value': 5, 'label': '5分钟' }
      //     ]
      //   },
      //   {
      //     type: 'input',
      //     field: 'ip_strings',
      //     title: '可信IP/IP段',
      //     props: {
      //       type: 'textarea',
      //       rows: 5,
      //       placeholder: '请输入可信IP/IP段，多个IP请使用逗号隔开；若您的网站已NS接入云加速厂商，请输入加速节点段；'
      //     },
      //     validate: [
      //       {
      //         validator: ipVaildate,
      //         trigger: 'blur'
      //       }
      //     ]
      //   }
      // ]
    }
  },

  methods: {
    async initOptions(form) {
      this.active = 1
      this.mode = form.task_uuid ? 'Edit' : 'Create'

      // 读取配置
      if (this.mode === 'Edit') {
        this.task_uuid = form.task_uuid
        form = await this.fetchInfo()
        form.property_object = form.domain
        form.frequency = Number(form.frequency)
        this.form = form
      }
      this.$refs.FormNoticeBasic.restForm()
    },

    handleNext() {
      this.$refs.Form.validate(() => {
        this.active++
      }, () => {
        this.active = 1
      })
    },

    async fetchInfo() {
      const data = await this.Fetch.post('V4/dns.hijack.task.info', { task_uuid: this.task_uuid })
      data.ip_strings = data.ip_strings.join('\n')

      const { alert_setting } = data
      alert_setting.alert_receivers = alert_setting.receivers_list.filter(_ => _.checked).map(_ => _.value)

      if (alert_setting.not_disturb_start_time && alert_setting.not_disturb_end_time) {
        alert_setting.notDisturbTimeRaw = [alert_setting.not_disturb_start_time, alert_setting.not_disturb_end_time]
      } else {
        alert_setting.notDisturbTimeRaw = ''
      }
      this.$refs.FormNoticeBasic.setForm(alert_setting)
      return data
    },

    async handleSubmit() {
      const formNotice = await this.$refs.FormNoticeBasic.getForm()
      const formData = this.form
      const form = {
        ...formData,
        ip_strings: formData.ip_strings.split('\n'),
        ...formNotice
      }

      this.submitLoading = true
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/dns.hijack.task.add', form)
        } else {
          form.task_uuid = this.task_uuid
          await this.Fetch.post('V4/dns.hijack.task.save', form)
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
