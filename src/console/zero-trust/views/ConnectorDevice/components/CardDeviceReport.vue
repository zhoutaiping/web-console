<template>
  <div>
    <DmCard
      :loading="loading"
      title="设备性能"
    >
      <SelectDateFilter
        slot="action"
        v-model="bindParams"
        style="margin-left: 10px"
        @change="init"
      />
      <ChartLine
        :data="pfData"
        :options="pfOptions"
        :height="330"
        :loading="loading"
        :data-empty="!loading && !pfData.rows.length"
      />
    </DmCard>
    <DmCard
      :loading="loading"
      class="margin-top"
      title="设备流量"
    >
      <ChartLine
        :data="flowData"
        :options="flowOptions"
        :height="330"
        :loading="loading"
        :data-empty="!loading && !flowData.rows.length"
      />
    </DmCard>
  </div>
</template>

<script>
import SelectDateFilter from '@/components/Select/SelectDateFilter'

export default {
  components: { SelectDateFilter },

  data() {
    return {
      loading: true,
      pfData: {
        columns: [],
        rows: []
      },
      pfOptions: {
        baseUnit: '%',
        labelMap: {},
        grid: {
          left: 70,
          top: 50,
          right: 50
        }
      },
      bindParams: {},
      flowData: {
        columns: [],
        rows: []
      },
      flowOptions: {
        yAxisType: ['byte', ''],
        labelMap: {},
        grid: {
          left: 70,
          top: 50,
          right: 50
        }
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      this.loading = true
      const data = await this.Fetch.post('V4/zero.trust.connector.device.report', {
        device_id: this.$route.params.deviceId,
        ...this.bindParams
      })

      const trend = data.trend
      this.formatDataM(trend, ['cpu_data', 'disk_data', 'memory_data'], 'pf')
      this.formatDataM(trend, ['nic_in_data', 'nic_out_data'], 'flow')
      this.loading = false
    },

    formatDataM(data, columns, key) {
      const rows = []
      const labelMap = {}
      const xData = data.x_data
      xData.forEach((item, index) => {
        const rowItem = {
          date: item
        }
        columns.forEach(key => {
          rowItem[key] = data[key].value[index]
          labelMap[key] = data[key].name
        })
        rows.push(rowItem)
      })

      this[`${key}Data`] = {
        rows,
        columns: ['date', ...columns]
      }
      this[`${key}Options`].labelMap = labelMap
    }
  }
}

</script>
