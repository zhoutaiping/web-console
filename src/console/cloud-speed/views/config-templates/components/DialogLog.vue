<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    width="800px"
    title="修改记录"
  >
    <DmData
      ref="DmData"
      :auto-init="false"
      class="margin-top"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="create_at"
            label="操作时间"
            min-width="150"
          />
          <el-table-column
            prop="ip"
            label="操作IP"
            min-width="150"
          />
          <el-table-column
            prop="summary"
            label="操作内容"
            min-width="300"
          />
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import createDialog from '@/utils/createDialog'

export default createDialog({
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/cdntpl.oplog',
      bindParams: {
        id: ''
      }
    }
  },

  methods: {
    afterOpen(row) {
      this.bindParams.id = row.id
      this.$nextTick(() => {
        this.fetchList()
      })
    }
  }
})
</script>
