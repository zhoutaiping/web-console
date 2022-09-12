<template>
  <div title="操作记录">
    <DmToolbar>
      <toolbar-log
        slot="right"
        ref="toolbar"
        @init="initSearch"
        @click-export="handleExport"
      />
    </DmToolbar>
    <DmData
      ref="dmData"
      @init="init"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            prop="created_at"
            label="操作时间"
            align="left"
            width="180"
          />
          <el-table-column
            prop="user_ip"
            label="操作IP"
            align="left"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.user_ip || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="package_name"
            label="操作套餐"
            align="left"
            width="180"
          />
          <el-table-column
            label="操作详情"
            align="left"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import TaichiPlusResource from '@/console/taichi-plus/resource/TaichiPlusResource'
import ToolbarLog from '@/components/Toolbar/ToolbarLog'
import { downloadFile } from '@/utils/export'
import Tjkd from '@/api/tjkd'

export default {
  components: {
    ToolbarLog
  },
  data() {
    return {
      loading: true,
      dateRange: '',
      dateRangeParam: '',
      datetime: '',
      startTimevalue2: '',
      endTimevalue2: '',
      pageSizes: [5, 10, 20],
      pageSize: 10,
      currentPage: 1,
      tableData: [],
      total: 0,
      tabLoading: true,
      list: [],
      pickOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    dateFun(time) {
      this.dateRangeParam = time
      this.getTableData()
    },

    initSearch() {
      this.$refs.dmData.initPage()
    },

    async handleExport(params) {
      Object.assign(params, this.params)
      const data = await Tjkd.plusOpLogExport(params)
      const { key } = data
      downloadFile(key)
    },

    async init(params) {
      this.loading = true
      Object.assign(params, this.$refs.toolbar.getParams())
      Object.assign(params, this.params)

      const { data } = await TaichiPlusResource.getLogTableData(params)
      const { list, total } = data.data
      this.$refs.dmData.init({ total: parseInt(total, 10) })
      this.list = list

      this.loading = false
    },

    getTableData(current, size) {
      if (current) {
        this.currentPage = current
        this.pageSize = size
      }
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        type: 'ForwardingRule',
        start_time: this.dateRangeParam ? this.dateRangeParam.slice(0, 10) + ' 00:00:00' : '',
        end_time: this.dateRangeParam ? this.dateRangeParam.slice(-10) + ' 23:59:59' : ''
      }
      this.getLogTableData(params)
    },

    getLogTableData(params) {
      this.tabLoading = true
      TaichiPlusResource.getLogTableData(params).then(response => {
        if (response.data.status.code === 1 && response.data.data) {
          const data = response.data.data
          this.total = Number(data.total)
          this.tableData = data.list
        } else {
          this.total = 0
          this.tableData = []
        }
        this.tabLoading = false
      })
    }
  }
}
</script>

