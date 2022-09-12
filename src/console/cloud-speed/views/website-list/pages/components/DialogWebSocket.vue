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
      开启 WebSocket 服务
      <yd-form-select
        slot="action"
        v-model="form.status"
        :selects="addReserved(SELECT.SWITCH_M2)"
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
import diloagBatch from '../../../../mixins/dialog-batch'

const FORM = {
  status: '__KEEP__'
}

export default create({
  name: 'dialog',

  mixins: [diloagBatch],

  components: { FormItemAction },

  data() {
    return {
      title: 'WebSocket',
      open: false,
      form: {},
      loadingSubmit: false
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

      if (form.status === '__KEEP__') {
        this.handleClose()
        return
      }
      form._policy = form.status
      const data = {
        id: 'websocket',
        name: 'dialogWebSocket',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
