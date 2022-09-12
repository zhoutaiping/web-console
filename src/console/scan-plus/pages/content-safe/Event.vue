<template>
  <div>
    <DmToolbar>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAction('batchDel')"
      >删除</el-button>
      <yd-form-select
        v-model="bindParams.type"
        :selects="consoleLabel.contentSafe.risk_type"
        default-value=""
        default-text="全部"
        style="width: 140px"
        @change="handleSearch"
      />
      <el-date-picker
        v-model="dateRange"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="handleSearch"
      />
      <div slot="right">
        <yd-form-select
          :selects="selectType"
          v-model="bindParams.searchType"
          style="width: 100px; margin-right: 12px;"
        />
        <InputSearch
          v-model="bindParams.keyword"
          placeholder="请输入进行查询"
          @submit="handleSearch"
        />
        <el-button
          style="margin-left: 12px"
          @click="handleExport"
        >导出</el-button>
        <TipsTooltip style="margin-top: 8px">最大导出列表前5W行数据</TipsTooltip>
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
        <el-table
          :data="list"
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="domain"
            label="资产"
            min-width="140"
          />
          <el-table-column
            prop="port"
            label="监控端口"
            min-width="130"
          />
          <el-table-column
            prop="protocol"
            label="监控协议"
            min-width="130"
          />
          <el-table-column
            prop="url"
            label="URL"
            min-width="200"
          />
          <el-table-column
            label="类型"
            min-width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.typeView }}
            </template>
          </el-table-column>
          <el-table-column
            prop="detail"
            label="详情"
            min-width="150"
          />
          <el-table-column
            prop="firstTime"
            label="首次出现时间"
            min-width="150"
          />
          <el-table-column
            prop="lastTime"
            label="最近出现时间"
            min-width="150"
          />
          <el-table-column
            label="操作"
            align="right"
            width="180"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.type !== 'statusCode'">
                <a
                  :href="`${scope.row.externalSnapshot}`"
                  target="_blank"
                >
                  <el-button
                    :disabled="!scope.row.externalSnapshot"
                    type="text"
                  >
                    查看快照
                  </el-button>
                </a>
                <el-divider direction="vertical" />
              </template>
              <ColumnSelect
                v-model="scope.row.status"
                :selects="confirm_status"
                @change="val => handleViciousLinkStatusChange(val, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnSelect from '@/components/Column/ColumnSelect'
import { downloadFile } from '@/utils/export'

export default {
  components: { ColumnSelect },

  mixins: [consoleData],

  data() {
    return {
      dateRange: [],
      selectType: [
        {
          label: '域名',
          value: 'domain'
        },
        {
          label: 'URL',
          value: 'url'
        }
      ],
      confirm_status: [
        {
          label: '确认',
          value: true
        },
        {
          label: '忽略',
          value: false
        }
      ],
      API_INDEX: 'V4/content.safe.event.list',
      API_METHOD: 'post',
      bindParams: {
        searchType: 'domain',
        type: '',
        keyword: ''
      },
      selectionId: []
    }
  },

  methods: {
    formatResponse(response) {
      response.list.forEach(item => {
        item.typeView = response.event_type_map[item.type]
      })
      return response
    },

    async handleExport() {
      const params = { ...this.formatParams(this.bindParams) }
      const { export_url } = await this.Fetch.post('V4/content.safe.event.list', params)
      downloadFile(export_url)
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.uuid)
    },

    formatParams(params) {
      const { searchType, keyword } = params
      return {
        ...params,
        [searchType]: keyword,
        startTime: this.dateRange && this.dateRange[0] || '',
        endTime: this.dateRange && this.dateRange[1] || ''
      }
    },

    async handleViciousLinkStatusChange(status, row) {
      const op = status ? 'batchOn' : 'batchOff'
      await this.Fetch.post(`V4/content.safe.event.${op}`, {
        uuidList: [row.uuid]
      })
      row.status = status
      this.Message('ACTION_SUCCESS')
    },

    handleAction(operate) {
      this.$confirm('确认操作？', '提示', {
        type: 'warning'
      }).then(() => {
        this.fetchAction(operate)
      })
    },

    async fetchAction(operate) {
      await this.Fetch.delete(`V4/content.safe.event.${operate}`, {
        uuidList: this.selectionId
      })
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
