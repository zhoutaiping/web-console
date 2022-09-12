<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <!-- <InputSearch
          v-model="bindParams.name"
          @submit="handleSearch"
        /> -->
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
          @selection-change="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="分组名称"
            prop="group_name"
            min-width="150"
          />
          <el-table-column
            label="备注"
            prop="remark"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.remark || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="操作"
            align="right"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogRule.handleOpen(scope.row)"
              >分组配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
    <DialogRule
      ref="DialogRule"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogRow from './components/DialogRow'
import DialogRule from './components/DialogRule'

export default {
  components: { DialogRow, DialogRule },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.app.access.group.list',
      bindParams: {
        name: ''
      },
      selectionId: []
    }
  },

  methods: {
    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    handleDelete() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('V4/zero.trust.app.access.group.del', { group_ids: this.selectionId })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
}
</script>
