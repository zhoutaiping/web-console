<template>
  <DmCard title="访问URL分布">
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="initPage"
    >
      <DmTable :loading="loading">
        <el-table
          :data="list"
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            label="访问路径"
            prop="path"
            min-width="250"
          />
          <el-table-column
            label="会话次数"
            prop="count"
            min-width="150"
          />
          <el-table-column
            label="占比"
            prop="percent"
            min-width="150"
          />
        </el-table>
      </DmTable>
    </DmData>
  </DmCard>
</template>

<script>
import { vPagination } from '@/utils/array'

export default {
  data() {
    return {
      loading: false,
      list: [],
      selectionId: []
    }
  },

  methods: {
    setData(data) {
      this.listRaw = data
      this.$refs.DmData.init({ total: this.listRaw.length })
      this.$refs.DmData.initPage()
      this.initPage({ page: 1, per_page: 10 })
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    initPage(params) {
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    }
  }
}
</script>
