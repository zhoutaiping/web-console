<template>
  <yd-card
    horizontal
    title="永远在线"
  >
    <template slot="tips">当源站出现宕机，将已存在的网站快照内容提供访客访问。<br></template>
    <SelectSwitch
      v-if="isOpen"
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
    <template slot="tips">
      <template v-if="isRemain">未检测到网站快照，启用前请创建网站快照</template>
      <template v-else>请
      <TipsButton title="联系商务" /> 创建相应快照后，开启本功能</template>
    </template>
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import panelMixins from '../panelMixins'

export default {
  name: 'AlwaysOnline',

  components: {
    SelectSwitch
  },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'always_online',
      formDefault: {
        status: 'off'
      },
      alwaysOnline: {
        init: true,
        status: ''
      },
      isOpen: false,
      isRemain: false
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      const domainInfo = this.domainInfo
      const alwaysOn = domainInfo.alwaysOn
      if (alwaysOn.mirrorInfo) {
        this.isOpen = true
      } else {
        if (alwaysOn.remain) {
          this.isRemain = true
        }
      }
    }
  }
}
</script>
