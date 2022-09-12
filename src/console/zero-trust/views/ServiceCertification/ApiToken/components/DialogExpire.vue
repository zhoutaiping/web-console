<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="延长期限"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-width="100px"
      label-position="left"
    >
      <el-form-item
        label="延长期限"
        prop="expire_flag"
      >
        <yd-form-select
          v-model="form.expire_flag"
          :selects="Selects.expire_flag"
          style="width: 300px"
        />
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
        expire_flag: 4
      },
      Selects: {
        expire_flag: [
          {
            label: '一个月',
            value: 1
          },
          {
            label: '三个月',
            value: 2
          },
          {
            label: '六个月',
            value: 3
          },
          {
            label: '一年',
            value: 4
          }
        ]
      }
    }
  },

  methods: {
    initOptions(form, options) {
    },

    async fetchSubmit() {
      const form = {
        ...this.form
      }
      try {
        await this.Fetch.post(`V4/zero.trust.api.token.extend.expiretime`, form)
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
