<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增应用</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.app_name"
          placeholder="应用名称"
          @submit="handleSearch"
        />
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
            label="应用名称"
            prop="app_name"
            min-width="150"
          />
          <el-table-column
            label="主机名"
            prop="host_name"
            min-width="150"
          />
          <el-table-column
            label="协议类型"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.app_protocol.toUpperCase() }}
            </template>
          </el-table-column>
          <el-table-column
            label="应用访问规则"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnRuleCount
                :bypass="scope.row.bypass_rule_count"
                :deny="scope.row.deny_rule_count"
                :allow="scope.row.allow_rule_count"
                @click="$refs.DialogRule.handleOpen(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.description || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
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
              >规则配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      application-type="protocol"
      @init="fetchList"
      @open-settings="handleOpenSettings()"
    />
    <DialogRule
      ref="DialogRule"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ColumnRuleCount from '../../components/ColumnRuleCount'
import DialogRow from './components/DialogRow'
import DialogRule from '../HostApplications/components/DialogRule'

export default {
  components: { PopoverEllipsis, DialogRow, DialogRule, ColumnRuleCount },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.app.list',
      bindParams: {
        app_name: '',
        app_type: 1
      },
      selectionId: []
    }
  },

  methods: {
    handleOpenSettings() {
      this.$refs.DialogRule.handleOpen(this.list[0])
    },

    handleCopy(text) {
      this.Help.copyText(text)
      this.$message.success('复制成功')
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.app_uid)
    },

    handleDelete() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('V4/zero.trust.app.del', { ids: this.selectionId })
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
