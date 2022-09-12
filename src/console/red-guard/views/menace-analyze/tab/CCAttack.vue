<template>
  <div>
    <ToolbarCC @init="fetchData" />
    <CardCCIndex
      ref="CardCCIndex"
      class="margin-top"
    />
    <CardCCTop
      ref="CardCCTop"
      class="margin-top"
    />
    <!-- CC攻击趋势 -->
    <CardCCAttack
      ref="CardCCAttack"
      class="margin-top"
    />
    <!-- CC攻击统计地图 -->
    <CardCCAttackMap
      ref="CardCCAttackMap"
      class="margin-top"
    />
    <CardAttackEvent
      ref="CardAttackEvent"
      class="margin-top"
    />
  </div>
</template>

<script>
import ToolbarCC from '../components/ToolbarCC'
import CardCCIndex from './components/CardCCIndex'
import CardCCTop from './components/CardCCTop'
import CardCCAttack from './components/CardCCAttack'
import CardCCAttackMap from './components/CardCCAttackMap'
import CardAttackEvent from './components/CardAttackEvent'

export default {
  components: { ToolbarCC, CardCCIndex, CardCCTop, CardCCAttack, CardCCAttackMap, CardAttackEvent },

  methods: {
    fetchData(params) {
      this.$nextTick(async() => {
        this.$refs.CardCCIndex.startLoading()
        this.$refs.CardCCTop.startLoading()
        this.$refs.CardCCAttack.startLoading()
        this.$refs.CardCCAttackMap.startLoading()

        const data = await this.Fetch.post('V4/stati.data.get', {
          router: 'cc.report.stats',
          ...params
        })
        this.$refs.CardCCIndex.setData(data)
        this.$refs.CardCCTop.setData(data)
        this.$refs.CardCCAttack.setData(data.cc_qps_line)
        this.$refs.CardCCAttackMap.setData({
          china: data.top_province,
          world: data.top_country
        })

        this.$refs.CardAttackEvent.fetchInit(params)
      })
    }
  }
}
</script>
