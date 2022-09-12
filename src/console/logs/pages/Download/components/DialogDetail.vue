<style lang="scss">
.DownloadDialogDetail {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>

<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    :title="`任务详情（${form.task_name}）`"
    width="500px"
    class="DownloadDialogDetail"
    @submit="handleSubmit"
  >
    <el-form style="padding: 12px">
      <el-form-item label="任务名称">
        {{ form.task_name }}
      </el-form-item>
      <el-form-item label="关联模板">
        {{ form.template_name }}
      </el-form-item>
      <el-form-item label="域名">
        <template v-if="http_host.length">
          {{ (http_host.slice(0, 2)).join(', ') }}
          <template v-if="http_host.length > 2">
            <el-popover width="400">
              <el-tag
                v-for="domain in http_host"
                :key="domain"
                style="margin: 2px;"
              >
                {{ domain }}
              </el-tag>
              <el-button
                slot="reference"
                type="text"
                style="margin-left:10px;"
              >全部</el-button>
            </el-popover>
          </template>
        </template>
        <template v-else>
          暂无
        </template>
      </el-form-item>
      <el-form-item label="日志类型">
        {{ form.data_source_name }}
      </el-form-item>
      <el-form-item label="时间范围">
        {{ form.start_time }} - {{ form.end_time }}
      </el-form-item>
      <el-form-item label="文件类型">
        {{ form.file_type }}
      </el-form-item>
      <el-form-item label="任务状态">
        <template v-if="form.task_expire_desc">
          <div class="color--danger">{{ form.task_expire_desc }}</div>
        </template>
        <ColumnStatus
          v-else
          v-model="form.status"
        />
      </el-form-item>
      <!-- <el-form-item
        label="失败原因"
      >
        {{ form.result }}
      </el-form-item> -->
      <el-form-item label="下载字段">
        <ColumnListMore v-model="form.download_fields" />
      </el-form-item>
      <el-form-item label="限制条件">
        {{ formartVal(form.search_terms) }}
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import ColumnListMore from '@/components/Column/ColumnListMore'
import ColumnStatus from '../../../components/ColumnStatus'

export default createDialog({
  components: { ColumnListMore, ColumnStatus },

  data() {
    return {
      formDefault: {},
      http_host: []
    }
  },
  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.http_host = []
      const search_terms = JSON.parse(JSON.stringify(form.search_terms))
      if (search_terms && Object.keys(search_terms).length) {
        this.http_host = search_terms.http_host || []
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    },

    formartVal(data = {}) {
      const val = JSON.parse(JSON.stringify(data))
      delete val.http_host
      return val
    }
  }
})
</script>
