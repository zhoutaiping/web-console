<template>
  <DmCard title="入侵事件">
    <template slot="action">
      <InputSearch
        v-model="bindParams.remote_addr"
        style="width: 160px; margin-right: 12px"
        placeholder="攻击IP"
        @submit="handleSearch"
      />
      <InputSearch
        v-model="bindParams.http_host"
        style="width: 160px"
        placeholder="被攻击业务"
        @submit="handleSearch"
      />
    </template>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="remoteView"
            label="攻击IP"
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
            prop="url"
            label="入侵对象"
            min-width="200"
          />
          <el-table-column
            label="事件类型"
            min-width="100"
          >
            <template slot-scope="scope">
              WebShell
            </template>
          </el-table-column>
          <el-table-column
            prop="webshell_type"
            label="入侵方式"
            min-width="100"
          />
          <el-table-column
            prop="all_attack_cnt"
            label="次数"
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
                name:'cloud-speed.router.menaceAnalyze__WAFAttack_WebShellDetail',
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
    <DialogWebShellDetail ref="DialogWebShellDetail" />
  </DmCard>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogWebShellDetail from './components/DialogWebShellDetail'
import ColumnThreatenLevel from './components/ColumnThreatenLevel'
import Label from '@/console/cloud-speed/constant/label'

export default {
  components: { DialogWebShellDetail, ColumnThreatenLevel },

  mixins: [consoleData],

  data() {
    return {
      Label,
      API_METHOD: 'post',
      API_INDEX: 'V4/stati.data.get',
      bindParams: {
        router: 'waf.webshell.event.list',
        waf_attack_name: '',
        remote_addr: '',
        http_host: ''
      }
    }
  },

  methods: {
    handleDetail(row) {
      this.$refs.DialogWebShellDetail.handleOpen(row)
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
