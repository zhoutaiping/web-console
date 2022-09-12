<template>
  <el-row :gutter="12">
    <el-col
      v-for="(item, index) in items"
      :span="8"
      :key="index"
    >
      <DmCard>
        <BlockItemNumber
          :height="120"
          :ref="`Index${item.key}`"
          :options="item"
        />
      </DmCard>
    </el-col>
  </el-row>
</template>

<script>
import BlockItemNumber from '@/components/Block/BlockItemNumber'

export default {
  components: {
    BlockItemNumber
  },

  data() {
    return {
      items: [
        {
          title: '攻击总次数',
          key: 'Count',
          unit: '次'
        },
        {
          title: '攻击峰值',
          key: 'Max',
          unit: 'QPS'
        },
        {
          title: '肉鸡总数',
          key: 'HostCount',
          unit: '个'
        }
      ]
    }
  },

  methods: {
    startLoading() {
      this.$refs.IndexCount[0].startLoading()
      this.$refs.IndexMax[0].startLoading()
      this.$refs.IndexHostCount[0].startLoading()
    },

    async setData(data) {
      this.$refs.IndexCount[0].updateValue(data.cc_attack_total_times)
      this.$refs.IndexMax[0].updateValue(data.cc_attack_max_qps)
      this.$refs.IndexHostCount[0].updateValue(data.cc_attack_ip_count)
    }
  }
}
</script>
