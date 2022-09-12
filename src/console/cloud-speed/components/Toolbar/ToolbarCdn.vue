<template>
  <DmToolbar>
    <SelectWebsiteGroup
      :children-visible="timeType === '3h'"
      @submit="handleDomainSelect"
    />
    <template slot="right">
      <SelectAutoRefresh
        v-if="timeType === '3h' || timeType === 'today'"
        v-model="interval"
        @change="handleUpdateInterval"
      />
      <yd-form-select
        v-show="['3h', 'today'].includes(timeType) && ['cloud-speed.router.statisticsReport__wideFlowRange', 'cloud-speed.router.statisticsReport__accessAnalysis'].includes($route.name)"
        v-model="params.interval"
        :selects="moduleLabel['cloud-speed'].TIME_GRANULARITY"
        style="width: 80px"
        @change="handleChangeTG"
      />
      <template>
        <DateSelection
          ref="dateSelection"
          v-model="selectType"
          :show3h="show3h"
          :start-date="surrpotStartDate"
          custom-secound
          @timevalue="handleDateChange"
        />
      </template>
    </template>
  </DmToolbar>
</template>

<script>
import moment from 'moment'
import DateSelection from '@/components/DateSelect/DateSelection'
import SelectAutoRefresh from '@/components/Select/SelectAutoRefresh'
import SelectWebsiteGroup from './SelectWebsiteGroup'
import report from '../../mixins/report'

const SURRPOT_START_DATE = new Date().setDate((new Date().getDate() - 31)) // Number(moment('2019-06-01', 'YYYY-MM-DD').format('x'))

export default {
  components: { DateSelection, SelectWebsiteGroup, SelectAutoRefresh },

  mixins: [report],

  props: {
    show3h: Boolean,
    advance: Boolean
  },

  data() {
    return {
      finish: false,
      loading: true,
      selectValue: [],
      domainList: [],
      selects: [],
      hasInterval: false,
      dateType: '',
      selectType: 'today',
      params: {
        start_time: '',
        end_time: '',
        nodes: [],
        group_id: [],
        sub_domain: [],
        sub_domains_and_node_ips: [],
        interval: '1m'
      },
      interval: 60,
      intervalFn: null,
      timeType: '',
      surrpotStartDate: SURRPOT_START_DATE
    }
  },

  watch: {
    show3h(value) {
      if (!value && this.selectType === '3h') {
        this.selectType = 'today'
        this.emitInit()
      }
    }
  },

  beforeDestroy() {
    this.stopInterval()
  },

  methods: {
    getParams() {
      const params = this.params
      if (this.timeType === '3h') {
        params.start_time = moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')
        params.end_time = moment().format('YYYY-MM-DD HH:mm:ss')
      }

      if (params.sub_domain.length === 0) {
        params.nodes = []
      }
      return params
    },

    handleChangeTG(value) {
      const D24 = Date.now() - 3600 * 1000 * 24 * 2
      this.surrpotStartDate = value === '1m' ? D24 : SURRPOT_START_DATE
      this.emitInit()
    },

    handleUpdateInterval() {
      clearInterval(this.intervalFn)
      this.startInterval()
    },

    stopInterval() {
      clearInterval(this.intervalFn)
    },

    startInterval() {
      this.stopInterval()
      this.intervalFn = setInterval(() => {
        this.SET_UTIME()
      }, this.interval * 1000)
    },

    emitInit() {
      this.$emit('init', {
        ...this.params
      })
    },
    // 选择域名
    handleDomainSelect(params) {
      Object.assign(this.params, params)
      this.emitInit()
    },
    // 日期选择切换
    handleDateChange(start_time, end_time, type) {
      this.params.start_time = start_time
      this.params.end_time = end_time
      this.params.interval = type === '3h' ? '1m' : '5m'
      this.timeType = type

      if (type === '3h' || type === 'today') {
        this.startInterval()
      } else {
        this.stopInterval()
      }

      this.emitInit()
    }
  }
}
</script>
