<template>
  <div>
    <Toolbar @init="fetchData" />
    <CardTableEvents ref="CardTableEvents" />
    <CardEventLine
      ref="CardEventLine"
      style="margin-top: 12px"
    />
    <CardEventMap
      ref="CardEventMap"
      style="margin-top: 12px"
    />
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import CardTableEvents from './components/CardTableEvents'
import CardEventLine from './components/CardEventLine'
import CardEventMap from './components/CardEventMap'

export default {
  components: {
    Toolbar,
    CardTableEvents,
    CardEventLine,
    CardEventMap
  },

  methods: {
    fetchData(params) {
      this.$refs.CardTableEvents.fetchList(params)
      this.$refs.CardEventLine.init(params)
      this.$refs.CardEventMap.init(params)
    }
  }
}
</script>
