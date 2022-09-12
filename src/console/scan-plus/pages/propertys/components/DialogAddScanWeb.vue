<template>
  <DialogStep
    ref="Dialog"
    :steps="steps"
    :mode="mode"
    :active.sync="active"
    :submit-loading="submitLoading"
    width="500px"
    title-label="Web漏洞扫描"
    @submit="handleSubmit"
    @next="handleNext"
  >
    <div style="margin-left: 50px">
      <el-form
        v-show="active === 1"
        ref="Form1"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="扫描对象">
          <span>{{ form.property_object }}</span>
          <el-checkbox
            v-if="form.property_type === 0"
            v-model="setIP"
            style="margin-left: 12px"
          >指定IP</el-checkbox>
        </el-form-item>
        <template v-if="setIP">
          <el-form-item
            prop="scan_ip"
            label="扫描IP"
          >
            <el-input
              v-model="form.scan_ip"
              style="width: 200px"
              placeholder="输入源站IP地址，如1.1.1.1"
            />
          </el-form-item>
        </template>
        <el-form-item
          prop="protocol"
          label="扫描协议"
        >
          <el-radio-group
            v-model="form.protocol"
            @change="changProtocol"
          >
            <el-radio :label="0">HTTP</el-radio>
            <el-radio :label="1">HTTPS</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="扫描端口"
          prop="scan_port"
        >
          <el-input
            v-model="form.scan_port"
            placeholder="格式：0~65535"
            style="width:350px;"
          />
        </el-form-item>
        <el-form-item
          label="起始URL"
          prop="start_url"
        >
          <el-input
            v-model="form.start_url"
            placeholder="格式：/test/test.html或者/test"
            style="width:350px;"
          />
        </el-form-item>
        <el-form-item
          prop="scan_pattern"
          label="扫描模式"
        >
          <el-radio-group v-model="form.scan_pattern">
            <el-radio-button :label="1">快速</el-radio-button>
            <el-radio-button :label="2">标准</el-radio-button>
            <el-radio-button :label="3">全面</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form
        v-show="active === 2"
        ref="Form2"
        :model="form"
        :rules="rules"
        style="margin-top: 32px"
        label-position="top"
        label-width="100px"
      >
        <el-form-item
          prop="plan"
          label="执行方式"
        >
          <el-radio-group v-model="form.is_plan">
            <el-radio :label="0">立即</el-radio>
            <el-radio :label="1">计划</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.is_plan === 1">
          <el-form-item
            prop="interval"
            label="执行频率"
          >
            <el-radio-group v-model="form.plan_interval">
              <el-radio :label="3">每天</el-radio>
              <el-radio :label="0">每周</el-radio>
              <el-radio :label="1">每月</el-radio>
              <el-radio :label="2">每季度</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            prop="startDateTime"
            label="开始时间"
          >
            <el-date-picker
              v-model="form.start_run_time"
              :disabled="mode === 'Edit'"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始时间"
            />
          </el-form-item>
          <!-- <el-form-item
            prop="run_number"
            label="执行次数"
          >
            <el-input-number
              v-model="form.run_number"
              :min="1"
              :max="scanNumber"
              style="margin-right: 8px"
            />
            <label>上限为所选套餐剩余次数</label>
          </el-form-item> -->
        </div>
      </el-form>
      <FormNoticeBasic
        v-show="active === 3"
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

export default createDialog({
  name: 'DialogAddDnsMonitor',

  components: { DialogStep, FormNoticeBasic },

  data() {
    return {
      submitLoading: false,
      setIP: false,
      scanNumber: 20,
      task_uuid: '',
      active: 1,
      id: '',
      mode: 'Create',
      steps: [
        {
          title: '监控配置',
          icon: 'el-icon-setting'
        },
        {
          title: '扫描计划',
          icon: 'el-icon-date'
        },
        {
          title: '通知告警',
          icon: 'el-icon-bell'
        }
      ],
      formDefault: {
        property_id: '',
        property_object: '',
        property_type: 0,
        scan_port: '',
        start_url: '',
        scan_ip: '',
        protocol: 0,
        scan_pattern: 1,
        is_plan: 0,
        plan_interval: 3,
        start_run_time: '',
        run_number: 1,
        is_agree: 1
      },
      form: {},
      rules: {
        start_run_time: [
          {
            required: true,
            message: '清选择'
          }
        ],
        scan_ip: [
          {
            required: true,
            pattern: RULE.ipReg,
            message: '格式有误',
            trigger: 'blur'
          }
        ],
        start_url: {
          pattern: RULE.noProtocolUrl,
          message: '格式有误',
          trigger: 'blur'
        },

        scan_port: {
          pattern: RULE.port,
          message: '格式有误'
        }
      }
    }
  },

  methods: {
    async beforeOpen(form) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id ? form.id : ''
      this.form = {
        ...this.formDefault,
        ...form
      }
    },

    async initOptions(form) {
      this.$refs.FormNoticeBasic.restForm(form)

      if (form.notice_type) {
        const noticeForm = {
          alert_type: form.notice_type.map(Number),
          alert_receivers: form.notice_member_list,
          notDisturbTimeRaw: form.not_disturb_time
        }
        this.$refs.FormNoticeBasic.setForm(noticeForm)
      }
      this.active = 1
    },
    changProtocol(val) {
      console.log(val)
      // if (val === 1) {
      //   this.form.scan_port = this.form.scan_port || 443
      //   return
      // }
      // this.form.scan_port = this.form.scan_port || 80
    },
    handleNext() {
      if (this.active === 1) {
        this.$refs.Form1.validate(valid => {
          if (valid) this.active++
        })
      } else if (this.active === 2) {
        this.$refs.Form2.validate(valid => {
          if (valid) this.active++
        })
      } else {
        this.active++
      }
    },

    async handleSubmit() {
      let formNotice
      try {
        formNotice = await this.$refs.FormNoticeBasic.getForm()
      } catch (e) {
        return
      }

      const form = {
        ...this.form,
        ...formNotice,
        notice_member_list: formNotice.alert_receivers,
        notice_type: formNotice.alert_type
      }
      this.submitLoading = true
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/shield.scan.task.add', form)
        } else {
          form.scan_task_id = this.id
          await this.Fetch.post('V4/shield.cycle.scan.save', form)
        }
      } catch (e) {
        return
      } finally {
        this.submitLoading = false
      }
      this.Message('ACTION_SUCCESS')
      this.handleClose()
    }
  }
})
</script>
