<template>
  <yd-card-list>
    <CardWebSnapshot
      :is-init="!!info.domain"
      :is-support="packageConfig.includes('snap')"
    />
    <CardContentReplace
      :is-init="!!info.domain"
      :is-support="packageConfig.includes('content_replace')"
    />
  </yd-card-list>
</template>

<script>
import domainMixins from '@/mixins/domain'
import CardContentReplace from './components/CardContentReplace'
import CardSensitive from './components/CardSensitive'
import CardWebSnapshot from './components/CardWebSnapshot'

export default {
  components: {
    CardContentReplace,
    CardSensitive,
    CardWebSnapshot
  },

  mixins: [domainMixins],

  props: {
    info: Object,
    packageConfig: Array
  },

  created() {
    this.domainFetchSettings(['safe_snap', 'content_replace'])
  }
}
</script>
