<template>
  <console-page-layout>
    <el-row :gutter="12">
      <el-col :span="6">
        <DmCard :loading="loading.fetchDefenseCount">
          <ItemNumber
            v-model="defenseTotal.value"
            :unit="defenseTotal.unit"
            title="防护网站数量"
            color="success"
          />
        </DmCard>
      </el-col>
      <el-col :span="6">
        <DmCard :loading="loading.fetchAttackTotal">
          <ItemNumber
            v-model="attackTotal.value"
            :unit="attackTotal.unit"
            title="今日受攻击次数"
            color="danger"
          />
        </DmCard>
      </el-col>
      <el-col :span="6">
        <DmCard :loading="loading.fetchAttackIpCount">
          <ItemNumber
            v-model="attackIp.value"
            :unit="attackIp.unit"
            title="今日攻击IP个数"
            color="warning"
          />
        </DmCard>
      </el-col>
      <el-col :span="6">
        <DmCard :loading="loading.fetchDefenseCount">
          <ItemNumber
            v-model="attackType.value"
            :unit="attackType.unit"
            title="今日受攻击类型数"
          />
        </DmCard>
      </el-col>
    </el-row>
    <div class="margin-top">
      <el-row :gutter="12">
        <el-col :span="12">
          <DmCard
            :loading="loading.fetchWebShellList"
            title="近7天发现WebShell列表"
          >
            <DmTable>
              <el-table
                :data="webShellList"
                height="280px"
              >
                <el-table-column
                  label="WebShell"
                  prop="webshell"
                />
                <el-table-column
                  width="95"
                  label="发现时间"
                  prop="find_time"
                />
                <el-table-column
                  label="加固建议"
                  prop="suggestion"
                />
              </el-table>
            </DmTable>
          </DmCard>
        </el-col>
        <el-col :span="12">
          <DmCard
            :loading="loading.fetchAttackWebsite"
            title="TOP5 今日受攻击网站"
          >
            <DmTable>
              <el-table
                :data="attackWebsiteList"
                height="280px"
              >
                <el-table-column
                  label="网站"
                  prop="domain"
                />
                <el-table-column
                  label="总攻击次数"
                  prop="domain"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.count.data }}{{ scope.row.count.unit }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="总攻击类型"
                  prop="domain"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.waf_attack_name_count.data }}{{ scope.row.waf_attack_name_count.unit }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </DmCard>
        </el-col>
      </el-row>
    </div>
    <div class="margin-top">
      <DmCard
        :loading="loading.fetchTodayAttackLine"
        title="近7天攻击趋势"
      >
        <ChartLine
          :data="chart7d.data"
          :options="chart7d.options"
        />
      </DmCard>
    </div>
  </console-page-layout>
</template>

<script>
import { formatListDate } from '@/utils/chart'
import ItemNumber from '@/components/Item/ItemNumber'

function formatTotal(data, unit = '') {
  const key = Object.keys(data)[0]
  const value = data[key]
  const UNIT_MAP = {
    'Billion': '亿',
    'ten_thousand': '万',
    'single': ''
  }
  return {
    unit: (UNIT_MAP[key] || '') + unit,
    value
  }
}

export default {
  components: {
    ItemNumber
  },

  data() {
    return {
      attackTotal: {},
      attackType: {},
      attackIp: {},
      defenseTotal: {},
      // list
      attackWebsiteList: [],
      webShellList: [],
      // chart
      chart7d: {
        data: {},
        options: {
          labelMap: {
            value: '攻击次数'
          },
          grid: {
            top: 50
          }
        }
      },
      loading: {
        fetchWebShellList: true,
        fetchAttackTotal: true,
        fetchAttackIpCount: true,
        fetchDefenseCount: true,
        fetchAttackWebsite: true,
        fetchTodayAttackLine: true
      }
    }
  },

  mounted() {
    this.fetchWebShellList()
    this.fetchAttackTotal()
    this.fetchAttackIpCount()
    this.fetchDefenseCount()
    this.fetchAttackWebsite()
    this.fetchTodayAttackLine()
  },

  methods: {
    async fetchAttackTotal() {
      const data = await this.Fetch.get('V4/Web.Domain.Report.Hwws.wafAttackTimesAndAttackNameTimes')
      this.attackTotal = formatTotal(data.waf_attack_total_times_format, '次')
      this.attackType = formatTotal(data.waf_attack_name_times_format, '种')
      this.loading.fetchAttackTotal = false
    },

    async fetchAttackIpCount() {
      const data = await this.Fetch.get('V4/Web.Domain.Report.Hwws.wafAttackIpTimes')
      this.attackIp = formatTotal(data.waf_attack_ip_times_format, '个')
      this.loading.fetchAttackIpCount = false
    },

    async fetchDefenseCount() {
      const data = await this.Fetch.get('V4/Web.Domain.Report.Hwws.wafWebSiteCount')
      this.defenseTotal = formatTotal(data.count_format, '个')
      this.loading.fetchDefenseCount = false
    },

    async fetchAttackWebsite() {
      const data = await this.Fetch.get('V4/Web.Domain.Report.Hwws.wafAttackSite')
      this.attackWebsiteList = data.list.slice(0, 5)
      this.loading.fetchAttackWebsite = false
    },

    async fetchTodayAttackLine() {
      const data = await this.Fetch.get('V4/Web.Domain.Report.Hwws.wafAPTAttackLineDays')
      this.chart7d.data = formatListDate(data.trend)
      this.loading.fetchTodayAttackLine = false
    },

    async fetchWebShellList() {
      const data = await this.Fetch.get('V4/Web.Domain.DashBoard.getWebShell', {
        page: 1,
        per_page: 5,
        flag: 7
      })

      this.loading.fetchWebShellList = false
      this.webShellList = data.list
    }
  }
}
</script>

<i18n>
{
  "zh": {
    "top": {
      "protectedWebsites": "防护网站数量"
    }
  }
}
</i18n>
