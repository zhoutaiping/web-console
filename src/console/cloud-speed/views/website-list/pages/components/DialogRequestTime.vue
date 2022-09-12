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
      安全节点回源请求连接等待时长
    </FormItemAction>
    <yd-alert>
      <p>安全节点的回源请求TCP建连超时等待时间默认为30秒，您可以根据实际需求设置回源请求的最长等待时间，最长不超过300s。</p>
    </yd-alert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      label-position="top"
      label-width="120px"
    >
      <el-form-item
        label="节点与源建连超时时间"
        prop="proxy_connect_timeout"
      >
        <el-input-number
          v-model="form.proxy_connect_timeout"
          :min="0"
          :max="300"
          controls-position="right"
        />
        秒 （0-300，默认30）
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

const FORM = {
  proxy_connect_timeout: 30
}

export default create({
  name: 'dialog',

  mixins: [diloagBatch],

  components: { FormItemAction },

  data() {
    return {
      title: '回源请求时长',
      open: false,
      form: {},
      loadingSubmit: false,
      rules: {}
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
      const data = {
        id: 'domain_proxy_conf',
        name: 'dialogRequestTime',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
