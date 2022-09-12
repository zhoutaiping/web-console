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
      回源使用连接保活可以复用现有的连接（需源服务器支持keepalive），避免每次请求都重新建立TCP请求，可大幅提升回源性能，减小延迟。
      <yd-form-select
        slot="action"
        v-model="form.proxy_keepalive"
        :selects="addReserved(SELECT.SWITCH_NUM, 'keep')"
      />
    </FormItemAction>
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
import SelectSwitch from '@/components/Select/SelectSwitch'
import diloagBatch from '../../../../mixins/dialog-batch'

const FORM = {
  proxy_keepalive: 'keep'
}

export default create({
  name: 'dialog',

  mixins: [diloagBatch],

  components: { FormItemAction, SelectSwitch },

  data() {
    return {
      title: '回源保持长连接',
      open: false,
      form: {},
      loadingSubmit: false,
      rules: {
        proxy_keepalive: []
      }
    }
  },

  methods: {
    handleOpen() {
      this.form = deepClone(FORM)
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    handleSubmit() {
      const form = deepClone(this.form)

      if (form.proxy_keepalive === 'keep') {
        this.handleClose()
        return
      }

      const data = {
        id: 'domain_proxy_conf',
        name: 'dialogKeepLive',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
