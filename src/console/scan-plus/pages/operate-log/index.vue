<style lang="postcss">
</style>

<template>
  <console-page-layout
    :class="b()"
    title="操作记录"
  >
    <DmToolbar>
      <template slot="right">
        <el-date-picker
          v-model="daterange"
          :picker-options="pickOption"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-DD"
          @change="handleChangeDate"
        />
        <InputSearch
          v-model="params.info"
          placeholder="日志关键字"
          @submit="handleSearch"
        />
        <el-button
          type="primary"
          @click="handleSearch"
        >查询</el-button>
        <el-button
          :loading="exportLoading"
          type="primary"
          @click="handleExport"
        >导出</el-button>
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      class="margin-top"
      @init="init"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            prop="created_at"
            label="操作时间"
            width="200px"
          />
          <el-table-column
            prop="op_object"
            label="操作对象"
            width="200px"
          />
          <el-table-column
            prop="client_ip"
            label="操作IP"
            width="200px"
          >
            <template slot-scope="scope">
              {{ scope.row.client_ip ? scope.row.client_ip : scope.row.ip }}
            </template>
          </el-table-column>
          <el-table-column
            prop="info"
            label="操作内容"
          />
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>

<script>
import create from '@/utils/create-basic'
import { mergeParams } from '@/utils/response'
import Fetch from '@/api/fetch'

export default create({
  name: '',

  data() {
    return {
      loading: true,
      exportLoading: false,
      list: [],
      params: {
        info: '',
        start_time: '',
        end_time: ''
      },
      daterange: '',
      pickOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },

  methods: {
    async handleExport() {
      this.exportLoading = true
      const data = await Fetch.get('/V4/common.member.logs.export')
      const a = document.createElement('a')
      a.setAttribute('href', data.key)
      document.body.appendChild(a)
      a.click()
      a.style.display = 'none'
      this.exportLoading = false
    },

    handleChangeDate(value) {
      if (value) {
        const [start_time, end_time] = value
        this.params.start_time = `${start_time} 00:00:00`
        this.params.end_time = `${end_time} 23:59:59`
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
    },

    handleSearch() {
      this.$refs.DmData.initPage()
    },

    async init(params) {
      params = params || this.$refs.DmData.getParams()
      this.loading = true
      try {
        const data = await Fetch.get('/V4/common.member.logs.list', mergeParams(params, this.params))
        const { list = [], total } = data
        this.list = list
        this.$refs.DmData.init({ total: Number(total) })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
