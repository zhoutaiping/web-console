<template>
  <div>
    <ToolbarLogCommon
      ref="toolbar"
      :show-keyword="false"
      @submit="fetchInit"
    >
      <yd-form-select
        :selects="selectStatus"
        v-model="bindParams.status"
        style="width: 150px"
        default-text="任务状态"
      />
    </ToolbarLogCommon>
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
            label="创建时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="操作类型"
            prop="typeView"
            min-width="150"
          />
          <el-table-column
            label="状态"
            prop="status"
            min-width="150"
          />
          <el-table-column
            label="描述"
            align="right"
            min-width="250"
          >
            <template slot-scope="scope">
              <router-link :to="{name: `cloud-speed.router.taskList__cleanCacheLog__Detail`, query: {task_id: scope.row.task_id}}">
                共执行{{ scope.row.total }}条，成功{{ scope.row.succeed }}条，失败{{ scope.row.failed }}条
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ToolbarLogCommon from '@/components/Toolbar/ToolbarLogCommon'

const TYPE_MAP = {
  URL: 'URL刷新',
  Domain: '域名刷新',
  SubDomain: '子域名刷新',
  Directory: '目录刷新'
}

export default {
  components: { ToolbarLogCommon },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/Web.Domain.DashBoard.cache.clean.list',
      selectionId: [],
      bindParams: {
        status: ''
      },
      selectStatus: [
        {
          label: '执行中',
          value: 1
        },
        {
          label: '完成',
          value: 2
        }
      ]
    }
  },

  methods: {
    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        item.typeView = TYPE_MAP[item.sub_type]
      })
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
