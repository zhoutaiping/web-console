<template>
  <yd-dialog
    v-loading
    :class="b()"
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    aside
    aside-type="top"
  >
    <yd-alert style="margin-top: 12px">
      服务套餐中的套餐名称均为用户自定义名称，且保持实时更新。<br>
      内容集合：默认为同一内容集合内的内容做整合分析，若需针对某些内容进行单独的分析。<br>
      请点击“+”为服务类型新增内容集合。
    </yd-alert>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="top"
    >
      <el-form-item
        label="计划名称"
        prop="report_name"
      >
        <el-input
          id="report_name"
          v-model="form.report_name"
          style="width: 220px;"
          placeholder="计划名称"
        />
      </el-form-item>
      <el-form-item
        label="生成周期"
        prop="type"
      >
        <yd-form-select
          id="form_type"
          v-model="form.type"
          :selects="Label.TASK_CYCLE"
        />
      </el-form-item>
      <el-form-item label="计划说明">
        <el-input
          v-model="form.remark"
          :autosize="{ minRows: 2, maxRows: 2}"
          style="width: 400px"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="报告内容">
        <FormReportList
          ref="formReportList"
          v-model="form.params"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="text"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import moment from 'moment'
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import DmTable from '@/components/Dm/DmTable'
import Label from '../../../constants/label'
import FormReportList from '../../../components/FormReportList'

const FORM = {
  report_name: '',
  daterange: [],
  task: false,
  task_name: '',
  params: {}
}

export default create({
  name: 'DialogAdd',

  components: { DmTable, FormReportList },

  data() {
    return {
      Label,
      loading: false,
      title: '新增',
      open: false,
      form: {},
      formRules: {
        type: [
          { required: true, trigger: 'blur', message: '请选择' }
        ]
      }
    }
  },

  methods: {
    initReoprtName() {
      const time = moment().format('YYYY-MM-DD HH:mm:ss')
      return `${time}-周期报告`
    },

    handleSubmit() {
      const form = deepClone(this.form)
      if (!this.$refs.formReportList.checkForm()) return
      form.params = JSON.stringify(this.$refs.formReportList.getForm(form.params))
      if (!form.report_name) form.report_name = this.initReoprtName()
      delete form.daterange
      delete form.task
      // TODO
      form.start_time = Date.now() / 1000
      form.end_time = Date.now() / 1000

      this.$refs.form.validate(valid => {
        if (valid) this.$emit('submit', form)
      })
    },

    handleOpen(form) {
      const _form = deepClone(FORM)
      this.form = form ? Object.assign(_form, form) : _form
      this.title = form ? '编辑' : '新增'
      this.$refs.form && this.$refs.form.resetFields()
      this.$refs.formReportList && this.$refs.formReportList.initItem()
      this.open = true
    },

    handleClose() {
      this.open = false
    }
  }
})
</script>
