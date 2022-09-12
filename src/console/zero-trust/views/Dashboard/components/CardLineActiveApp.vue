<template>
  <DmCard
    title="应用访问趋势"
  >
    <ChartLine
      :data="data"
      :options="options"
      :height="400"
    />
  </DmCard>
</template>

<script>
import ItemNumberLite from '@/components/Item/ItemNumberLite'

export default {
  components: { ItemNumberLite },

  props: {
    title: String
  },

  data() {
    return {
      data: {
        columns: [],
        rows: []
      },
      options: {
        tooltipHideZero: true,
        grid: {
          top: 40
        },
        baseUnit: '次'
      }
    }
  },

  methods: {
    setData(data) {
      this.data = data
    }
  }
}
</script>
