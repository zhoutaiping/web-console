<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="8">
        <CardIndexMultiple
          :data="indexs.cdn"
          title="CDN流量"
        />
      </el-col>
      <el-col :span="8">
        <CardIndexMultiple
          :data="indexs.area"
          title="大陆/海外流量"
        />
      </el-col>
      <el-col :span="8">
        <CardIndexMultiple
          :data="indexs.width"
          title="大陆/海外带宽"
        />
      </el-col>
    </el-row>
    <el-row
      v-if="appName === 'yundun'"
      :gutter="12"
      class="margin-top"
    >
      <el-col :span="12">
        <TableWebsiteFlowTop ref="TableWebsiteFlowTop" />
      </el-col>
      <el-col :span="12">
        <TableWebsiteWideTop ref="TableWebsiteWideTop" />
      </el-col>
    </el-row>
    <DmCard class="margin-top" style="min-height: 450px">
      <template slot="title">
        流量趋势
        <el-button
          v-if="flowChart.type === 'node'"
          size="mini"
          style="margin-left: 8px"
          @click="handleUnSelectLegend(flowChart.echarts, flowChart.data[flowChart.type].columns)"
        >取消选择</el-button>
      </template>
      <template slot="action">
        <yd-form-radio-button
          :radios="selectFlowType"
          v-model="flowChart.type"
          size="mini"
        />
      </template>
      <ChartLine
        v-if="flowChart.data[flowChart.type]"
        ref="ChartFlow"
        :loading="false"
        :data="flowChart.data[flowChart.type]"
        :options="flowChart.options"
        :height="450"
      />
    </DmCard>
    <DmCard class="margin-top" style="min-height: 450px">
      <template slot="title">
        带宽趋势
        <el-button
          v-if="widthChart.type === 'node'"
          size="mini"
          style="margin-left: 8px"
          @click="handleUnSelectLegend(widthChart.echarts, widthChart.data[widthChart.type].columns)"
        >取消选择</el-button>
      </template>
      <template slot="action">
        <yd-form-radio-button
          :radios="selectWidthType"
          v-model="widthChart.type"
          size="mini"
        />
      </template>
      <ChartLine
        v-if="widthChart.data[widthChart.type]"
        ref="ChartWidth"
        :loading="false"
        :data="widthChart.data[widthChart.type]"
        :options="widthChart.options"
        :height="450"
      />
    </DmCard>
  </div>
</template>

<script>
import moment from 'moment'
import CardIndexMultiple from '@/components/Card/CardIndexMultiple'
import CardIndexMultipleGrid from '@/components/Card/CardIndexMultipleGrid'
import { byteView, bitsView } from '@/utils/filter'
import consoleChart from '@/mixins/consoleChart'
import { handleUnSelectLegend } from '@/utils/chart'
import report from '../../mixins/report'
import CardChartCdn from './components/CardChartCdn'
import TableWebsiteFlowTop from './components/TableWebsiteFlowTop'
import TableWebsiteWideTop from './components/TableWebsiteWideTop'

function formatTotal(label, value = 0, format) {
  return {
    label,
    value: format(value)
  }
}

function formatDataM(data, columns, dateformat = 'M月D日 H:mm') {
  const x_data = data[0].x_data || []

  const [columnDate, ...columnsList] = columns
  const rows = x_data.map((time, index) => {
    const item = {
      [columnDate]: moment(time, 'YYYY-MM-DD HH:mm:ss').format(dateformat)
    }

    columnsList.forEach((column, cIndex) => {
      item[column] = data[cIndex].y_data[index]
    })

    return item
  })
  return {
    columns,
    rows
  }
}

export default {
  components: {
    CardChartCdn,
    CardIndexMultiple,
    CardIndexMultipleGrid,
    TableWebsiteFlowTop,
    TableWebsiteWideTop
  },

  mixins: [consoleChart, report],

  data() {
    return {
      handleUnSelectLegend,
      loading: true,
      indexs: {
        cdn: [],
        area: [],
        width: []
      },
      flowChart: {
        type: 'total',
        data: {
        },
        options: {
          grid: {
            top: 40
          },
          yAxisType: ['byte', '']
        }
      },
      widthChart: {
        type: 'type',
        data: {
        },
        options: {
          grid: {
            top: 40
          },
          yAxisType: ['bits', '']
        }
      },
      selectFlowType: [
        {
          label: '按总流量查询',
          value: 'total'
        },
        {
          label: '按大陆/海外流量查询',
          value: 'area'
        },
        {
          label: '按节点流量查询',
          value: 'node'
        }
      ],
      selectWidthType: [
        {
          label: '按命中/回源带宽查询',
          value: 'type'
        },
        {
          label: '按大陆/海外带宽查询',
          value: 'area'
        },
        {
          label: '按节点带宽查询',
          value: 'node'
        }
      ]
    }
  },

  watch: {
    utime() {
      this.init()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    init() {
      this.$nextTick(() => {
        const params = this.reportParams
        this.$refs.TableWebsiteFlowTop.fetchData(params)
        this.$refs.TableWebsiteWideTop.fetchData(params)
        this.fetchData(params)
        this.fetchCDN(params)
      })
    },

    async fetchCDN(params) {
      let data
      try {
        data = await this.Fetch.post('V4/stati.data.get', {
          router: 'cdn.domain.node.flow.bandwidth',
          ...params
        })
      } catch (e) {
        return
      }
      this.indexs.cdn = [
        formatTotal('回源流量', data.fetch_source_flow.total.total, byteView),
        formatTotal('命中缓存流量', data.hit_cache_flow.total.total, byteView),
        formatTotal('总流量', data.total_flow.total.total, byteView)
      ]

      this.flowChart.data.total = formatDataM([
        data.total_flow.trend,
        data.fetch_source_flow.trend,
        data.hit_cache_flow.trend
      ],
      ['时间', '总流量', '回源流量', '命中缓存流量']
      )

      this.widthChart.data.type = formatDataM([
        data.fetch_source_bandwidth.trend,
        data.total_bandwidth.trend
      ],
      ['时间', '回源带宽', '带宽']
      )

      let nodeData
      try {
        nodeData = await this.Fetch.post('V4/stati.data.get', {
          router: 'cdn.domain.node.flow.bandwidth.node',
          ...params
        })
      } catch (e) {
        return
      }

      this.widthChart.data.node = {
        columns: nodeData.node_bandwidth.length ? ['time', ...Object.keys(nodeData.node_bandwidth[0]).filter(_ => _ !== 'time')] : [],
        rows: nodeData.node_bandwidth
      }

      this.flowChart.data.node = {
        columns: nodeData.node_flow.length ? ['time', ...Object.keys(nodeData.node_flow[0]).filter(_ => _ !== 'time')] : [],
        rows: nodeData.node_flow
      }

      this.flowChart.echarts = this.$refs.ChartFlow.echarts
      this.widthChart.echarts = this.$refs.ChartWidth.echarts

      this.loading = false
    },

    async fetchData(params) {
      let data
      try {
        data = await this.Fetch.post('V4/stati.data.get', {
          router: 'cdn.domain.node.flow.bandwidth.cn2',
          ...params
        })
      } catch (e) {
        return
      }

      this.indexs.area = [
        formatTotal('中国大陆流量', data.internal_flow.total.total, byteView),
        formatTotal('海外优化流量', data.overseas_flow.total.total, byteView),
        formatTotal('亚太CN2流量', data.cn2_flow.total.total, byteView)
      ]

      this.flowChart.data.area = formatDataM([
        data.internal_flow.trend,
        data.overseas_flow.trend,
        data.cn2_flow.trend
      ],
      ['时间', '中国大陆流量', '海外优化流量', '亚太CN2流量']
      )

      this.indexs.width = [
        formatTotal('中国大陆', data.internal_bandwidth.max.max, bitsView),
        formatTotal('海外优化流量', data.overseas_bandwidth.max.max, bitsView),
        formatTotal('亚太CN2', data.cn2_bandwidth.max.max, bitsView)
      ]

      this.widthChart.data.area = formatDataM([
        data.internal_bandwidth.trend,
        data.overseas_bandwidth.trend,
        data.cn2_bandwidth.trend
      ],
      ['时间', '中国大陆', '海外优化流量', '亚太CN2']
      )
    },

    formatCardChart(data, blockOption) {
      const { columns, columnsKey } = blockOption
      const row = data[columnsKey[1]] && data[columnsKey[1]].trend.x_data || []
      let available = false
      const rows = []
      row.forEach((item, index) => {
        const arr = {}
        arr['时间'] = item
        columnsKey.forEach((column, cIndex) => {
          if (data[column]) {
            arr[columns[cIndex]] = data[column].trend.y_data[index]
            available = true
          }
        })
        rows.push(arr)
      })

      const nData = {
        columns,
        rows
      }
      return available ? nData : false
    }
  }
}
</script>
