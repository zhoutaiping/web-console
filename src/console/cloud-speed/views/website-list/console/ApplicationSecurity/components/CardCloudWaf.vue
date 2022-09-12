<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="true"
    :loading="false"
    title="漏洞攻击防护"
  >
    <template slot="tips">
      <p>基于大数据人工智能攻击识别引擎，可防御SQL注入、XSS攻击、恶意扫描等各种漏洞攻击。同时通过访客行为和安全大数据分析，深层次拦截WebShell</p>
      <p>如需具体配置，请跳转至
        <router-link
          :to="{
            name: 'cloud-speed.router.websiteList__waf',
            params: { id: domainId },
            query: $route.query
        }">精准访问控制</router-link>
      </p>
    </template>
    <SelectSwitch
      slot="action"
      :value="status"
      :on-visible="false"
      :selects="options"
      off-value="off"
      @change="handleUpdateStatus"
    />
    <DmAlert>
      <p>1. 模式分为观察模式、拦截模式和封禁模式</p>
      <p>观察模式：实时检测分析攻击，但不对攻击进行拦截</p>
      <p>拦截模式：发现有攻击时，{{ appAssets.companyEN }} 进行实时拦截</p>
      <p>封禁模式：发现有攻击时，{{ appAssets.companyEN }} 进行实时拦截，同时会将触发一定规则的攻击IP加入黑名单中</p>
      <p>2. 等级分为普通和严格</p>
      <p>普通：较为宽松，基本无误防</p>
      <p>严格：严格检查，综合多方面因子，可能导致误防</p>
      <p>当您发现在严格模式下存在较多误拦截，或者业务存在较多不可控的用户输入（例如富文本编辑器、技术论坛等），建议您选择普通模式</p>
      <p>当您需要更严格地防护SQL注入、命令执行、路径穿越时，建议您选择严格模式,</p>
    </DmAlert>
    <el-form label-width="100px">
      <el-form-item label="等级选择">
        <el-radio-group
          v-model="form.waf_level"
          @change="handleUpdate"
        >
          <el-radio label="general">普通</el-radio>
          <el-radio label="strict">严格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="AI引擎">
        <el-switch
          :disabled="domainPlanInfo.meal_flag === 'YD-WEBAQJS-TY'"
          v-model="form.ai_status"
          active-value="on"
          inactive-value="off"
          @change="handleUpdate"
        />
        <TipsTooltip title="基于神经网络和深度学习算法的防御类型，有效防护未知威胁" />
      </el-form-item>
    </el-form>
  </CardItemForm>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import domainMixins from '@/mixins/domain'
import consoleItem from '../../../../../mixins/consoleItem'

export default {
  name: 'CloudWaf',

  components: {
    TipsTooltip,
    SelectSwitch
  },

  mixins: [consoleItem, domainMixins],

  data() {
    return {
      SETTING_ID: 'cloud_waf',
      formDefault: {
        waf_mode: 'off',
        ai_status: 'off',
        waf_level: 'general'
      },
      options: [
        {
          value: 'active',
          label: '观察模式'
        },
        {
          value: 'block',
          label: '拦截模式'
        },
        {
          value: 'ban',
          label: '封禁模式'
        }
      ]
    }
  },

  computed: {
    status() {
      const { status, waf_mode } = this.form
      return status === 'off' ? 'off' : waf_mode
    }
  },

  created() {
    this.formDefault.waf_mode = this.domainPlanInfo.meal_flag === 'YD-WEBAQJS-TY' ? 'off' : 'on'
  },

  methods: {
    init() {
      const { packageLevel } = this.pageData
      if (packageLevel === 1) {
        this.options = [
          {
            value: 'active',
            label: '观察模式'
          },
          {
            value: 'block',
            label: '拦截模式',
            disabled: true
          },
          {
            value: 'ban',
            label: '封禁模式',
            disabled: true
          }
        ]
      }
    },

    handleUpdateStatus(val) {
      const form = this.form
      form.status = val === 'off' ? 'off' : 'on'
      form.waf_mode = val === 'off' ? 'off' : val
      this.handleUpdate()
    },

    async handleUpdate() {
      await this.confirmAction()
      this.fetchUpdate()
    }
  }
}
</script>
