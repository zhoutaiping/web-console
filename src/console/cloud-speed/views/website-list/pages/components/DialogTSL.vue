<style lang="scss" scoped>
.formItemAction {
  margin-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}
</style>

<template>
  <yd-dialog
    v-loading
    :class="b()"
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    aside
    aside-type="top"
  >
    <FormItemAction>
      安全传输层协议（TLS）用于在两个通信应用程序之间提供保密性和数据完整性
      <SelectSwitch
        slot="action"
        v-model="form.status"
        :on-value="'on'"
        :off-value="'off'"
      />
    </FormItemAction>
    <yd-alert>
      <p>TLS版本从低到高有四种，请结合安全性和客户端兼容性谨慎配置</p>
      <p>SSLv3：存在严重的安全漏洞，仅兼容非常古老的客户端，强烈不推荐使用</p>
      <p>TLSv1.0：有一定安全风险，已不符合PCI DSS合规判定标准</p>
      <p>TLSv1.1：2006年发布，修复TLSv1.0若干漏洞，并且引入了TLS 扩展</p>
      <p>TLSv1.2：加强了密码套件的扩展性，更好的安全性，更快的密码学算法，支持HTTP 2，目前广泛使用的版本</p>
    </yd-alert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="支持的最小TLS版本">
        <yd-form-select
          :selects="MIN_VERSION"
          v-model="form.min_version"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="text"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="loadingSubmit"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import FormItemAction from '@/components/FormItem/FormItemAction'
import diloagBatch from '../../../../mixins/dialog-batch'
import SelectSwitch from '@/components/Select/SelectSwitch'
import SELECT from '../../../../constant/select'

export default create({
  name: 'dialog',

  mixins: [diloagBatch],

  components: { FormItemAction, SelectSwitch },

  data() {
    return {
      title: '回源请求时长',
      open: false,
      form: {},
      loadingSubmit: false,
      MIN_VERSION: SELECT.MIN_VERSION,
      rules: {
        status: [],
        min_version: []
      }
    }
  },
  methods: {
    handleOpen() {
      this.form = Object.assign({}, {
        status: 'off',
        min_version: 'TLSv1.0'
      })
      this.open = true
    },

    handleClose() {
      this.open = false
    },
    handleChange(e) {
      console.log(e)
    },
    handleSubmit() {
      const form = deepClone(this.form)
      const data = {
        id: 'min_version',
        name: 'dialogTSL',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
