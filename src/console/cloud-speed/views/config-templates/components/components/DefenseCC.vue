<template>
  <yd-card>
    <template slot="tips">
      <p>有效防止CC攻击。YUNDUN 全局默认对搜索引擎放行</p>
    </template>
    <yd-form-select
      slot="action"
      v-model="form.status"
      :selects="STATUS_OPTIONS"
      placeholder="请选择"
    />
    <DmAlert>
      <p>默认：系统只对灾难性攻击行为为用户进行安全拦截</p>
      <p>普通：系统会智能识别出可疑请求，并且自动选择合适的验证方式（建议正在遭受到CC攻击时开启）</p>
      <p>严格：建议仅在正在受到CC攻击且防御不佳时开启</p>
      <p>验证码：100%防御，对用户体验有一定影响</p>
    </DmAlert>
  </yd-card>
</template>

<script>
export default {
  data() {
    return {
      STATUS_OPTIONS: [
        {
          value: 'off',
          label: 'OFF'
        },
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'normal',
          label: '普通'
        },
        {
          value: 'strict',
          label: '严格'
        },
        {
          value: 'captcha',
          label: '验证码'
        }
      ],
      form: {
        status: 'off'
      }
    }
  },

  methods: {
    setForm(form) {
      const status = (form.status === 'off' || !form.status) ? 'off' : form.type
      Object.assign(this.form, {
        ...form,
        status
      })
    },

    getForm() {
      const status = this.form.status === 'off' ? 'off' : 'on'
      const type = this.form.status === 'off' ? '' : this.form.status
      return {
        status,
        type
      }
    }
  }
}
</script>
