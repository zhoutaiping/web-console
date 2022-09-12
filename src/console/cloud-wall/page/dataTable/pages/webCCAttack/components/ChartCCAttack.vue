<template>
  <DmCard
    :loading="loading"
    title="CC攻击趋势"
    height="400"
  >
    <template slot="action">
      <el-select
        v-model="params.sub_domain"
        :remote-method="fetchDomain"
        filterable
        remote
        reserve-keyword
        placeholder="选择域名"
        @change="fetchData"
      >
        <el-option
          v-for="item in selectDomain"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <SelectDateFilter
        v-model="params"
        style="margin-left: 10px"
        @change="fetchData"
      />
    </template>
    <ChartLine
      :loading="false"
      :data="chartData"
      :options="options"
      :height="350"
    />
  </DmCard>
</template>

<script>
import { formatData } from '@/utils/chart'
import ChartLine from '@/components/Chart/ChartLine'
import SelectDateFilter from '@/components/Select/SelectDateFilter'
import cwReport from '../../../../../mixins/cwReport'

export default {
  components: { ChartLine, SelectDateFilter },

  mixins: [cwReport],

  data() {
    return {
      loading: true,
      selectDomain: [],
      params: {
        sub_domain: 'all',
        start_time: '',
        end_time: '',
        port: []
      },
      chartData: {},
      options: {
        yAxisName: [`单位（QPS）`],
        baseUnit: 'QPS',
        grid: {
          top: 50
        }
      }
    }
  },

  watch: {
    'reportParams.package_id'(val) {
      this.fetchDomain()
    }
  },

  created() {
    this.fetchDomain()
  },

  methods: {
    async fetchDomain(domain) {
      const { package_id } = this.reportParams
      if (!package_id) return
      const data = await this.Fetch.get('V4/Tjkd.plus.package.domain.list', { package_id, domain, per_page: 100, page: 0 })
      const { list = [] } = data

      this.selectDomain = [{ label: '全部域名', value: 'all' }].concat(list.map(_ => {
        return {
          label: _.domain,
          value: _.domain
        }
      }))
    },

    async fetchData() {
      this.loading = true
      const params = {
        ...this.reportParams,
        ...this.params
      }

      const data = await this.Fetch.get('V4/statistic.tjkd.plus.web.cc.line', params)
      this.chartData = formatData(data.trend, ['时间', '攻击次数'])
      this.loading = false
    }
  }
}
</script>
