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
    <FormItemAction>
      针对用户域名，批量修改网站域名节点状态
      <yd-form-select
        slot="action"
        v-model="form.protected_status"
        :selects="addReserved(NODE_OPTIONS)"
      />
    </FormItemAction>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import diloagBatch from '../../../../mixins/dialog-batch'
import FormItemAction from '@/components/FormItem/FormItemAction'

const NODE_OPTIONS = [
  {
    value: 0,
    label: '回源',
    disabled: false
  },
  {
    value: 1,
    label: 'Web安全加速网络',
    disabled: false
  },
  {
    value: 2,
    label: 'TCP安全加速网络',
    disabled: false
  }
]

export default create({
  name: 'dialogDomainNode',

  components: {
    FormItemAction
  },

  mixins: [diloagBatch],

  data() {
    return {
      NODE_OPTIONS,
      title: '域名节点状态',
      open: false,
      loadingSubmit: false,
      form: {
        protected_status: '__KEEP__'
      }
    }
  },

  methods: {
    handleOpen() {
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    handleSubmit() {
      const form = deepClone(this.form)
      form._policy = form.protected_status

      if (form.protected_status === '__KEEP__') {
        this.handleClose()
        return
      }
      const data = {
        id: 'protected_status',
        name: 'dialogDomainNode',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
