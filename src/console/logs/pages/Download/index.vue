<template>
  <div>
    <DmAlert>
      1. 支持下载6个月内的攻击日志和访问日志<br>
      2. 支持API下载<br>
      3. 生成完成的日志将保存15天，过期需要新建任务重新下载，请在有效期内及时下载
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增任务</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleBathDownload()"
      >下载</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleCancel(selectedIds)"
      >取消</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleDelete(selectedIds)"
      >删除</el-button>
      <template slot="right">
        <yd-form-select
          :selects="Label.status"
          v-model="bindParams.status"
          style="width: 100px"
          default-text="任务状态"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="Label.data_source"
          v-model="bindParams.data_source"
          style="width: 100px"
          default-text="日志类型"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="Label.file_type"
          v-model="bindParams.file_type"
          style="width: 100px"
          default-text="文件类型"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.task_name"
          placeholder="任务名称"
          @submit="handleSearch"
        />
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="任务名称"
            prop="task_name"
            min-width="150"
          />
          <el-table-column
            label="日志类型"
            prop="data_source_name"
            min-width="150"
          />
          <el-table-column
            label="文件类型"
            prop="file_type"
            min-width="150"
          />
          <el-table-column
            label="任务状态"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnStatus v-model="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column
            label="任务进度"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnProgress :percentage="scope.row.percentage" />
            </template>
          </el-table-column>
          <el-table-column
            label="开始时间"
            prop="task_start_time"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.task_start_time || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="结束时间"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.task_end_time || '-' }}
              <template v-if="scope.row.task_expire_desc">
                <div class="color--danger">{{ scope.row.task_expire_desc }}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="200"
          >
            <template slot-scope="scope">
              <template v-if="[Label.status_var.STATUS_PROGRESS].includes(scope.row.status)">
                <el-button
                  type="text"
                  @click="handleCancel([scope.row.task_id])"
                >取消</el-button>
                <el-divider direction="vertical" />
              </template>
              <template v-if="[Label.status_var.STATUS_FAIL, Label.status_var.STATUS_CANCELLED].includes(scope.row.status)">
                <el-button
                  type="text"
                  @click="handleRegenerate(scope.row.task_id)"
                >重新生成</el-button>
                <el-divider direction="vertical" />
              </template>
              <el-button
                :disabled="!scope.row.download_url"
                type="text"
                @click="downloadFile(`${scope.row.download_url}`)"
              >下载</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="handleDelete([scope.row.task_id])"
              >删除</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogDetail.handleOpen(scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogDetail
      ref="DialogDetail"
    />
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import { downloadFile } from '@/utils/export'
import ColumnProgress from '@/components/Column/ColumnProgress'
import ColumnStatus from '../../components/ColumnStatus'
import DialogRow from './components/DialogRow'
import DialogDetail from './components/DialogDetail'
import Label from '../../constants/label'
import { fetchFields } from '../../constants/label'

export default {
  components: { ColumnProgress, ColumnStatus, DialogRow, DialogDetail },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/soc.log.download.task.list',
      bindParams: {
        task_name: '',
        status: '',
        file_type: '',
        data_source: ''
      },
      Label,
      selectionId: []
    }
  },

  computed: {
    selectedIds() {
      return this.multipleSelection.map(_ => _.task_id)
    }
  },

  async created() {
    this.Label = await fetchFields()
  },

  methods: {
    handleBathDownload() {
      if (this.multipleSelection.length > 10) {
        this.$message.warning('最多同时下载10个')
        return
      }
      this.multipleSelection.forEach((item, index) => {
        if (item.download_url) {
          setTimeout(() => {
            downloadFile(item.download_url)
          }, index * 1000)
        } else {
          this.$message.warning(`${item.task_name}未完成，无法下载`)
        }
      })
    },

    downloadFile,

    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        const status = Number(item.status)
        item.status = status
        let percentage = 0
        if (status === this.Label.status_var.STATUS_PROGRESS) {
          percentage = 50
        } else if (status === this.Label.status_var.STATUS_COMPLETE) {
          percentage = 100
        }
        item.percentage = percentage
      })
      return response
    },

    async handleRegenerate(task_id) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('V4/soc.log.download.task.regenerate', { task_id })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    async handleDelete(task_ids) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.delete('V4/soc.log.download.task.batch.del', { task_ids })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    async handleCancel(task_ids) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('V4/soc.log.download.task.batch.cancel', { task_ids })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    handleAction() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          // await this.Fetch.delete('V4/Web.ca.self.del', { ids: this.selectionId.join(',') })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
}
</script>
