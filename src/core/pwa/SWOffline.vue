<template>
  <DmDialog
    ref="Dialog"
    :close-on-click-modal="false"
    :action-visible="false"
    width="500px"
    title="连接错误"
  >
    连接服务器时遇到问题，请检查网络情况：网络已关闭或者防火墙或浏览器扩展(如广告拦截器)
    <template slot="footer">
      <el-button
        type="primary"
        @click="location.reload() "
      >刷新</el-button>
      <el-button @click="$refs.Dialog.handleClose()">忽略</el-button>
    </template>
  </DmDialog>
</template>

<script>
import create from '@/utils/create-basic'
import event from './event'

export default create({
  name: 'SWOffline',

  data() {
    return {
      location: window.location
    }
  },

  created() {
    event.$on('sw-ready', this.onSWReady)
    event.$on('sw-offline', this.onSWOffline)
  },

  methods: {
    onSWReady() {
      console.log(11)
    },

    onSWOffline() {
      this.$refs.Dialog.handleOpen()
    }
  }
})
</script>
