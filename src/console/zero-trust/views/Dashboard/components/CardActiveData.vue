<template>
  <DmCard
    title="活跃数据分布总览"
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
        grid: {
          top: 40
        },
        baseUnit: ''
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
