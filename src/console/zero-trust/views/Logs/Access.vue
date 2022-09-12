<template>
  <div>
    <DmAlert>
      1. 日志审计模块仅记录近30天内的日志信息<br>
      2. 若您需要下载更多日志请到 安全运营中心-YUNDUN Logs 模块操作
    </DmAlert>
    <ToolbarLogCommon @submit="handleSearch">
      <yd-form-select
        :selects="selectSearchType"
        v-model="searchType"
        style="width: 100px"
      />
    </ToolbarLogCommon>
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
          :expand-row-keys="expandRowKeys"
          row-key="id"
          @row-click="handleRowClick"
        >
          <el-table-column
            type="expand"
            width="1"
          >
            <template slot-scope="scope">
              <div style="padding: 0 15px">
                <el-input
                  :autosize="{
                    minRows: 5,
                    maxRows: 10
                  }"
                  :value="JSON.stringify(scope.row.user_info, null, '\t')"
                  readonly
                  type="textarea"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            prop="access_time"
            label="访问时间"
          />
          <el-table-column
            prop="user_name"
            label="用户名"
            min-width="150"
          />
          <el-table-column
            label="用户信息"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.user_info.email || scope.row.user_info.mobile }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            prop="remote_addr"
            label="登录IP"
          />
          <el-table-column
            min-width="150"
            prop="app_name"
            label="应用名称"
          />
          <el-table-column
            prop="app_domain_path"
            label="应用资源"
            min-width="280"
          />
          <el-table-column
            prop="decision"
            min-width="100"
            label="结果"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'
import consoleData from '@/mixins/consoleData'

export default {
  components: { ToolbarLogCommon },

  mixins: [consoleData],

  data() {
    return {
      expandRowKeys: [],
      API_INDEX: 'V4/zero.trust.access.log',
      bindParams: {},
      searchType: 'app_name',
      selectSearchType: [
        {
          label: '应用名称',
          value: 'app_name'
        },
        {
          label: '应用资源',
          value: 'app_domain_path'
        },
        {
          label: '用户名',
          value: 'user_name'
        },
        {
          label: 'IP',
          value: 'ip'
        }
      ]
    }
  },

  methods: {
    formatParams(params) {
      return {
        ...params,
        start_time: params.start_time,
        end_time: params.end_time,
        [this.searchType]: params.keyword
      }
    },

    formatResponse(response) {
      response.list.forEach((item, index) => {
        item.id = index
      })
      return response
    },

    handleRowClick(row) {
      const id = row.id
      if (this.expandRowKeys.includes(id)) {
        arrRemove(this.expandRowKeys, id)
      } else {
        this.expandRowKeys = [id]
      }
    },

    async handleSearch(params) {
      this.bindParams = params
      this.$refs.DmData.initPage()
    }
  }
}
</script>
