<template>
  <ConsolePageLayout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >添加业务</el-button>
      <div slot="right">
        <InputSearch />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="APP名称"
            prop=""
            min-width="150"
          />
          <el-table-column
            label="所属套餐"
            prop=""
            min-width="150"
          />
          <el-table-column
            label="套餐版本"
            prop=""
            min-width="150"
          />
          <el-table-column
            label="AccessKey"
            prop=""
            min-width="150"
          />
          <el-table-column
            label="到期时间"
            prop=""
            min-width="150"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button @click="$refs.DialogRow.handleOpen(scope.row)">编辑</el-button>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogRow from './components/DialogRow'

export default {
  components: { DialogRow },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: '',
      bindParams: {},
      selectionId: []
    }
  },

  methods: {
    formatResponse(response) {
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
