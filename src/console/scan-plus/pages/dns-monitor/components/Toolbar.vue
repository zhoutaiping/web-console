<template>
  <DmToolbar>
    <yd-button-checkbox
      v-model="params.sub_domain"
      :checks="domainList"
      @submit="handleEmit"
    />
    <yd-form-select
      :selects="Label.ISP_TYPE"
      v-model="params.isp"
      default-text="全部运营商"
      style="width: 120px"
      @change="handleEmit"
    />
    <template slot="right">
      <dateSelection @timevalue="handleDateChange" />
    </template>
  </DmToolbar>
</template>

<script>
import moment from 'moment'
import DateSelection from '@/components/DateSelect/date-selection'
import Label from '../../../constants/label'

const DATE_FORMAT = 'YYYY-MM-DD'
const TODAY = moment().format(DATE_FORMAT)

export default {
  components: { DateSelection },

  data() {
    return {
      Label,
      selectValue: [],
      domainList: [],
      params: {
        isp: '',
        start_time: TODAY,
        end_time: TODAY,
        sub_domain: []
      }
    }
  },

  mounted() {
    this.initDomain()
  },

  methods: {
    async initDomain() {
      const data = await this.Fetch.post('V4/dns.hijack.task.domains')
      delete data._status
      this.domainList = data.map(_ => {
        return {
          label: _,
          value: _
        }
      })
    },

    handleEmit() {
      this.$emit('init', this.params)
    },

    handleDateChange(start_time, end_time) {
      this.params.start_time = start_time
      this.params.end_time = end_time
      this.$emit('init', this.params)
    }
  }
}
</script>
