<style lang="postcss">
</style>

<template>
  <div :class="b()">
    <el-row :gutter="12">
      <el-col :span="8">
        <yd-card
          :loading="loadingInfo"
          border
        >
          <el-table
            :data="info"
            :show-header="false"
            size="mini"
          >
            <el-table-column
              width="120px"
              prop="title"
            />
            <el-table-column prop="value"/>
          </el-table>
        </yd-card>
      </el-col>
      <el-col :span="16">
        <yd-card
          title="漏洞统计"
          border
        >
          <ItemNumber
            :loading="loadingInfo"
            v-model="index.count"
            title="漏洞总数"
          />
          <ItemNumberGroup style="margin-top: 22px">
            <ItemNumber
              :loading="loadingInfo"
              v-model="index.low"
              title="低危"
            />
            <ItemNumber
              :loading="loadingInfo"
              v-model="index.middle"
              title="中危"
              color="warning"
            />
            <ItemNumber
              :loading="loadingInfo"
              v-model="index.high"
              title="高危"
              color="error"
            />
          </ItemNumberGroup>
        </yd-card>
      </el-col>
    </el-row>
    <DmData
      ref="DmData"
      class="margin-top"
      @init="initPage"
    >
      <DmTable
        :loading="loadingInfo"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="漏洞名称"
            prop="nvt.name"
          >
            <template slot-scope="scope">
              {{ scope.row.nvt.name }}
              <!-- <el-tooltip
                :content="scope.row.description"
                placement="top-start"
              >
                {{scope.row.nvt.name}}
              </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column
            label="漏洞等级"
            width="120"
          >
            <template slot-scope="scope">
              <div>
                <ColumnStatus
                  v-model="scope.row.threat"
                  :settings="Label.REPORT_THREAT"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="修复建议"
            prop="nvt.parsetag.solution"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import Fetch from '@/api/fetch'
import ColumnScanStatus from '../../components/ColumnScanStatus'
import ItemNumber from '@/components/Item/ItemNumber'
import ItemNumberGroup from '@/components/Item/ItemNumberGroup'
import { labelView } from '@/utils/filter'
import Label from '../../constants/label'
import { vPagination } from '@/utils/array'

export default create({
  name: '',

  components: {
    ColumnScanStatus,
    ItemNumber,
    ItemNumberGroup
  },

  data() {
    return {
      Label,
      loadingInfo: true,
      loading: true,
      title: '',
      list: [],
      listRaw: [],
      params: {},
      index: {
        low: 0,
        middle: 0,
        high: 0,
        count: 0
      },
      info: [{
        title: '主机IP',
        value: '--'
      },
      {
        title: '扫描时间',
        value: '--'
      },
      {
        title: '耗时',
        value: '--'
      },
      {
        title: '扫描状态',
        value: '--'
      },
      {
        title: '剩余扫描次数',
        value: '--'
      }]
    }
  },

  computed: {},

  created() {
    this.init()
  },

  methods: {
    handleSearch() {
      this.$refs.DmData.initPage()
    },

    async init() {
      this.initInfo()
    },

    async initInfo() {
      const id = this.$route.query.id || this.$route.params.id // TODO
      const params = {
        id,
        type: 'getInfo'
      }
      this.loadingInfo = true

      let data
      try {
        data = await Fetch.post('/V4/host.scan.getDetailInfo', params)
      } catch (e) {
        this.$message({
          type: 'warning',
          message: '暂无数据'
        })
        this.loadingInfo = false
        return
      }
      this.info = [
        {
          title: '主机IP',
          value: data.plan_info.host_ip || '--'
        },
        {
          title: '扫描时间',
          value: data.report_data.scan_start || '--'
        },
        {
          title: '耗时',
          value: data.report_data.duration || '--'
        },
        {
          title: '扫描状态',
          value: labelView(Number(data.status), Label.HOST_SCAN_STATUS)
        },
        {
          title: '剩余扫描次数',
          value: data.host_scan_number || 0
        }
      ]

      this.index = {
        low: data.report_data.low_risk,
        middle: data.report_data.middle_risk,
        high: data.report_data.high_risk,
        count: Number(data.report_data.low_risk) + Number(data.report_data.middle_risk) + Number(data.report_data.high_risk)
      }

      if (data.report_data && data.report_data.reportData) {
        const total = data.report_data.reportData.length || 0
        this.$refs.DmData.init({ total })
        this.listRaw = data.report_data.reportData || []
        this.initPage({ page: 1, per_page: 10 })
      }
      this.loadingInfo = false
    },

    initPage(params) {
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    },

    handleAction(type, row) {

    }
  }
})
</script>
