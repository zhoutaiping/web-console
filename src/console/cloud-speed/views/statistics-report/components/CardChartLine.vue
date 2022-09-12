<template>
  <CardChart
    :loading="loading"
    :data="data"
    :tooltip="tooltip"
    :settings="settings"
    :title="title"
    height="350px"
  >
    <template slot="extra">
      <slot name="extra"/>
    </template>
  </CardChart>
</template>

<script>
import chartMixins from '@/mixins/chart'
import { formatData, tooltipAlone } from '@/utils/chart'

export default {
  name: 'CardChartVisit',

  mixins: [chartMixins],

  props: {
    title: String,
    apiUri: String,
    column: String
  },

  data() {
    return {
      // API_URI: 'GET V4/Web.Domain.Report.Visit.list',
      settings: {
        type: 'line'
      }
    }
  },

  methods: {
    startLoading() {
      this.loading = true
    },

    async init(params) {
      const data = await this.fetchData(params)
      const unit = this.getUnit(data)

      this.settings.yAxisName = [`单位（${unit}）`]
      this.tooltip = tooltipAlone(unit)
      this.updateData(formatData(data.trend, ['时间', this.column]))
    },

    async handleUpdate(data, itemArr) {
      const unit = this.getUnit(data)
      this.settings.yAxisName = [`单位（${unit}）`]
      this.tooltip = tooltipAlone(unit)
      this.updateData(formatData(data.trend, itemArr))
      this.loading = false
    }
  }
}
</script>
