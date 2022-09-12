<template>
  <div>
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
            prop="login_time"
            label="登录时间"
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
            min-width="120"
            prop="idp_type"
            label="身份认证方式"
          />
          <el-table-column
            prop="decision"
            min-width="80"
            label="结果"
          />
          <el-table-column
            label="操作"
            width="100"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowRemove(scope.row)"
              >撤销令牌</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'
import consoleData from '@/mixins/consoleData'
import { arrRemove } from '@/utils/array'

export default {
  components: { ToolbarLogCommon },

  mixins: [consoleData],

  data() {
    return {
      expandRowKeys: [],
      API_INDEX: 'V4/zero.trust.login.log',
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
    handleRowRemove(row) {
      this.$confirm('本次操作将会导致该用户已登录的所有应用登录过期，下次登录时将被要求重新身份认证，是否确认该操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loadingSubmit = true
        try {
          await this.Fetch.post('V4/zero.trust.remove.user.token', {
            user_identity: row.user_identity
          })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    handleRowClick(row) {
      const id = row.id
      if (this.expandRowKeys.includes(id)) {
        arrRemove(this.expandRowKeys, id)
      } else {
        this.expandRowKeys = [id]
      }
    },

    formatResponse(response) {
      response.list.forEach((item, index) => {
        item.id = index
      })
      return response
    },

    formatParams(params) {
      return {
        ...params,
        start_time: params.start_time,
        end_time: params.end_time,
        [this.searchType]: params.keyword
      }
    },

    async handleSearch(params) {
      this.bindParams = params
      this.$refs.DmData.initPage()
    }
  }
}
</script>
