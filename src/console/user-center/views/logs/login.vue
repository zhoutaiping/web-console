<template>
  <div>
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
            label="登录时间"
            min-width="180"
            prop="created_at"
          />
          <el-table-column
            label="登录IP"
            min-width="180"
            prop="ip"
          >
            <template slot-scope="{ row }">
              {{ row.ip }}
              <span v-show="row.client_port">： {{ row.client_port }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            label="登录IP归属地"
          >
            <template slot-scope="scope">
              {{ scope.row.ip_info.country
                ? scope.row.ip_info.country.names.en
                  + scope.row.ip_info.province.names.en
                  + scope.row.ip_info.city.names.en + ' '
                  + scope.row.ip_info.isp.names.en
              : '暂无' }}
            </template>
          </el-table-column>
          <el-table-column
            label="登录详情"
            min-width="150"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.detail">
                {{ scope.row.detail.opTypeView }}

                <template v-if="scope.row.detail.code === 1">
                  （成功）
                </template>
                <template v-if="scope.row.detail.error">
                  （{{ scope.row.detail.error }}）
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnList from '@/components/Column/ColumnList'

const OP_TYPE_MAP = {
  1: '登录',
  2: '登出',
  3: '锁定'
}

export default {
  components: { ColumnList },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'sso/V4/getLoginLog',
      bindParams: {
        // biz_type: '用户中心',
        // data_key: ''
      }
    }
  },

  methods: {
    formatResponse(response) {
      const { logList: list = [] } = response
      list.forEach(item => {
        if (item.detail) {
          item.detail.opTypeView = OP_TYPE_MAP[Number(item.detail.op_type)]
        }
      })
      return {
        total: Number(response.count),
        list
      }
    },

    async handleSearch(params) {
      const { start_time, end_time, keyword } = params
      this.bindParams.data_key = keyword
      this.bindParams.start_time = start_time
      this.bindParams.end_time = end_time
      this.$refs.DmData.initPage()
    }
  }
}
</script>
