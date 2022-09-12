<style lang="scss">
.toolbarLog {
  .pull-right {
    > * {
      margin-left: 8px;
    }
  }
  overflow: hidden;
}
</style>

<template>
  <div
    :class="b()"
    grey
  >
    <div class="pull-right">
      <el-date-picker
        v-model="dateRange"
        :picker-options="pickerOptions"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-input
        v-model="params.keyword"
        placeholder="日志关键词"
        style="width: 180px"
      />
      <yd-form-select
        v-model="params.status"
        :selects="SELECT_STATUS"
        style="width: 100px"
      />
      <el-button
        type="primary"
        style="margin-right: 8px"
        @click="handleSearch"
      >查询</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import DateSelection from '@/components/DateSelect/date-selection'

const SELECT_BATCH = [
  {
    label: '操作类型',
    value: ''
  },
  {
    label: '单操作',
    value: 0
  },
  {
    label: '批量操作',
    value: 1
  }
]

const SELECT_STATUS = [
  {
    label: '状态',
    value: ''
  },
  {
    label: '成功',
    value: 1
  },
  {
    label: '失败',
    value: 0
  }
]

export default create({
  name: 'toolbarLog',

  data() {
    return {
      SELECT_BATCH,
      SELECT_STATUS,
      dateRange: '',
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() <= Date.now() - 3600 * 1000 * 24 * 30 ||
            time.getTime() >= Date.now()
          )
        }
      },
      params: {
        keyword: '',
        status: ''
      }
    }
  },

  components: { DateSelection },

  methods: {
    formatParams() {
      const params = { ...this.params }
      if (this.dateRange) {
        const [start_time, end_time] = this.dateRange
        if (start_time && end_time) {
          params.start_time = start_time + ' 00:00:00'
          params.end_time = end_time + ' 23:59:59'
        }
      }
      return params
    },

    handleSearch() {
      const params = this.formatParams()
      this.$emit('search', params)
    },

    handleExport() {
      const params = this.formatParams()
      this.$emit('export', params)
    }
  }
})
</script>
