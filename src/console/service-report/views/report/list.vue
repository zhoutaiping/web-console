<template>
  <div :title="title">
    <yd-alert>
      自动报告默认生成时间为：下一周期首日生成上一周期的服务报告<br>
      若需创建每日定时计划（日报），您可以通过<el-button
        type="text"
        @click="handleAdd"
      >“立即生成”</el-button>进行配置
    </yd-alert>
    <DmToolbar style="margin-bottom: 12px">
      <el-button
        type="primary"
        @click="handleAdd"
      >立即生成</el-button>
      <template slot="right">
        <yd-form-select
          v-model="params.type"
          :selects="Label.TASK_CYCLE_ALL"
          default-text="全部周期"
          style="width: 120px"
        />
        <el-date-picker
          v-model="params.daterange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <InputSearch
          v-model="params.report_name"
          placeholder="支持报告或计划名称搜索"
        />
        <el-button
          type="primary"
          @click="handleSearch"
        >查询</el-button>
      </template>
    </DmToolbar>
    <DmData
      ref="dmData"
      :inner-card="false"
      @init="init"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <template slot="empty">
            暂未检测到报告生成计划，请您先<router-link to="../task/list">
              <el-button type="text">配置报告生成计划</el-button>
            </router-link>，以开启网站运营服务自动报告功能！
          </template>
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="report_name"
            label="报告名称"
            min-width="200"
          />
          <el-table-column
            label="开始时间"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss', 'X') }}
            </template>
          </el-table-column>
          <el-table-column
            label="结束时间"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss', 'X') }}
            </template>
          </el-table-column>
          <el-table-column
            label="计划名称"
            min-width="200"
            prop="plan_name"
          />
          <el-table-column
            label="周期"
            width="100"
          >
            <template slot-scope="scope">
              {{ Number(scope.row.type) | labelView(Label.TASK_CYCLE_ALL) }}
            </template>
          </el-table-column>
          <el-table-column label="生成状态">
            <template slot-scope="scope">
              <span
                v-if="scope.row.status !== '0'"
                class="color-success"
              >已完成</span>
              <span
                v-else
                class="color-warning"
              >待生成</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="140"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  :disabled="scope.row.status === '0'"
                  type="text"
                  @click="handleOpenReportUrl(scope.row.token, scope.row.report_path_type)"
                >
                  查看
                </el-button>
                <el-dropdown>
                  <el-button type="text">
                    下载 <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="Number(scope.row.status) === 1 || Number(scope.row.status) === 2">
                      <a @click="handleOpenUrl('/api/V4/statistics/downloadPdfReport?token=' + scope.row.token + '&file_name=' + scope.row.report_name + '.pdf'+ '&file_type=pdf')">
                        PDF
                      </a>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="Number(scope.row.status) === 2">
                      <a @click="handleOpenUrl('/api/V4/statistics/downloadPdfReport?token=' + scope.row.token + '&file_name=' + scope.row.report_name + '.docx'+ '&file_type=docx')">
                        Doc
                      </a>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAdd
      ref="dialogAdd"
      @submit="handleAddSubmit"
    />
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import Fetch from '@/api/fetch'
import DmData from '@/components/Dm/DmData'
import DmToolbar from '@/components/Dm/DmToolbar'
import DmTable from '@/components/Dm/DmTable'
import InputSearch from '@/components/Input/InputSearch'
import DialogAdd from './components/DialogAdd'
import Label from '../../constants/label'
import { formatList } from '@/utils/response'
import { deepClone } from '@/utils'
import { setTimeout } from 'timers'

export default create({
  name: '',

  data() {
    return {
      title: '服务报告',
      loading: true,
      Label,
      list: [],
      filters: {
        task: '1'
      },
      params: {
        daterange: [],
        report_name: '',
        start_time: '',
        end_time: '',
        type: ''
      },
      selectsTask: [
        {
          label: '每日定时计划列表',
          value: '1'
        }
      ]
    }
  },

  components: { DialogAdd, DmData, InputSearch, DmToolbar, DmTable },

  methods: {
    handleOpenReportUrl(token, report_path_type) {
      let url = ''
      if (report_path_type === 'new') url = '/console-service-report-new/' + token
      if (report_path_type === 'old') url = '/console-service-report/' + token
      if (url) window.open(url)
    },
    handleOpenUrl(url) {
      window.open(url)
    },
    async init(params) {
      params = params || this.$refs.dmData.getParams()
      this.loading = true
      params = {
        ...params,
        ...this.params
      }
      delete params.daterange
      try {
        const { list, total } = formatList(await Fetch.post('V4/member.report.getReportList', params))
        this.list = list
        this.$refs.dmData.init({ total })
      } finally {
        this.loading = false
      }
    },

    async handleAddSubmit(form) {
      form = deepClone(form)
      delete form.startTime
      delete form.endTime
      const Dialog = this.$refs.dialogAdd
      Dialog.loading = true
      try {
        await Fetch.post('V4/member.report.addReport', form)
        setTimeout(() => {
          Dialog.handleClose()
        }, 547)
        this.$message.success('操作成功')
        this.init()
      } finally {
        Dialog.loading = false
      }
    },

    handleSearch() {
      const { params } = this
      const [start_time, end_time] = params.daterange ? params.daterange : []
      params.start_time = start_time ? `${start_time} 00:00:00` : ''
      params.end_time = end_time ? `${end_time} 23:59:59` : ''
      this.$refs.dmData.initPage()
    },

    handleAdd() {
      this.$refs.dialogAdd.handleOpen()
    }
  }
})
</script>
