<template>
  <DmCard
    :loading="loading"
    title="连接趋势"
  >
    <ChartLine
      :data="data"
      :options="options"
      :height="330"
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
      options: {
        baseUnit: '次',
        grid: {
          top: 40,
          left: 100
        }
      }
    }
  },

  methods: {
    async fetchData(params) {
      this.loading = true

      let data
      try {
        data = await this.$Ads.post('admin/analyzeConnect/query', params)
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
      delete data._status
      const rows = formatList(data)
      this.data = {
        columns: rows.length ? Object.keys(rows[0]) : [],
        rows
      }
    }
  }
})
</script>
