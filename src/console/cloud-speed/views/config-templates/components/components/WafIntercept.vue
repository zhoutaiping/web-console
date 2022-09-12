<template>
  <yd-card>
    <template slot="tips">
      <p>定制专属WAF拦截页面，不开启是默认使用WEB应用防火墙提供的拦截页面</p>
    </template>
    <yd-form-select
      slot="action"
      :selects="TYPE_OPTION"
      v-model="form.status"
      placeholder="请选择"
    />
    <DmAlert>
      当启用自定义HTML模式，可以通过编辑HTML代码自定义拦截页面，代码中不能包含JS
    </DmAlert>
    <el-form v-if="form.status === 'custom'">
      <el-form-item>
        <el-input
          :autosize="{ minRows: 10, maxRows: 20}"
          v-model="form.content"
          type="textarea"
          placeholder="<h1></h1>"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
export default {
  data() {
    return {
      TYPE_OPTION: [
        {
          value: 'default',
          label: '默认__companyEN__页面'
        },
        {
          value: 'custom',
          label: '自定义HTML'
        }
      ],
      form: {
        status: 'default',
        // type
        content: ''
      }
    }
  },

  methods: {
    setForm(form) {
      const status = (form.status === 'off' || !form.status) ? 'default' : form.type
      Object.assign(this.form, {
        ...form,
        status
      })
    },

    getForm() {
      const status = this.form.status === 'custom' ? 'on' : 'off'
      const type = this.form.status
      return {
        ...this.form,
        status,
        type
      }
    }
  }
}
</script>
