<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="false"
    title="防CC"
  >
    <template slot="tips">
      <p>有效防止CC攻击。{{ appAssets.companyEN }} 全局默认对搜索引擎放行</p>
      <p>若您的业务有通过API接口访问的情况，CC防护可能有存在一定程度的误封，您可以通过 <router-link to="./waf">精准访问控制引擎</router-link> 功能做精细化防御配置</p>
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
      <p>默认：系统只对灾难性攻击行为为用户进行安全拦截</p>
      <p>普通：系统会智能识别出可疑请求，并且自动选择合适的验证方式（建议正在遭受到CC攻击时开启）</p>
      <p>严格：建议仅在正在受到CC攻击且防御不佳时开启</p>
      <p>验证码：100%防御，对用户体验有一定影响</p>
    </DmAlert>
    <el-form
      v-if="status !== 'off'"
      label-position="right"
      label-width="145px"
    >
      <el-form-item label="智能CC">
        <el-switch
          v-model="form.ai_cc_status"
          active-value="on"
          inactive-value="off"
          @change="handleUpdate"
        />
        <TipsTooltip title="基于大数据机器学习算法分析，提炼网站正常业务特征，阻断异常的高危请求。" />
      </el-form-item>
    </el-form>
  </CardItemForm>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import consoleItem from '../../../../../mixins/consoleItem'

export default {
  name: 'DefenseDdos',

  components: {
    SelectSwitch
  },

  mixins: [consoleItem],

  data() {
    return {
      SETTING_ID: 'anti_cc',
      formDefault: {
        status: 'off',
        ai_cc_status: 'off'
      },
      options: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'normal',
          label: '普通'
        },
        {
          value: 'strict',
          label: '严格'
        },
        {
          value: 'captcha',
          label: '验证码'
        }
      ]
    }
  },

  computed: {
    status() {
      const { status, type } = this.form
      return status === 'on' ? type : 'off'
    }
  },

  methods: {
    handleUpdateStatus(val) {
      const form = this.form
      form.status = val === 'off' ? 'off' : 'on'
      form.type = val === 'off' ? 'default' : val

      if (val === 'off') form.ai_cc_status = 'off'
      this.handleUpdate()
    },

    async handleUpdate() {
      await this.confirmAction()
      this.fetchUpdate()
    }
  }
}
</script>
