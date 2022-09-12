<template>
  <CardItemForm
    :is-init="true"
    :is-support="domainPlanInfo.meal_flag !== 'YD-WEBAQJS-TY'"
    :loading="false"
    title="WebSocket"
  >
    <template slot="tips">开启 WebSocket 服务</template>
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
  </CardItemForm>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import panelMixins from '../panelMixins'

export default {
  name: 'WebSocket',

  components: { SelectSwitch },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'websocket',
      formDefault: {
        status: 'off'
      }
    }
  }
}
</script>
