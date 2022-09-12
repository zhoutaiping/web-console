<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增分组</el-button>
      <div slot="right">
        <yd-form-select
          :selects="selectType"
          v-model="bindParams.type"
          style="width: 140px; margin-right: 12px;"
        />
        <InputSearch
          v-model="bindParams.keyword"
          placeholder="请输入进行查询"
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
        <el-table :data="list">
          <el-table-column
            label="组名"
            min-width="200"
            prop="group_name"
          />
          <el-table-column
            label="备注"
            min-width="200"
            prop="remark"
          />
          <el-table-column
            label="修改时间"
            min-width="200"
            prop="updated_at"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="$refs.DialogRow.handleOpen(scope.row)"
                >编辑</el-button>
                <PopoverConfirm
                  content="确认删除"
                  @submit="handleRowDelete(scope.row)"
                >
                  <el-button type="text">删除</el-button>
                </PopoverConfirm>
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
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogRow from './components/DialogRow'

export default {
  components: { DialogRow },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/cloud.dns.domain.group.list',
      selectType: [
        {
          label: '按组名搜索',
          value: 'group_name'
        },
        {
          label: '按域名搜索',
          value: 'domain'
        }
      ],
      bindParams: {
        type: 'group_name',
        keyword: ''
      }
    }
  },

  methods: {
    formatParams(params) {
      const { type, keyword } = params
      return {
        ...params,
        [type]: keyword
      }
    },

    formatResponse(response) {
      return response
    },

    async handleRowDelete(row) {
      const { id: group_id } = row
      try {
        await this.Fetch.post('V4/cloud.dns.domain.group.del', { group_id })
      } catch (e) {
        return
      }
      this.fetchList()
    }
  }
}
</script>
