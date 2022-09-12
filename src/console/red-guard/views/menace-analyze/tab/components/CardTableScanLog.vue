<template>
  <DmCard title="扫描事件">
    <template slot="action">
      <yd-form-select
        :selects="Label.THREATEN_LEVEL"
        v-model="bindParams.waf_risk_score"
        style="width: 140px; margin-right: 12px"
        default-text="威胁等级"
        @change="handleSearch"
      />
      <InputSearch
        v-model="bindParams.remote_addr"
        style="width: 180px; margin-right: 12px"
        placeholder="攻击IP"
        @submit="handleSearch"
      />
      <InputSearch
        v-model="bindParams.http_host"
        style="width: 180px"
        placeholder="被攻击业务"
        @submit="handleSearch"
      />
    </template>
    <!-- TABLE -->
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="remoteView"
            label="扫描IP"
            min-width="220"
          />
          <el-table-column
            prop="start_time"
            label="开始时间"
            min-width="150"
          />
          <el-table-column
            prop="end_time"
            label="结束时间"
            min-width="150"
          />
          <el-table-column
            prop="sub_domain"
            label="业务"
            min-width="200"
          />
          <el-table-column
            prop="scanner_type"
            label="扫描器类型"
            min-width="150"
          />
          <el-table-column
            prop="all_attack_cnt"
            label="扫描次数"
            min-width="100"
          />
          <el-table-column
            label="威胁等级"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnThreatenLevel v-model="scope.row.waf_risk_score" />
            </template>
          </el-table-column>
          <el-table-column
            label="事件分析"
            min-width="100"
            align="right"
          >
            <template slot-scope="scope">
              <router-link :to="{
                name:'cloud-speed.router.menaceAnalyze__WAFAttack_ScanDetail',
                query:{
                  ...scope.row
                }
              }">
                <el-button type="text">详情</el-button>
              </router-link>
              <!-- <el-button
                type="text"
                @click="handleDetail(scope.row)"
              >详情</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogScanDetail ref="DialogScanDetail" />
  </DmCard>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogScanDetail from './components/DialogScanDetail'
import ColumnThreatenLevel from './components/ColumnThreatenLevel'
import Label from '@/console/cloud-speed/constant/label'

export default {
  components: { DialogScanDetail, ColumnThreatenLevel },

  mixins: [consoleData],

  data() {
    return {
      Label,
      API_METHOD: 'post',
      API_INDEX: 'V4/stati.data.get',
      bindParams: {
        router: 'waf.scan.event.list',
        remote_addr: '',
        http_host: '',
        waf_risk_score: ''
      }
    }
  },

  methods: {
    handleDetail(row) {
      this.$refs.DialogScanDetail.handleOpen(row)
    },

    formatResponse(response) {
      response.list.forEach(item => {
        item.remoteView = `${item.remote_addr} [${item.remote_addr_location}]`
      })
      return response
    }
  }
}
</script>
