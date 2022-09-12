<template>
  <div>
    <router-view
      :update-time="updateTime"
      @open-safe-verify="handleOpenSafeVerify"
    />
    <!-- 敏感操作身份验证 -->
    <yd-dialog-safe-verify
      ref="verify"
      :mobile="dialogSafeVerify.mobile"
      :group="dialogSafeVerify.group"
      @close="handleUpdate"
    />
  </div>
</template>

<script>
import moduleMixins from '@/mixins/module'
import router from './router'
import config from './config'
import YdDialogSafeVerify from './Components/YdDialog/YdDialogSafeVerify'
import authentiStore from './store/modules/authentiStore'

export default {
  components: {
    YdDialogSafeVerify
  },

  mixins: [moduleMixins],

  data() {
    return {
      config,
      menus: router.children,
      init: '',
      updateTime: '',
      dialogSafeVerify: {
        mobile: null,
        type: null
      }
    }
  },

  created() {
    this.$store.registerModule('authentiStore', authentiStore)
  },

  destroyed() {
    this.$store.unregisterModule('authentiStore')
  },

  methods: {
    handleUpdate() {
      this.updateTime = Date.now()
    },
    // 启动安全验证
    handleOpenSafeVerify(form) {
      const { mobile, group } = form
      this.dialogSafeVerify.mobile = mobile
      this.dialogSafeVerify.group = group
      this.$refs.verify.open()
    }
  }
}
</script>
