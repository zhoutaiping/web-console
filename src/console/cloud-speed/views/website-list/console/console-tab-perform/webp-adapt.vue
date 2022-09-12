<template>
  <yd-card
    horizontal
    title="WebP自适应"
  >
    <template slot="tips">性能优化智能判断浏览器是否支持 WebP，来决定返回 WebP 格式图片还是原图，从而减少网络传输消耗，优化图片渲染速度。此功能需要相应的资源启用了缓存。</template>
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
  name: 'WebAdapt',

  components: { SelectSwitch },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'WebP'
    }
  }
}
</script>
