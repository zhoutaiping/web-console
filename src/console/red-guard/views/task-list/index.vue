<template>
  <console-page-layout>
    <DmToolbar>
      <yd-form-radio-button
        :radios="SELECT_STATUS"
        v-model="bindParams.status"
        @change="handleSearch"
      />
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
            prop="create_at"
            label="创建时间"
            min-width="150"
          />
          <el-table-column
            prop="type"
            label="操作类型"
            min-width="150"
          >
            <template slot-scope="scope">
              批量应用防护配置
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="Number(scope.row.status) === 1"
                class="color--danger"
              >
                执行中
              </span>
              <span
                v-else-if="Number(scope.row.status) === 2"
                class="color--danger"
              >
                失败
              </span>
              <span
                v-else
                class="color--success"
              >
                完成
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_at"
            label="详情"
            min-width="350"
          >
            <template slot-scope="scope">
              <a @click="handleRowDetail(scope.row)">
                应用模板：{{ scope.row.params.cdntpl_name }}，操作域名：{{ scope.row.total }}个
              </a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogDetail ref="DialogDetail" />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogDetail from './components/DialogDetail'

export default {
  components: { DialogDetail },

  mixins: [consoleData],

  data() {
    return {
      SELECT_STATUS: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '执行中',
          value: 1
        },
        {
          label: '已完成',
          value: 3
        }
      ],
      API_INDEX: 'V4/cdntpl.task.list',
      bindParams: {
        // type: 'settpl_apply',
        status: ''
      },
      selectionId: []
    }
  },

  methods: {
    handleRowDetail(row) {
      this.$refs.DialogDetail.handleOpen(row)
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
