<template>
  <console-page-layout>
    <ToolbarLogCommon @submit="handleToolbarSubmit"/>
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
            label="操作时间"
            min-width="180"
            prop="created_at"
          />
          <el-table-column
            label="操作对象"
            min-width="200"
            prop="domain"
          />
          <el-table-column
            label="操作IP"
            min-width="150"
            prop="ip"
          />
          <el-table-column
            label="操作内容"
            min-width="300"
            prop="info"
          />
        </el-table>
      </DmTable>
    </DmData>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'

export default {
  components: { ToolbarLogCommon },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/common.member.logs.list',
      bindParams: {
        type: 2
      }
    }
  },

  methods: {
    handleToolbarSubmit(params) {
      Object.assign(this.bindParams, params)
      this.handleSearch()
    }
  }
}
</script>
