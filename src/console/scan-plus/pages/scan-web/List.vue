<template>
  <div>
    <yd-alert class="margin-top">
      1. 添加漏扫任务代表用户默认同意 <a
        target="_blank"
        class="text--underline "
        href="/static/pdf/scan_agreement.pdf"
      >
        网站漏扫授权书
      </a> ， 用户需下载此授权书并签字（盖章）回传到上海云盾。<br>
      2. 用户需对所添加的网站拥有官方授予的操作权，任何信息伪造、欺骗行为，将由用户负全部法律责任。<br>
      3. 用户需知悉，漏扫会对网站造成一定影响。<br>
    </yd-alert>
    <DmToolbar>
      <div slot="right">
        <InputSearch
          v-model="bindParams.property_object"
          placeholder="请输入域名进行搜索"
          @submit="handleSearch"
        />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="资产"
            prop="property_object"
            min-width="180"
          />
          <el-table-column
            prop="scan_status"
            label="扫描状态"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnStatus
                v-model="scope.row.scan_status"
                :settings="consoleLabel.scanStatus"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="task_plan"
            label="扫描进度"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnProgress :percentage="Number(scope.row.task_plan * 100)" />
            </template>
          </el-table-column>
          <el-table-column
            label="漏洞个数"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnVulnerability
                :high="scope.row.level_high"
                :middle="scope.row.level_middle"
                :low="scope.row.level_low"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="开始时间"
          >
            <template slot-scope="scope">
              {{ scope.row.start_time ? scope.row.start_time : '—' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="结束时间"
          >
            <template slot-scope="scope">
              {{ scope.row.end_time ? scope.row.end_time : '—' }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="70"
            label="耗时"
            align="right"
          >
            <template slot-scope="scope">
              {{ (scope.row.start_time && scope.row.end_time) ? diffDate(scope.row.start_time, scope.row.end_time) : '—' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="240"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  :disabled="!scope.row.report"
                  type="text"
                  @click="handleRowDetail(scope.row)"
                >查看</el-button>
                <PopoverConfirm @submit="handleScanTaskAgain(scope.row.id)">
                  <el-button type="text">重新扫描</el-button>
                </PopoverConfirm>
                <el-dropdown>
                  <el-button type="text">
                    下载 <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <a
                        :disabled="!scope.row.report"
                        @click="handleDownload(scope.row)"
                      >
                        PDF
                      </a>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <a
                        :disabled="!scope.row.report"
                        @click="handleDownloadWord(scope.row)"
                      >
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
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnProgress from '@/components/Column/ColumnProgress'
import PopoverConfirm from '@/components/Popover/PopoverConfirm'
import ColumnVulnerability from '@/components/Column/ColumnVulnerability'
import diffDate from '@/utils/diffDate'
import { downloadFile } from '@/utils/export'

export default {
  components: { ColumnProgress, ColumnVulnerability, PopoverConfirm },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/shield.scan.detail.list',
      bindParams: {
        property_object: ''
      },
      downloadUrl: '',
      previewUrl: '',
      selectionId: []
    }
  },

  methods: {
    diffDate,
    formatResponse(response) {
      this.downloadUrl = response.download_url
      this.previewUrl = response.preview_url
      return response
    },

    handleDownload({ scan_id, report }) {
      // window.open(`${this.downloadUrl}${scan_id}`)
      window.open(report.ch_pdf)
    },

    async handleDownloadWord({ scan_id }) {
      const res = await this.Fetch.get('V4/shield.scan.report.word', {
        scan_id
      })
      downloadFile(res.ch_word)
    },

    handleRowDetail({ scan_id, report }) {
      // window.open(`${this.previewUrl}${scan_id}`)
      window.open(report.pre_report)
    },
    // 重新扫描
    async handleScanTaskAgain(scan_detail_id) {
      try {
        await this.Fetch.post('/V4/shield.scan.task.again', { scan_detail_id })
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
