<template>
  <yd-card>
    <template slot="tips">
      <p>依多年攻防实战经验，推出了针对高风险攻击者使用的工具及其攻击手法的诱捕技术，同时支持多种实施部署方案</p>
    </template>
    <yd-form-select
      slot="action"
      v-model="form.status"
      :selects="TYPE_OPTIONS"
    />
    <DmAlert>
      <p>1. 默认Web蜜网为WEB应用防火墙提供的专用Web蜜网</p>
      <p>2. 如您已经搭建了Web蜜网可以使用自有定制Web蜜网，自有定制Web蜜网支持后台诱导和威胁设备诱导两种诱导方式</p>
      <p>3. 自有定制Web蜜网后台诱导需要输入Web蜜网服务器IP和表示入侵成功的URL；威胁设备诱导可将攻击设备直接诱导至Web蜜网</p>
      <p>请确保添加的诱导目录不是您的真实业务目录，否则会导致正常访客无法访问。</p>
    </DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <template v-if="form.status === 'custom'">
        <el-form-item
          label="Web蜜网服务器"
          prop="server"
        >
          <el-input
            v-model="form.server"
            style="width: 280px"
            placeholder="请输入服务器IP"
          />
        </el-form-item>
        <el-form-item
          label="入侵成功URL"
          prop="success_url"
        >
          <el-input
            v-model="form.success_url"
            style="width: 280px"
            placeholder="/"
          />
        </el-form-item>
        <el-form-item label="诱导类型">
          <el-radio-group v-model="form.custom_type">
            <el-radio-button label="admin">后台诱导</el-radio-button>
            <el-radio-button label="threaten_equipment">威胁设备诱导</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </template>
      <div v-show="form.status === 'default' || (form.status === 'custom' && form.custom_type === 'admin')">
        <el-form-item label="诱导目录">
          <WebHoneyRules ref="WebHoneyRules" />
        </el-form-item>
      </div>
    </el-form>
  </yd-card>
</template>

<script>
import RULE from '@/utils/verify'
import WebHoneyRules from './components/WebHoneyRules'

export default {
  name: 'CardWebHoney',

  components: {
    WebHoneyRules
  },

  data() {
    return {
      TYPE_OPTIONS: [
        {
          value: 'off',
          label: 'OFF'
        },
        {
          value: 'default',
          label: '红网通用后台诱导'
        },
        {
          value: 'custom',
          label: '自有定制Web蜜网'
        }
      ],
      form: {
        status: 'off',
        // type
        custom_type: 'admin',
        server: '',
        success_url: ''
      },
      rules: {
        server: [
          {
            required: true,
            pattern: RULE.ipReg,
            message: '格式有误',
            trigger: 'blur'
          }
        ],
        success_url: [
          {
            required: true,
            pattern: RULE.slashBegin,
            message: '格式有误',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    setForm(form) {
      const { web_honeypot, web_honeypot_rules = [] } = form
      const status = web_honeypot.status === 'on' ? web_honeypot.type : 'off'
      Object.assign(this.form, {
        ...web_honeypot,
        status
      })

      this.$refs.WebHoneyRules.list = web_honeypot_rules
    },

    async getForm() {
      const status = this.form.status === 'off' ? 'off' : 'on'
      const type = this.form.status === 'off' ? '' : this.form.status

      if (this.$refs.Form) {
        this.$refs.Form.validate((valid) => {
          if (!valid) throw new Error()
        })
      }

      const web_honeypot = {
        // ...this.form,
        status
      }

      if (status !== 'off') {
        web_honeypot.type = type
      }

      if (type === 'custom') {
        web_honeypot.custom_type = this.form.custom_type
        web_honeypot.server = this.form.server
        web_honeypot.success_url = this.form.success_url
      }

      const web_honeypot_rules = await this.$refs.WebHoneyRules.getList()
      return {
        web_honeypot,
        web_honeypot_rules
      }
    }
  }
}
</script>
