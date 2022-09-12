<template>
  <DmCard :title="title">
    <ve-tree
      :data="data"
      :settings="settings"
      :extend="extend"
      :loading="loading"
      :tooltip="tooltip"
    />
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import Chart from '@/components/Chart/Chart'

export default create({
  name: 'ChartMLine',

  props: {
    title: String
  },

  components: {
    Chart
  },

  data() {
    return {
      loading: false,
      extend: {
        series: {
          roam: true,
          symbolSize: 7,
          label: {
            normal: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            }
          },
          leaves: {
            label: {
              normal: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            }
          }
        }
      },
      settings: {
        type: 'tree'
      },
      tooltip: {
        formatter: params => {
          const { name, value } = params
          return `${name}: ${value}`
        }
      },
      data: {}
    }
  },

  methods: {
    async setData(treeData) {
      this.data = {
        columns: ['name', 'value'],
        rows: [
          {
            name: '78887',
            value: [treeData]
          }
        ]
      }
      this.loading = false
    }
  }
})
</script>
