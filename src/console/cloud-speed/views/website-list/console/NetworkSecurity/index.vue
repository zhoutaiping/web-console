<template>
  <yd-card-list>
    <CardDDos />
    <CardNetwork />
  </yd-card-list>
</template>

<script>
import CardDDos from './components/CardDDos'
import CardNetwork from './components/CardNetwork'

export default {
  components: {
    CardDDos,
    CardNetwork
  }
}
</script>
