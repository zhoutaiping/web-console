<style lang="postcss">
</style>

<template>
  <console-page-layout
    :title="title"
    :class="b()"
  >
    <DmToolbar>
      <div slot="right">
        <InputSearch/>
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      class="margin-top"
      @init="init"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="攻击IP"
            min-width="200"
            prop="atk_ip"
          />
          <el-table-column
            label="攻击端口"
            min-width="80"
            prop="atk_port"
          />
          <el-table-column
            label="攻击域名"
            min-width="200"
            prop="atk_domain"
          />
          <el-table-column
            label="攻击类型"
            min-width="100"
            prop="atk_type"
          />
          <el-table-column
            label="攻击URL"
            min-width="200"
            prop="atk_url"
          />
          <el-table-column
            label="攻击IP位置"
            min-width="150"
          >
            <template slot-scope="{ row }">
              {{ `${row.atk_ip_location_state} - ${row.atk_ip_location_province}（${row.atk_ip_location_state}）` }}
            </template>
          </el-table-column>
          <el-table-column
            label="攻击协议"
            min-width="100"
            prop="c2_protocol"
          />
          <el-table-column
            label="家族类型"
            min-width="100"
            prop="threatname"
          />
          <el-table-column
            label="C2域名"
            min-width="100"
            prop="c2_domain"
          />
          <el-table-column
            label="C2IP"
            min-width="200"
            prop="c2_ip"
          />
          <el-table-column
            label="C2端口"
            min-width="100"
            prop="c2_port"
          />
          <el-table-column
            label="IP位置"
            min-width="150"
          >
            <template slot-scope="{ row }">
              {{ `${row.c2_ip_location_province} - ${row.c2_ip_location_city}（${row.c2_ip_location_state}）` }}
            </template>
          </el-table-column>
          <el-table-column
            label="攻击时间"
            min-width="150"
            prop="timestamp"
          />
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>

<script>
import create from '@/utils/create-basic'
import { formatList, mergeParams } from '@/utils/response'
import Fetch from '@/api/fetch'

export default create({
  name: '',

  data() {
    return {
      title: '监测详情',
      loading: true,
      list: [],
      params: {
        id: this.$route.params.id
      }
    }
  },

  computed: {},

  methods: {
    handleSearch() {
      this.$refs.DmData.initPage()
    },

    async init(params) {
      params = params || this.$refs.DmData.getParams()
      params.pagesize = params.per_page
      this.loading = true
      try {
        const { list, total } = formatList(await Fetch.post('/V4/ddos.monitor.events', mergeParams(params, this.params)))
        this.list = list
        this.$refs.DmData.init({ total })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
