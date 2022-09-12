<template>
  <yd-dialog
    :visible.sync="visible"
    :modal="false"
    aria-modal
    title="提示"
    width="450px"
    @close="handleCancel"
  >
    <div
      class="el-icon-warning color--warning"
      style="display:inline-block; font-size: 35px;"
    />
    <div style="display: inline-block; width: 350px; margin-left: 10px;">
      检测到您的网站已绑定配置模板，继续操作将会自动解除配置模板的绑定关系
    </div>
    <template slot="footer">
      <router-link
        :to="{
          name: 'cloud-speed.router.configTemplates'
      }">
        <el-button
          type="primary"
          style="margin:0 10px;"
          plain
        >前往配置模板</el-button>
      </router-link>
      <el-button
        type="primary"
        @click="handleConfirm"
      >继续操作</el-button>
    </template>
  </yd-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },

  methods: {
    handleOpen(data) {
      this.visible = true
    },

    handleCancel() {
      this.$emit('cancel')
      this.visible = false
    },

    handleConfirm() {
      this.$emit('confirm')
      this.visible = false
    }
  }
}
</script>
