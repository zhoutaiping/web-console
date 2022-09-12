<template>
  <div>
    <DmAlert>
      <p>如需具体配置，请跳转至
        <router-link
          :to="{
            name: 'cloud-speed.router.websiteList__waf',
            params: { id: domainId },
            query: $route.query
        }">精准访问控制</router-link>
      </p>
      <p>1. 模式分为观察模式、拦截模式和封禁模式</p>
      <p>观察模式：实时检测分析攻击，但不对攻击进行拦截</p>
      <p>拦截模式：发现有攻击时，{{ appAssets.companyEN }} 进行实时拦截</p>
      <p>封禁模式：发现有攻击时，{{ appAssets.companyEN }} 进行实时拦截，同时会将触发一定规则的攻击IP加入黑名单中</p>
      <p>2. 等级分为普通和严格</p>
      <p>普通：较为宽松，基本无误防</p>
      <p>严格：严格检查，综合多方面因子，可能导致误防</p>
      <p>当您发现在严格模式下存在较多误拦截，或者业务存在较多不可控的用户输入（例如富文本编辑器、技术论坛等），建议您选择普通模式</p>
      <p>当您需要更严格地防护SQL注入、命令执行、路径穿越时，建议您选择严格模式</p>
    </DmAlert>
    <el-form
      v-if="form.status !== 'keep'"
      label-width="120px"
      label-position="left"
    >
      <el-form-item
        v-if="isBatch"
        label="防护模式"
      >
        <yd-form-select
          v-model="form.waf_mode"
          :selects="addReserved(Label.WAF_MODE, 'keep', isBatch)"
          @change="handleUpdate"
        />
      </el-form-item>
      <el-form-item label="等级选择">
        <yd-form-radio
          v-model="form.waf_level"
          :radios="addReserved(Label.WAF_LEVEL, 'keep', isBatch)"
          @change="handleUpdate"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">
          AI引擎
          <TipsTooltip title="基于神经网络和深度学习算法的防御类型，有效防护未知威胁" />
        </template>
        <yd-form-radio
          v-if="isBatch"
          v-model="form.ai_status"
          :radios="addReserved(Label.STATUS_SWITCH, 'keep', isBatch)"
          @change="handleUpdate"
        />
        <el-switch
          v-else
          v-model="form.ai_status"
          active-value="on"
          inactive-value="off"
          @change="handleUpdate"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import baseMixins from '../base'
import Label from '../../../constant/label'

export default {
  name: 'CloudWaf',

  components: {
    TipsTooltip
  },

  mixins: [baseMixins],

  data() {
    return {
      addReserved,
      Label,
      config: {
        selectStatus: [
          {
            value: 'off',
            label: 'OFF'
          }
        ]
      },
      form: {},
      formBatchDefault: {
        waf_mode: 'keep',
        ai_status: 'keep',
        waf_level: 'keep'
      },
      formDefault: {
        waf_mode: 'active',
        ai_status: 'general',
        waf_level: 'on'
      }
    }
  },

  created() {
    this.initConfig()
    this.setForm()
  },

  methods: {
    setForm(form = {}) {
      const status = form.status === 'on' ? form.waf_mode : 'off'

      this.form = {
        ...this.isBatch ? this.formBatchDefault : this.formDefault,
        ...form,
        status
      }

      if (this.isBatch) this.form.status = 'keep'
      this.$emit('updateStatus', status)
    },

    getForm() {
      const status = this.form.status === 'off' ? 'off' : 'on'
      const waf_mode = this.isBatch ? this.form.waf_mode : (this.form.status === 'off' ? 'active' : this.form.status)

      return {
        ...this.form,
        status,
        waf_mode
      }
    },

    initConfig() {
      const selectStatus = [{
        value: 'off',
        label: 'OFF'
      }]
      if (this.isBatch) {
        selectStatus.push({
          value: 'on',
          label: 'ON'
        })
      } else {
        selectStatus.push(...Label.WAF_MODE)
      }
      this.$emit('initConfig', {
        selectStatus: addReserved(selectStatus, 'keep', this.isBatch)
      })
    },

    handleUpdate() { }
  }
}
</script>
