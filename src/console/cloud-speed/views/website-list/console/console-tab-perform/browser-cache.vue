<template>
  <yd-card
    horizontal
    title="浏览器缓存优化"
  >
    <template slot="tips">通过移除响应头中 Entity Tags优化前端性能</template>
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import panelMixins from '../panelMixins'

export default {
  name: 'BrowserCache',

  components: { SelectSwitch },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'browser_cache'
    }
  }
}
</script>
