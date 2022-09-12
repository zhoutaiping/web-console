<template>
  <DmCard title="防护IP攻击状态">
    <template slot="action">
      <yd-form-select
        :selects="adsSelectDefense"
        v-model="defenseId"
        default-text="全部"
        style="margin-right: 12px"
        @change="fetchSelectIP"
      />
      <yd-form-select
        :loading="loadingIP"
        :selects="selectIP"
        :disabled="loadingIP"
        v-model="bindParams.dstIp"
        default-text="所有目的IP"
        filterable
        @change="handleSearch"
      />
    </template>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="initPage"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            label="攻击时间"
            prop="start_time"
            min-width="150"
          />
          <el-table-column
            label="目的IP"
            prop="dst_ip"
            min-width="100"
          />
          <el-table-column
            label="攻击类型"
            prop="attack_type"
            min-width="100"
          />
          <el-table-column
            label="当前状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="Number(scope.row.status) === 1"
                class="color--danger"
              >受攻击</span>
              <span
                v-else
                class="color--success"
              >正常</span>
            </template>
          </el-table-column>
          <el-table-column
            label="入流量"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.total_bytes | bitsView }} / {{ scope.row.total_packets }} pps
            </template>
          </el-table-column>
          <el-table-column
            label="丢弃"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.total_drop_bytes | bitsView }} / {{ scope.row.total_drop_packets }} pps
            </template>
          </el-table-column>

          <el-table-column
            label="TCP新建连接数"
            prop="tcp_connect_pps"
            min-width="120"
          />
          <el-table-column
            label="TCP并发连接数"
            prop="tcp_connects"
            min-width="120"
          />
        </el-table>
      </DmTable>
    </DmData>
  </DmCard>
</template>

<script>
import { arrToSelect } from '@/utils/format'
import consoleData from '@/mixins/consoleDataAds'
import { vPagination } from '@/utils/array'
import adsMixins from '../../../../../mixins/ads'

export default {
  mixins: [consoleData, adsMixins],

  data() {
    return {
      defenseId: '',
      selectIP: [],
      bindParams: {
        dstIp: ''
      },
      loadingIP: false,
      listRaw: [],
      API_INDEX: 'admin/realtimeAttack/dstIpStatus'
    }
  },

  mounted() {
    this.adsFetchDefenseList()
    this.fetchSelectIP()
    this.fetchList()
  },

  methods: {
    formatResponse(response = []) {
      this.listRaw = response
      this.$refs.DmData.init({ total: this.listRaw.length })
      this.$refs.DmData.initPage()
      this.initPage({ page: 1, per_page: 10 })
    },

    initPage(params) {
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    },

    async fetchSelectIP(uuid) {
      this.loadingIP = true
      const list = await this.$Ads.get('admin/defense/getAllDefense', { ipList: true, uuid })
      delete list._status
      const selectIP = arrToSelect(list)

      this.loadingIP = false
      this.selectIP = selectIP
      this.bindParams.dstIp = ''
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
