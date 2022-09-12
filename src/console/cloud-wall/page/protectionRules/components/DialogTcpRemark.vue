<template>
  <yd-dialog
    :close-on-click-modal="true"
    :visible.sync="open"
    title="策略备注"
  >
    <el-form :options="form">
      <el-input
        :rows="4"
        v-model="form.remark"
        type="textarea"
        placeholder="请输入内容"
      />
    </el-form>
    <div slot="footer">
      <el-button
        type="default"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="form.$processing"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import Form from '@/service/form'

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
      this.form = new Form(form)
    },
    handleClose() {
      this.open = false
    },
    // 保存备注
    async handleSubmit() {
      const {
        id,
        package_id,
        remark,
        status,
        action,
        action_data,
        rules
      } = this.form

      if (remark.length > 255) {
        this.$message.warning('备注内容过长，最大支持 255 个字符')
        return
      }

      const params = {
        id,
        package_id,
        remark,
        type: 'tcp',
        status,
        action,
        action_data,
        rules
      }

      this.form.submit()

      // 发送修改备注
      try {
        await this.WallResource.firewallPolicySave(params)
      } catch (e) {
        this.form.finish()
        return
      }
      this.form.finish()
      this.open = false
      this.$message.success('操作成功')
      this.$emit('on-success')
    }
  }
}
</script>
