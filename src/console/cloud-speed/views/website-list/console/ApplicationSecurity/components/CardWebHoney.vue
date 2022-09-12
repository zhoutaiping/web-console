<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="false"
    title="Web蜜网"
  >
    <template slot="tips">
      <p>依多年攻防实战经验，推出了针对高风险攻击者使用的工具及其攻击手法的诱捕技术，同时支持多种实施部署方案</p>
    </template>
    <template slot="action">
      <SelectSwitch
        slot="action"
        :value="status"
        :selects="options"
        :on-visible="false"
        off-value="off"
        @change="handleUpdateStatus"
      />
    </template>
    <DmAlert>
      <p>1. 默认Web蜜网为{{ $t('red-guard.title') }}提供的专用Web蜜网</p>
      <p>2. 如您已经搭建了Web蜜网可以使用自有定制Web蜜网，自有定制Web蜜网支持后台诱导和威胁设备诱导两种诱导方式</p>
      <p>3. 自有定制Web蜜网后台诱导需要输入Web蜜网服务器IP和表示入侵成功的URL；威胁设备诱导可将攻击设备直接诱导至Web蜜网</p>
      <p>请确保添加的诱导目录不是您的真实业务目录，否则会导致正常访客无法访问。</p>
    </DmAlert>
    <template v-if="status === 'custom'">
      <el-form
        ref="Form"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="诱导类型">
          <yd-form-radio
            :radios="wafSelects.webHoneyType"
            v-model="form.custom_type"
            @change="handleUpdateForm"
          />
        </el-form-item>
        <el-form-item
          label="Web蜜网服务器"
          prop="server"
        >
          <el-input
            v-model="form.server"
            style="width: 250px"
            placeholder="请输入服务器IP"
            @blur="handleUpdateForm"
          />
        </el-form-item>
        <el-form-item
          label="入侵成功URL"
          prop="success_url"
        >
          <el-input
            v-model="form.success_url"
            style="width: 250px"
            placeholder="/"
            @blur="handleUpdateForm"
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-if="form.custom_type === 'admin' || form.type === 'default'">
      <TableWebHoneyRules />
    </template>
  </CardItemForm>
</template>

<script>
import RULE from '@/utils/verify'
import SelectSwitch from '@/components/Select/SelectSwitch'
import consoleItem from '../../../../../mixins/consoleItem'
import TableWebHoneyRules from './TableWebHoneyRules'

export default {
  name: 'CardWebHoney',

  components: {
    SelectSwitch,
    TableWebHoneyRules
  },

  mixins: [consoleItem],

  data() {
    return {
      SETTING_ID: 'web_honeypot',
      options: [],
      formDefault: {
        type: 'default',
        custom_type: 'admin',
        server: '',
        success_url: ''
      },
      formRules: {
        server: {
          required: true,
          pattern: RULE.ipReg,
          message: '格式有误',
          trigger: 'blur'
        },
        success_url: {
          required: true,
          pattern: RULE.noProtocolUrl,
          message: '格式有误',
          trigger: 'blur'
        }
      }
    }
  },

  computed: {
    status() {
      const { status, type } = this.form
      return status === 'off' ? 'off' : type
    }
  },

  methods: {
    async init() {
      const options = [
        {
          value: 'default',
          label: '红网通用后台诱导'
        }
      ]
      if (['HW005B', 'YD-WAFQJB', 'YD-WAFQJB-GD', 'YD-WAFDZB-GD', 'YD-WEBAQJS-QJ', 'YD-WEBAQJS-DZ'].includes(this.domainPlanInfo.meal_flag)) {
        options.push({
          value: 'custom',
          label: '自有定制Web蜜网'
        })
      }
      this.options = options
    },

    handleUpdateStatus(val) {
      this.form.status = val === 'off' ? 'off' : 'on'
      this.form.type = val === 'off' ? 'admin' : val

      if (val === 'custom') {
        this.$refs.Form.validate(valid => {
          if (valid) this.handleUpdate()
        })
      } else {
        delete this.form.server
        delete this.form.success_url
        this.handleUpdate()
      }
    },

    handleUpdateForm() {
      this.$refs.Form.validate(valid => {
        if (!valid) return
        this.handleUpdate()
      })
    },

    async handleUpdate() {
      await this.confirmAction()
      this.fetchUpdate()
    }
  }
}
</script>
