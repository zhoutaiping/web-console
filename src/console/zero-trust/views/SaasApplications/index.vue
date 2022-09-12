<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogTemplate.handleOpen()"
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
            label="应用类型"
            prop="saas_app_type_name"
            min-width="150"
          />
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
            label="应用 ID"
            min-width="250"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.app_uuid"
                :url="false"
                :max-length="30"
                line-feed
              />
              <el-button
                type="text"
                @click="handleCopy(scope.row.app_uuid)"
              >复制</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="AUD 标签"
            min-width="250"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.aud"
                :url="false"
                :max-length="30"
                line-feed
              />
              <el-button
                type="text"
                @click="handleCopy(scope.row.aud)"
              >复制</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="80"
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
      @init="fetchList"
      @open-settings="handleOpenSettings()"
    />
    <DialogTemplate
      ref="DialogTemplate"
      @open="handleCreate"
    />
    <DialogRule
      ref="DialogRule"
      application-type="saas"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import DialogRow from './components/DialogRow'
import DialogTemplate from './components/DialogTemplate'
import DialogRule from '../HostApplications/components/DialogRule'
import ColumnRuleCount from '../../components/ColumnRuleCount'

export default {
  components: { PopoverEllipsis, DialogRow, DialogTemplate, DialogRule, ColumnRuleCount },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.app.list',
      bindParams: {
        app_name: '',
        app_type: 2
      },
      selectionId: []
    }
  },

  methods: {
    handleCreate(value) {
      this.$refs.DialogRow.handleOpen({
        app_name: value.app_type,
        app_logo: value.logo,
        saas_app_type: value.app_type,
        template_type_name: value.template_type_name,
        template_id: value.template_id
      })
    },

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
