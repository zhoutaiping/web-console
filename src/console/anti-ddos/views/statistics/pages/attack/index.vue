<template>
  <div>
    <DmToolbar>
      <template slot="right">
        <yd-form-radio-button
          :radios="SelectTime"
          v-model="bindParams.timeType"
          @change="fetchData"
        />
      </template>
    </DmToolbar>
    <el-row :gutter="12">
      <el-col :span="12">
        <TOPAttackIP ref="TOPAttackIP" />
      </el-col>
      <el-col :span="12">
        <TOPAttackType ref="TOPAttackType" />
      </el-col>
    </el-row>
    <AttackTrend
      ref="AttackTrend"
      class="margin-top"
    />
  </div>
</template>

<script>
import TOPAttackIP from './components/TOPAttackIP'
import TOPAttackType from './components/TOPAttackType'
import AttackTrend from './components/AttackTrend'

export default {
  components: { TOPAttackIP, TOPAttackType, AttackTrend },

  data() {
    return {
      SelectTime: [
        {
          label: '15分钟',
          value: '15m'
        },
        {
          label: '30分钟',
          value: '30m'
        },
        {
          label: '1小时',
          value: '1h'
        },
        {
          label: '3小时',
          value: '3h'
        },
        {
          label: '1天',
          value: '1d'
        }
      ],
      bindParams: {
        timeType: '15m'
      }
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      const params = this.bindParams
      this.$nextTick(() => {
        this.$refs.TOPAttackIP.init(params)
        this.$refs.TOPAttackType.init(params)
        this.$refs.AttackTrend.init(params)
      })
    }
  }
}
</script>
