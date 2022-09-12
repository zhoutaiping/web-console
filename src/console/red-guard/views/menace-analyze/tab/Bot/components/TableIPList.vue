<template>
  <div>
    <!-- <DmToolbar>
      <div slot="right">
        <InputSearch />
      </div>
    </DmToolbar> -->
    <DmCard title="IP列表">
      <DmData
        ref="DmData"
        :auto-init="false"
        @init="initPage"
      >
        <DmTable :loading="loading">
          <el-table
            :data="list"
            @select="handleRowSelect"
            @select-all="handleRowSelect"
          >
            <el-table-column
              label="源IP"
              prop="ip"
              min-width="150"
            />
            <el-table-column
              label="所属源IP段"
              prop="ipsection"
              min-width="150"
            />
            <el-table-column
              label="Bot类型"
              prop="bot_name"
              min-width="150"
            />
            <el-table-column
              label="会话速度(次/分钟)"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.speed_per_minute }} 次/分钟
              </template>
            </el-table-column>
            <el-table-column
              label="会话开始时间"
              prop="start_time"
              min-width="180"
            />
            <el-table-column
              label="最后检测时间"
              prop="end_time"
              min-width="180"
            />
            <el-table-column
              label="会话总次数"
              prop="count"
              align="right"
              min-width="150"
            />
            <el-table-column
              label="会话持续时间"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.continue_time_seconds | formatSeconds }}
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
    </DmCard>
  </div>
</template>

<script>
import { vPagination } from '@/utils/array'

export default {
  data() {
    return {
      loading: false,
      list: [],
      selectionId: []
    }
  },

  methods: {
    setData(data) {
      this.listRaw = data
      this.$refs.DmData.init({ total: this.listRaw.length })
      this.$refs.DmData.initPage()
      this.initPage({ page: 1, per_page: 10 })
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    initPage(params) {
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    }
  }
}
</script>
