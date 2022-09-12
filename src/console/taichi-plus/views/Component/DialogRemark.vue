<template>
  <yd-dialog :close-on-click-modal="true" :visible.sync="open" title="编辑备注">
    <el-form :options="form">
      <el-input :rows="4" v-model="form.remark" type="textarea" placeholder="请输入内容"/>
    </el-form>
    <div slot="footer">
      <el-button type="default" @click="handleClose">取消</el-button>
      <el-button :loading="form.$processing" type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      open: false,
      form: {}
    }
  },

  methods: {
    handleOpen(form) {
      this.open = true
      this.form = deepClone(form)
    },
    handleClose() {
      this.open = false
    },
    // 保存备注
    async handleSubmit() {
      if (this.form.remark.length > 255) {
        this.$message({
          message: '备注内容过长，最大支持 255 个字符',
          type: 'error'
        })
        return
      }

      this.$emit('submit', this.form)
      // this.form.submit()
      // this.$emit('on-success')
    }
  }
}
</script>
