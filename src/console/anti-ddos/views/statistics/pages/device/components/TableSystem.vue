<template>
  <DmCard
    :loading="loading"
    title="系统负载"
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
    const { time, data, type } = item
    const mItem = nList.get(time)
    if (!mItem) {
      nList.set(time, {
        [type]: data
      })
    } else {
      nList.set(time, {
        ...mItem,
        [type]: data
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
        yAxisName: [`单位（%）`],
        baseUnit: '%',
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
      const data = await this.$Ads.post('admin/analyzeAgentDevice/queryLoad', {
        ...params
      })

      const { list = [] } = data

      this.data = {
        columns: ['time', '内存', 'CPU'],
        rows: formatList(list)
      }
      this.loading = false
    }
  }
})
</script>
