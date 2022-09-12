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
      对于存在多个源IP，当安全节点在指定时间间隔内回源到某个源的失败次数超过指定次数时，将在指定时间内禁用此源IP。
    </FormItemAction>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      class="margin-top"
      label-position="left"
      label-width="170px"
    >
      <el-form-item
        label="回源失败次数"
        prop="max_fails"
      >
        <el-input-number
          v-model="form.max_fails"
          :controls="false"
          :precision="0"
          :min="0"
          :max="300"
          style="width: 200px"
          placeholder="0-300，默认30"
          controls-position="right"
        />
        次
      </el-form-item>
      <el-form-item
        label="回源失败统计时间间隔"
        prop="fails_timeout"
      >
        <el-input-number
          :controls="false"
          v-model="form.fails_timeout"
          :min="0"
          :max="1000"
          style="width: 200px"
          controls-position="right"
          placeholder="默认10"
        />
        秒
      </el-form-item>
      <el-form-item
        label="回源失败禁用不可用IP时间"
        prop="keep_new_src_time"
      >
        <el-input-number
          v-model="form.keep_new_src_time"
          :controls="false"
          :min="0"
          :max="1000"
          style="width: 200px"
          placeholder="默认30"
        />
        秒
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
import { validatorNumber } from '@/utils/validator'
const FORM = {
  max_fails: 30,
  fails_timeout: 10,
  keep_new_src_time: 30
}

export default create({
  name: 'dialog',

  mixins: [diloagBatch],

  components: { FormItemAction },

  data() {
    return {
      title: '回源健康检查',
      open: false,
      form: {},
      loadingSubmit: false,
      rules: {
        max_fails: {
          validator: validatorNumber(0, 300), trigger: 'blur', message: ' '
        },
        fails_timeout: {
          validator: validatorNumber(0, 1000), trigger: 'blur', message: ' '
        },
        keep_new_src_time: {
          validator: validatorNumber(0, 1000), trigger: 'blur', message: ' '
        }
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
      const data = {
        id: 'domain_proxy_conf',
        name: 'dialogHealthy',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
