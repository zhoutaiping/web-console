<template>
  <console-page-layout>
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
            label="域名"
            prop="domain"
            min-width="250"
          />
          <el-table-column
            label="详情"
            min-width="450"
          >
            <template slot-scope="scope">
              <yd-badge
                v-if="scope.row.status === '0'"
                status="warning"
              >{{ scope.row.msg }}</yd-badge>
              <yd-badge
                v-if="scope.row.status === '1'"
                status="processing"
              >{{ scope.row.msg }}</yd-badge>
              <yd-badge
                v-if="scope.row.status === '2'"
                status="error"
              >{{ scope.row.msg }}</yd-badge>
              <yd-badge
                v-if="scope.row.status === '3'"
                status="success"
              >{{ scope.row.msg }}</yd-badge>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'

export default {
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/CloudDns.DomainRecords.batchDetail',
      bindParams: {
        job_id: this.$route.query.id
      }
    }
  },

  methods: {
    formatResponse(response) {
      const { detail: list = [], total } = response
      return {
        list,
        total
      }
    }
  }
}
</script>
