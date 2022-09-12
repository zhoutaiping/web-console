<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="设置健康检查"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 对于存在多个源IP，当安全节点在指定时间间隔内回源到某个源的连续失败次数超出预置次数范围后，将在指定时间内禁用此源IP。<br>
      2. 该配置仅针对四层转发规则生效，如需设置七层转发健康配置，请前往Web安全加速 > 域名控制台。
    </DmAlert>
    <el-form :model="form" label-width="160px">
      <el-form-item
        label="回源失败统计时间间隔"
        prop="fails_timeout"
      >
        <el-input-number
          v-model="form.fails_timeout"
          :min="0"
          :max="300"
          controls-position="right"
        />
        <span style="margin-left: 8px">秒</span>
      </el-form-item>
      <el-form-item
        label="回源失败次数统计"
        prop="max_fails"
      >
        <el-input-number
          v-model="form.max_fails"
          :min="0"
          :max="1000"
          controls-position="right"
        />
        <span style="margin-left: 8px">次</span>
      </el-form-item>
      <el-form-item
        label="切换到新源IP的保持时间"
        prop="keep_new_src_time"
      >
        <el-input-number
          v-model="form.keep_new_src_time"
          :min="0"
          :max="1800"
          controls-position="right"
        />
        <span style="margin-left: 8px">秒</span>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      formDefault: {
        package_id: '',
        fails_timeout: 0,
        max_fails: 0,
        keep_new_src_time: 0
      },
      formRules: {}
    }
  },

  methods: {
    async fetchSubmit() {
      await this.Fetch.post('V4/tjkd.plus.package.save.healthy.conf', this.form)
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
