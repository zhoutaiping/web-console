<template>
  <DmCard
    :class="b()"
    :loading="loading"
    title="服务用量"
  >
    <el-button
      v-if="moduleSettings.home.showBuy"
      slot="action"
      type="text"
      @click="Help.openServicePanel(appAssets.afterKF)"
    >购买</el-button>
    <ItemUsed
      :percentage="sms.percentage"
      title="通知短信"
    >
      <template slot="tips">
        本月赠送{{ sms.total }}条/剩余{{ sms.surplus }}条
      </template>
    </ItemUsed>
    <ItemUsed
      :percentage="cdn.percentage"
      title="CDN加速流量"
    >
      <template slot="tips">
        本月赠送流量{{ cdn.total }}G/剩余{{ cdn.surplus }}G
      </template>
    </ItemUsed>
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import ItemUsed from '@/components/Item/ItemUsed'

export default create({
  name: 'CardUsed',

  components: { ItemUsed },

  data() {
    return {
      loading: true,
      sms: {
        total: 1000,
        surplus: 0,
        percentage: 0
      },
      cdn: {
        total: 1000,
        surplus: 0,
        percentage: 0
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const data = await this.Fetch.get('V4/overview.home.getsmsandcdn')
      const { sms, cdn } = this

      sms.total = data.sms_system_presented
      sms.surplus = data.sms_total
      this.percentageHander(sms)

      cdn.total = data.cdn_presenter_total
      cdn.surplus = (data.cdn_total + data.cdn_presenter_surplus).toFixed(2)
      this.percentageHander(cdn)
      this.loading = false
    },

    percentageHander(data) {
      const { total } = data
      const surplus = data.surplus < 0 ? 0 : data.surplus

      let percentage = 0
      if (surplus > total) percentage = 100
      if (total > 0) percentage = surplus / total * 100
      data.percentage = percentage
    }
  }
})
</script>
