<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <DmCard title="TOP20 热门URL">
          <DmTable
            :loading="loadingUrl"
            type="white"
            min-height
          >
            <el-table :data="tableUrl">
              <el-table-column label="URL">
                <template slot-scope="scope">
                  <el-tooltip placement="top">
                    <div slot="content">{{ scope.row.request_url }}</div>
                    <el-button
                      type="text"
                      style="padding: 0"
                      @click="copyAliasName(scope.row.request_url)"
                    >{{ scope.row.request_url }}</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="请求数"
                align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{ scope.row.count | formatNumber }} 次
                </template>
              </el-table-column>
              <el-table-column
                label="占比"
                width="100"
              >
                <template slot-scope="scope">
                  <ColumnRatio :value="scope.row.percent" />
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmCard>
      </el-col>
      <el-col :span="12">
        <DmCard title="TOP20 热门Referer">
          <DmTable
            :loading="loadingReferer"
            type="white"
            min-height
          >
            <el-table
              :data="tableReferer"
              style="width: 100%"
            >
              <el-table-column label="Referer">
                <template slot-scope="scope">
                  <el-tooltip placement="top">
                    <div slot="content">{{ scope.row.http_referer }}</div>
                    <el-button
                      type="text"
                      style="padding: 0"
                      @click="copyAliasName(scope.row.http_referer)"
                    >{{ scope.row.http_referer }}</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="请求数"
                align="right"
                width="100"
              >
                <template slot-scope="scope">
                  {{ scope.row.count | formatNumber }} 次
                </template>
              </el-table-column>
              <el-table-column
                label="占比"
                width="100"
              >
                <template slot-scope="scope">
                  <ColumnRatio :value="scope.row.percent" />
                </template>
              </el-table-column>
            </el-table>
          </DmTable>
        </DmCard>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { arraySum } from '@/utils/array'
import ColumnRatio from '@/components/Column/ColumnRatio'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import report from '../../mixins/report'

function formatList(list) {
  const count = arraySum(list.map(_ => Number(_.count)))
  list.forEach(item => {
    item.percent = item.count / count
  })
  return list
}

export default {
  components: {
    ColumnRatio,
    PopoverEllipsis
  },

  mixins: [report],

  data() {
    return {
      loadingUrl: true,
      loadingReferer: true,
      tableUrl: [],
      tableReferer: []
    }
  },

  watch: {
    utime() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const params = this.reportParams
      this.fetchUrl(params)
      this.fetchReferer(params)
    },

    async fetchUrl(params) {
      params = {
        ...params,
        top_size: 20,
        router: 'cdn.domain.url.top'
      }
      this.loadingUrl = true
      const { request_url_top = [] } = await this.Fetch.post('V4/stati.data.get', params)
      this.tableUrl = formatList(request_url_top)
      this.loadingUrl = false
    },

    async fetchReferer(params) {
      params = {
        ...params,
        top_size: 20,
        router: 'cdn.domain.referer.top'
      }
      this.loadingReferer = true
      const { http_referer_top = [] } = await this.Fetch.post('V4/stati.data.get', params)
      this.tableReferer = formatList(http_referer_top)
      this.loadingReferer = false
    },

    copyAliasName(text) {
      this.Help.copyText(text)
      this.$message.success('复制成功')
    }
  }
}
</script>
