<template>
  <DialogForm
    ref="Dialog"
    :form-default="form"
    v-model="form"
    :rules="formRules"
    aside
    title-label="快照"
    @submit="handleSubmit"
  >
    <DmAlert
      slot="header"
      style="margin-top: 12px"
    >
      1. 快照内容配置：当选择首页时，爬虫只抓取首页内容；如果配置了全站，则默认抓取网站5层共2000个页面。<br>
      2. 每日定时更新：采取独家智能算法，每日抓取页面内容，若抓取失败，访客继续访问时，会再次抓取页面内容。<br>
      3. 创建快照后，系统会按照备份内容配置，开始抓取网站快照。
    </DmAlert>
    <el-form-item v-if="form.type === 1" label="备份名称">
      <el-input
        v-model="form.name"
        placeholder="备份名称"
        style="width: 200px"
      />
    </el-form-item>
    <el-form-item label="备份内容配置">
      <yd-form-radio
        v-model="form.backup_content"
        :radios="BACKUPS_TYPE"
      />
    </el-form-item>
    <el-form-item v-if="form.type === 0" label="更新间隔">
      <yd-form-select
        :selects="selectRegularUpdate"
        v-model="form.regular_update"
      />
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        :autosize="{ minRows: 4, maxRows: 4}"
        v-model="form.comment"
        style="width: 200px"
      />
    </el-form-item>
  </DialogForm>
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

const selectType = [
  {
    label: '系统镜像',
    value: 0
  },
  {
    label: '备份镜像',
    value: 1
  }
]

const selectRegularUpdate = [
  {
    label: '12小时',
    value: 12
  },
  {
    label: '1天',
    value: 24
  },
  {
    label: '不更新',
    value: 0
  }
]

export default createDialog({
  data() {
    return {
      BACKUPS_TYPE,
      selectType,
      selectRegularUpdate,
      formRules: {},
      formDefault: {
        name: '',
        domain: '',
        backup_content: 0,
        regular_update: 0,
        type: 0,
        comment: ''
      }
    }
  },

  methods: {
    async handleSubmit() {
      const form = {
        ...this.form,
        domain: [`http://${this.form.domain}`]
      }

      try {
        await this.Fetch.post('V4/replaceMirror.mirror.add', form)
      } catch (e) {
        this.resetSubmitLoading()
        return
      }
      this.Message('ACTION_SUCCESS')
      this.handleClose()
      this.$emit('init')
    }
  }
})
</script>
