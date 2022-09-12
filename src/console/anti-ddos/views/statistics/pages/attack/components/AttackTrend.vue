<template>
  <DmCard
    :loading="loading"
    title="攻击趋势"
  >
    <ChartLine
      :data="data"
      :options="options"
      :height="330"
      :loading="false"
      :data-empty="!loading && !data.rows.length"
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import moment from 'moment'

function formatList(list) {
  const nList = new Map()

  list.forEach(item => {
    const { time, packets, type } = item
    const mItem = nList.get(time)
    if (!mItem) {
      nList.set(time, {
        [type]: packets
      })
    } else {
      nList.set(time, {
        ...mItem,
        [type]: packets
      })
    }
  })

  const retList = []
  for (const [time, item] of nList.entries()) {
    retList.push({
      time: moment(time, 'x').format('YYYY-MM-DD HH:mm:ss'),
      ...item
    })
  }

  return retList
}

export default create({
  name: 'CardAttackIpTop',

  data() {
    return {
      loading: true,
      data: {
        columns: [],
        rows: []
      },
      bindParams: {},
      options: {
        yAxisType: ['bits'],
        grid: {
          top: 50,
          right: 50
        }
      }
    }
  },

  methods: {
    async init(params) {
      if (params) Object.assign(this.bindParams, params)

      this.loading = true
      const data = await this.$Ads.post('admin/analyzeAttack/ackTrend', {
        unit: 'bps',
        ...this.bindParams
      })
      delete data._status

      const rows = formatList(data)
      this.data = {
        columns: rows.length ? Object.keys(rows[0]) : [],
        rows
      }

      this.loading = false
    }
  }
})
</script>
