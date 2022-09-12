<template>
  <div>
    <DmToolbar>
      <router-link :to="{name: 'cloud-speed.router.menaceAnalyze__Bot'}">
        <el-button>返回</el-button>
      </router-link>
    </DmToolbar>
    <div style="margin-top: 16px">
      <CardInfos
        :loading="loading"
        :data="dataInfos"
      />
    </div>
    <el-row
      :gutter="12"
      style="margin-top: 16px"
    >
      <el-col :span="16">
        <ChartMLine
          ref="ChartRequest"
          :options="{
            yAxisName: ['单位（次）'],
            baseUnit: '次',
          }"
          title="访问趋势"
        />
      </el-col>
      <el-col :span="8">
        <DmCard title="动静资源请求占比">
          <ChartMRing ref="ChartDynamicStatic" />
        </DmCard>
      </el-col>
    </el-row>
    <ChartTree
      ref="ChartTree"
      title="关联分析"
      style="margin-top: 16px"
    />
    <TableIPList
      ref="TableIPList"
      style="margin-top: 16px"
    />
    <TableUrlList
      ref="TableUrlList"
      style="margin-top: 16px"
    />
  </div>
</template>

<script>
import CardInfos from '@/components/Card/CardInfos'
import ChartMLine from './components/ChartMLine'
import ChartMRing from './components/ChartMRing'
import TableIPList from './components/TableIPList'
import TableUrlList from './components/TableUrlList'
import ChartTree from './components/ChartTree'
import ToolbarCC from '../../components/ToolbarCC'

export default {
  components: { CardInfos, ToolbarCC, ChartMLine, ChartMRing, TableIPList, TableUrlList, ChartTree },

  data() {
    return {
      loading: true,
      bindParams: {},
      dataInfos: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.loading = true
      const query = this.$route.query
      const data = await this.Fetch.post('V4/stati.data.get', {
        ...query,
        sub_domain: typeof query.sub_domain === 'string' ? [query.sub_domain] : query.sub_domain,
        bot_type: this.$route.params.id,
        router_type: 'bot',
        meal_flag: ['YD-WAFQJB'],
        router: 'bot.detail.unknown'
      })

      this.dataInfos = [
        {
          label: '总会话次数',
          value: data.total_count || '0'
        },
        {
          label: 'AI模型检测',
          value: data.ai_model ? '是' : '否'
        },
        {
          label: 'Bot疑似度',
          value: data.bot_probobility
        },
        {
          label: 'Web扫描行为',
          value: data.scan ? '是' : '否'
        },
        {
          label: '命中特征',
          value: data.bot_features.join(' | ')
        }
      ]

      this.$refs.ChartRequest.setData({
        请求次数: data.bot_request_times_trend,
        回源次数: data.bot_fetch_source_request_times_trend
      })

      this.$refs.TableIPList.setData(data.bot_ip_list)
      this.$refs.TableUrlList.setData(data.bot_path_list)
      this.$refs.ChartTree.setData(data.bot_ip_relation)

      this.$refs.ChartDynamicStatic.setData({
        columns: ['类型', '次数'],
        rows: [
          { '类型': '动态资源', '次数': data.dynamic_count },
          { '类型': '静态资源', '次数': data.static_count }
        ]
      })
      this.loading = false
    }
  }
}
</script>
