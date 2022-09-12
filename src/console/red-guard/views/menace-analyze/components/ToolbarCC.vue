<template>
  <DmToolbar>
    <SelectWebsite
      ref="SelectWebsite"
      @submit="handleUpdateDomain"
    />
    <TipsTooltip v-if="$route.name === 'cloud-speed.router.menaceAnalyze__CCAttack'" style="margin-top: 8px" title="CC攻击分析数据为采样统计，实际攻击数据一般会远远大于采样数据" />
    <template slot="right">
      <SelectAutoRefresh
        v-if="type === 'today'"
        v-model="interval"
        @update="handleEmit"
      />
      <DateSelection
        custom-secound
        @change="handleDateChange"
      />
    </template>
  </DmToolbar>
</template>

<script>
import SelectAutoRefresh from '@/components/Select/SelectAutoRefresh'
import DateSelection from '@/components/DateSelect/DateSelection'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import SelectWebsite from './SelectWebsite'

export default {
  components: { SelectAutoRefresh, DateSelection, TipsTooltip, SelectWebsite },

  props: {
    mealFlag: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      type: 'today',
      domainList: [],
      params: {
        sub_domain: []
      },
      interval: 60
    }
  },

  mounted() {
    this.$refs.SelectWebsite.init({
      meal_flag: this.mealFlag
    })
  },

  methods: {
    handleDateChange(start_time, end_time, type) {
      this.type = type
      this.params.start_time = start_time
      this.params.end_time = end_time
      this.handleEmit()
    },

    handleEmit() {
      this.$emit('init', this.params)
    },

    handleUpdateDomain(value) {
      this.params.sub_domain = value.sub_domain
      this.handleEmit()
    }
  }
}
</script>
