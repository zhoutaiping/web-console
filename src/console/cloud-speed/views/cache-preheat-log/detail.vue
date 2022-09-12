<template>
  <div>
    <DmToolbar>
      <template slot="right">
        <yd-form-select
          :selects="selectResult"
          v-model="bindParams.result"
          default-text="操作结果"
          @change="handleSearch"
        />
        <InputSearch
          slot="right"
          v-model="bindParams.domain"
          @submit="handleSearch"
        />
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="域名"
            prop="domain"
            min-width="150"
          />
          <el-table-column
            label="URL"
            prop="url"
            min-width="250"
          />
          <el-table-column
            label="操作结果"
            prop="result"
            min-width="100"
          />
          <el-table-column
            label="原因"
            prop="message"
            min-width="250"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'

export default {
  components: { ToolbarLogCommon },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/Web.Domain.DashBoard.get.preheat.cache.detail',
      selectResult: [
        {
          label: '成功',
          value: 1
        },
        {
          label: '失败',
          value: 2
        },
        {
          label: '执行中',
          value: 3
        }
      ],
      bindParams: {
        domain: '',
        result: ''
      },
      selectionId: []
    }
  },

  methods: {
    formatParams(params) {
      return {
        ...params,
        task_id: this.$route.query.task_id
      }
    },

    formatResponse(response) {
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
