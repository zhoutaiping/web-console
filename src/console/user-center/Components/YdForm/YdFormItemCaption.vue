<template>
  <el-form-item label="验证码" class="yd-form-item-caption">
    <el-input v-model="code" class="yd-form-item-caption__input"/>
    <el-button v-if="time === 0" :loading="capLoading" class="yd-form-item-caption__btn" type="primary" @click="getVerification">发送验证码</el-button>
    <el-button v-else disabled>{{ time }} 秒后可重发</el-button>
  </el-form-item>
</template>

<script>
import SourceUserResource from '../../assets/js/resource/SourceUserResource'

export default {

  components: {},
  props: {
    cap: [String, Number],
    type: String
  },

  data() {
    return {
      capLoading: false,
      time: 0,
      code: this.cap
    }
  },

  watch: {
    code(val) {
      this.$emit('change', val)
    },
    cap(val) {
      this.code = val
    }
  },

  methods: {
    // 发送验证码
    getVerification() {
      this.capLoading = true
      const { type } = this

      SourceUserResource.getMobileCap(type)
        .then(response => {
          const { code, message } = response.data.status
          if (code === 1) {
            this.$message.success('验证码发送成功')
            // 启动定时器
            this.verificationTimerStart()
            this.capLoading = false
          } else {
            this.$message.warning(message)
            this.capLoading = false
          }
        })
        .catch(response => {
          this.capLoading = false
        })
    },

    verificationTimerStart() {
      this.time = 59
      this.interval = setInterval(() => {
        this.timer()
      }, 1000)
    },
    timer() {
      this.time--
      if (this.time === 0) {
        clearInterval(this.interval)
      }
    }
  }
}
</script>
<style lang="scss">
.yd-form-item {
  &-caption {
    .el-form-item__content {
      display: flex;
    }
    &__input {
      flex: 1;
      margin-right: 10px;
    }
    &__btn {
      width: 120px;
      position: relative;
      margin: 1px;
    }
  }
}
</style>
