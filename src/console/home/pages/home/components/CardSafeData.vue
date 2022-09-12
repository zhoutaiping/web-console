<template>
  <DmCard
    :class="b()"
    :loading="loading"
    title="今日安全大数据"
  >
    <el-row>
      <el-col :span="12">
        <ItemNumber
          :value="waf_attack_total_times.value"
          :unit="waf_attack_total_times.unit"
          color="danger"
          title="WAF攻击次数"
        />
      </el-col>
      <el-col :span="12">
        <ItemNumber
          :value="cc_attack_total_times.value"
          :unit="cc_attack_total_times.unit"
          color="warning"
          title="CC攻击次数"
        />
      </el-col>
      <!-- <el-col :span="8">
        <ItemNumber
          :value="bandwidth.value"
          :unit="bandwidth.unit"
          title="DDoS攻击带宽峰值"
        />
      </el-col> -->
    </el-row>
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import ItemNumber from '@/components/Item/ItemNumber'
import { numView } from '@/utils/filter'

export default create({
  name: 'CardSafeData',

  components: { ItemNumber },

  data() {
    return {
      loading: true,
      cc_attack_total_times: {
        value: '--',
        unit: ''
      },
      waf_attack_total_times: {
        value: '--',
        unit: ''
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.loading = true
      this.fetchItem('cc.attack.times', 'cc_attack_total_times')
      this.fetchItem('waf.attack.times', 'waf_attack_total_times')
      this.loading = false
    },

    async fetchItem(router, key) {
      const data = await this.Fetch.post('V4/stati.data.get', {
        router
      })
      const value = numView(parseInt(data[key]), 1).split(' ')[0]
      const unit = numView(parseInt(data[key]), 1).split(' ')[1] + '次'
      this[key] = {
        value,
        unit
      }
    }
  }
})
</script>
