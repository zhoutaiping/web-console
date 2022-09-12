<template>
  <div :class="b()">
    <DmToolbar>
      <el-button
        :disabled="multipleSelection.length === 0"
        type="primary"
        @click="handleMultipleAction('start')"
      >扫描</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        @click="handleMultipleAction('delReport')"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="params.host_ip"
          placeholder="请输入主机IP进行查询"
          @submit="handleSearch"
        />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      :inner-card="false"
      class="margin-top"
      @init="init"
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
            label="主机名称"
            min-width="150"
            prop="plan_info.host_name"
          />
          <el-table-column
            label="主机IP"
            min-width="150"
            prop="plan_info.host_ip"
          />
          <el-table-column
            label="配置类型"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.plan_info.scan_type | labelView(Label.TIMING_SETTING) }}
            </template>
          </el-table-column>
          <el-table-column
            label="扫描情况"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnHostScanStatus :row="scope.row"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="task_plan"
            label="扫描进度"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnProgress :percentage="Number(scope.row.report_data.progress)"/>
            </template>
          </el-table-column>
          <el-table-column
            label="漏洞个数"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnVulnerability
                :low="scope.row.report_data.low_risk"
                :middle="scope.row.report_data.middle_risk"
                :high="scope.row.report_data.high_risk"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="最新扫描时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="操作"
            min-width="250"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <router-link
                  v-if="scope.row.status === 3"
                  :to="`detail/${scope.row.id}`"
                >
                  <el-button type="text">详情</el-button>
                </router-link>
                <el-button
                  v-else
                  disabled
                  type="text"
                >详情</el-button>
                <el-dropdown
                  trigger="click"
                  @command="handleDownload"
                >
                  <el-button
                    :disabled="scope.row.status !== 3"
                    type="text"
                  >下载报告</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="scope.row.download_url_cn">仅中文版</el-dropdown-item>
                    <el-dropdown-item :command="scope.row.download_url_en">仅英文版</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <PopoverConfirm content="本次重新扫描需要消耗扫描次数1次，并生成一份新的扫描报告" @submit="handleAction('start', scope.row)">
                  <el-button type="text">重新扫描</el-button>
                </PopoverConfirm>
                <PopoverConfirm
                  content="确认删除？"
                  @submit="handleAction('delReport', scope.row)"
                >
                  <el-button type="text">删除</el-button>
                </PopoverConfirm>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import Fetch from '@/api/fetch'
import { formatList } from '@/utils/response'
import { merge } from 'lodash/object'
import ColumnHostScanStatus from '../../components/ColumnHostScanStatus'
import ColumnVulnerability from '@/components/Column/ColumnVulnerability'
import ColumnProgress from '@/components/Column/ColumnProgress'
import PopoverConfirm from '@/components/Popover/PopoverConfirm'
import Label from '../../constants/label'
import { formatHostForm } from '../../constants/format'
import { downloadFile } from '@/utils/export'
import Lockr from 'lockr'

export default create({
  name: '',

  components: { ColumnHostScanStatus, ColumnProgress, ColumnVulnerability, PopoverConfirm },

  data() {
    return {
      Label,
      title: '',
      loading: true,
      list: [],
      params: {
        host_ip: ''
      },
      multipleSelection: []
    }
  },

  methods: {
    handleMultipleAction(action) {
      this.$confirm('确认操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleAction(action)
      })
    },

    async handleAction(action, row) {
      const params = {
        ope_action: action
      }

      if (action === 'delReport') params.report_id = row ? row.id : this.multipleSelection.map(_ => _.id).join(',')
      if (action === 'start') params.task_id = row ? row.plan_info.task_id : this.multipleSelection.map(_ => _.plan_info.task_id).join(',')

      try {
        await Fetch.post('/V4/host.scan.editPlanStatus', params)
      } catch (e) {
        return
      }
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.init()
    },

    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },

    handleSearch() {
      this.$refs.DmData.initPage()
    },

    handleDownload(url) {
      const user_id = Lockr.get('user_id')
      downloadFile(`${url}&user_id=${user_id}`)
    },

    async init(params) {
      params = params || this.$refs.DmData.getParams()
      this.loading = true
      try {
        const { list, total } = formatList(await Fetch.get('V4/host.scan.getDetailList', merge(params, this.params)))
        list.forEach(item => {
          item.status = Number(item.status)
          item.popoverAction = false
          formatHostForm(item.plan_info)
        })
        this.list = list
        this.$refs.DmData && this.$refs.DmData.init({ total })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
