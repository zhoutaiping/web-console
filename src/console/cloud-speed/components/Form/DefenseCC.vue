<template>
  <div>
    <DmAlert>
      <p>默认：系统只对灾难性攻击行为为用户进行安全拦截</p>
      <p>普通：系统会智能识别出可疑请求，并且自动选择合适的验证方式（建议正在遭受到CC攻击时开启）</p>
      <p>严格：建议仅在正在受到CC攻击且防御不佳时开启</p>
      <p>验证码：100%防御，对用户体验有一定影响</p>
    </DmAlert>
    <el-form
      v-if="form.status !== 'off'"
      label-position="right"
      label-width="145px"
    >
      <el-form-item label="智能CC">
        <el-switch
          v-model="form.ai_cc_status"
          active-value="on"
          inactive-value="off"
        />
        <TipsTooltip style="margin-top: 3px" title="基于大数据机器学习算法分析，提炼网站正常业务特征，阻断异常的高危请求。" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import baseMixins from './base'
import Label from '../../constant/label'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: [
          {
            value: 'off',
            label: 'OFF'
          },
          ...Label.DEFENSE_CC_STATUS
        ]
      },
      formDefault: {
        status: 'off',
        ai_cc_status: 'off'
      }
    }
  },

  methods: {
    setForm(form = {}) {
      this.form = {
        ...this.formDefault,
        ...form,
        status: form.status === 'on' ? form.type : 'off'
      }
    },

    getForm() {
      const status = this.form.status === 'off' ? 'off' : 'on'
      const type = this.form.status === 'off' ? '' : this.form.status
      return {
        ...this.form,
        status,
        type
      }
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
