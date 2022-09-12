<template>
  <DmCard
    :loading="loading"
    title="网卡（接收流量）"
  >
    <ChartLine
      :data="data"
      :options="options"
      :height="300"
      :data-empty="!loading && !data.rows.length"
      :loading="false"
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import moment from 'moment'

function formatList(list) {
  const nList = new Map()

  list.forEach(item => {
    const { time, packets, id: type } = item
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
      this.loading = true
      const data = await this.$Ads.post('admin/analyzeAgentDevice/queryCard', {
        unit: 'bps',
        ...params
      })
      delete data._status

      this.data = {
        columns: ['time', '网卡0'],
        rows: formatList(data)
      }
      this.loading = false
    }
  }
})
</script>
