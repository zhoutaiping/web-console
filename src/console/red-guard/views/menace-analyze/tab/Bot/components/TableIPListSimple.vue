<template>
  <DmCard title="IP列表">
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
            label="源IP"
            prop="ip"
            min-width="150"
          />
          <el-table-column
            label="细分类型"
            prop="type"
            min-width="150"
          />
          <el-table-column
            label="命中次数"
            prop="count"
            align="right"
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
