<template>
  <div>
    <!-- 僵尸网络IP过滤 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="僵尸网络IP过滤"
    >
      <template slot="tips">僵尸网络IP过滤</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.botipFilterSwitch"
        @change="adsFetchSaveSettings"
      />
    </CardItemForm>
  </div>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import adsMixins from '../../../mixins/ads'
import InputArea from '@/components/Input/InputArea'

export default {
  components: { SelectSwitch, InputArea },

  mixins: [adsMixins]
}
</script>
