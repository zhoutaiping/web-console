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
      通过移除响应头中 Entity Tags优化前端性能
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
  name: 'dialogBrowser',

  mixins: [diloagBatch],

  components: { FormItemAction },

  data() {
    return {
      title: '浏览器缓存优化',
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
      const form = this.form
      form._policy = form.status

      if (form.status === '__KEEP__') {
        this.handleClose()
        return
      }

      const data = {
        id: 'browser_cache',
        name: 'dialogBrowser',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
