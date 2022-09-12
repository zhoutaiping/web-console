<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    :action-visible="false"
    width="500px"
    title="保存Client凭证"
    @submit="handleSubmit"
  >
    <DmAlert>
      保存后凭证不会再次出现，若未保存 Client Secret 凭证，该 Token 无法使用，需重新生成新的服务 Token 使用
    </DmAlert>
    <el-form
      label-width="100px"
      label-position="left"
    >
      <el-form-item
        label="Token 名称"
      >
        <el-input
          v-model="form.token_name"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="Client ID"
      >
        <el-input
          v-model="form.client_id"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="Client Secret"
      >
        <el-input
          v-model="form.client_secret"
          style="width: 280px"
        />
        <el-button
          style="margin-left: 8px"
          @click="Help.copyText(form.client_secret)"
        >复制</el-button>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="handleClose">已保存，关闭窗口</el-button>
    </template>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
    }
  },

  methods: {
    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
