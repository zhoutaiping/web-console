<template>
  <yd-card>
    <template slot="tips">
      <p>基于大数据人工智能攻击识别引擎，可防御SQL注入、XSS攻击、恶意扫描等各种漏洞攻击。同时通过访客行为和安全大数据分析，深层次拦截WebShell</p>
    </template>
    <yd-form-select
      slot="action"
      v-model="form.status"
      :selects="STATUS_TYPE"
    />
    <DmAlert>
      <p>1. 模式分为观察模式、拦截模式和封禁模式</p>
      <p>观察模式：实时检测分析攻击，但不对攻击进行拦截</p>
      <p>拦截模式：发现有攻击时，YUNDUN 进行实时拦截</p>
      <p>封禁模式：发现有攻击时，YUNDUN 进行实时拦截，同时会将触发一定规则的攻击IP加入黑名单中</p>
      <p>2. 等级分为普通和严格</p>
      <p>普通：较为宽松，基本无误防</p>
      <p>严格：严格检查，综合多方面因子，可能导致误防</p>
      <p>当您发现在严格模式下存在较多误拦截，或者业务存在较多不可控的用户输入（例如富文本编辑器、技术论坛等），建议您选择普通模式</p>
      <p>当您需要更严格地防护SQL注入、命令执行、路径穿越时，建议您选择严格模式,</p>
    </DmAlert>
    <el-form label-width="100px">
      <el-form-item label="等级选择">
        <el-radio-group v-model="form.waf_level">
          <el-radio label="general">普通</el-radio>
          <el-radio label="strict">严格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="AI引擎">
        <el-switch
          v-model="form.ai_status"
          active-value="on"
          inactive-value="off"
        />
        <PopoverInfo
          style="margin-left: 8px"
          content="基于神经网络和深度学习算法的防御类型，有效防护未知威胁"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import PopoverInfo from '@/components/Popover/PopoverInfo'

export default {
  components: { PopoverInfo },

  data() {
    return {
      form: {
        status: 'active',
        // waf_mode
        waf_level: 'general',
        ai_status: 'on'
      },
      STATUS_TYPE: [
        {
          value: 'off',
          label: 'OFF'
        },
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

  methods: {
    setForm(form) {
      const status = form.status === 'on' ? form.waf_mode : 'off'
      Object.assign(this.form, {
        ...form,
        status
      })
    },

    getForm() {
      const status = this.form.status === 'off' ? 'off' : 'on'
      const waf_mode = this.form.status === 'off' ? 'active' : this.form.status
      return {
        ...this.form,
        status,
        waf_mode
      }
    }
  }
}
</script>
