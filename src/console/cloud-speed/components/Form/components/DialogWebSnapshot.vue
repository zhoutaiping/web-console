<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    aside
    title="创建备份快照"
    append-to-body
    @submit="handleSubmit"
  >
    <DmAlert
      slot="header"
      style="margin-top: 12px"
    >
      1. 快照内容配置：当选择首页时，爬虫只抓取首页内容；如果配置了全站，则默认抓取网站5层共2000个页面。<br>
      2. 新增备份快照为单次抓取任务，爬虫将根据备份内容配置抓取网站内容，备份支持预览功能。
    </DmAlert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="130px"
    >
      <el-form-item
        label="快照名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="快照名称"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="备份内容配置">
        <yd-form-radio
          v-model="form.backup_content"
          :radios="BACKUPS_TYPE"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          :autosize="{ minRows: 4, maxRows: 4}"
          v-model="form.comment"
          style="width: 200px"
          placeholder="备注"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

const BACKUPS_TYPE = [
  {
    label: '首页',
    value: 0
  },
  {
    label: '全站',
    value: 1
  }
]

export default createDialog({
  data() {
    return {
      BACKUPS_TYPE,
      formRules: {},
      rules: {
        name: { required: true, message: '请填写快照名称' }
      },
      formDefault: {
        name: '',
        backup_content: 0,
        comment: ''
      }
    }
  },

  methods: {
    handleSubmit() {
      this.$emit('submit', this.form)
      this.handleClose()
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })
    }
  }
})
</script>
