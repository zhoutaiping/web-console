<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增模板</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleChangeStatus(1, selectedIds)"
      >启用</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleChangeStatus(0, selectedIds)"
      >禁用</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleDelete(selectedIds)"
      >删除</el-button>
      <template slot="right">
        <yd-form-select
          :selects="selectStatus"
          v-model="bindParams.status"
          style="width: 100px"
          default-text="模板状态"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="selectGroup"
          v-model="bindParams.group_id"
          style="width: 100px"
          default-text="模板分组"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="Label.data_source"
          v-model="bindParams.data_source"
          style="width: 100px"
          default-text="日志类型"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.template_name"
          placeholder="模板名称"
          @submit="handleSearch"
        />
      </template>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="模板名称"
            prop="template_name"
            min-width="150"
          />
          <el-table-column
            label="模板分组"
            prop="group_name"
            min-width="80"
          />
          <el-table-column
            label="日志类型"
            prop="data_source_name"
            min-width="80"
          />
          <el-table-column
            label="下载字段"
            min-width="250"
          >
            <template slot-scope="scope">
              <ColumnListMore v-model="scope.row.download_fields" />
            </template>
          </el-table-column>
          <el-table-column
            label="限制条件"
            min-width="250"
          >
            <template slot-scope="scope">
              {{ formartVal(scope.row.search_terms) }}
            </template>
          </el-table-column>
          <el-table-column
            label="模板状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="value => handleChangeStatus(value, [scope.row.template_id])"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="created_at"
            min-width="120"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="handleDelete([scope.row.template_id])"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'
import DialogRow from './components/DialogRow'
import { fetchFields } from '../../constants/label'
import { deepClone } from '../../../../utils'

export default {
  components: { ColumnListMore, DialogRow },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/soc.log.download.template.list',
      bindParams: {
        status: '',
        template_name: '',
        data_source: '',
        group_id: ''
      },
      selectStatus: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ],
      selectionId: [],
      Label: {},
      selectGroup: []
    }
  },

  computed: {
    selectedIds() {
      return this.multipleSelection.map(_ => _.id)
    }
  },

  async created() {
    this.fetchGroups()
    this.Label = await fetchFields()
  },

  methods: {
    async fetchGroups() {
      const res = await this.Fetch.get('V4/soc.log.download.template.group.all')
      delete res._status
      this.selectGroup = res.map(_ => {
        return {
          value: _.group_id,
          label: _.group_name
        }
      })
    },
    formartVal(data) {
      const val = deepClone(data)
      delete val.http_host
      return val
    },
    handleEdit(data) {
      const newData = deepClone(data)
      newData.http_host = newData.search_terms.http_host || []
      const search_terms = deepClone(newData.search_terms)
      if (search_terms.http_host) delete search_terms.http_host
      newData.search_terms = search_terms
      this.$refs.DialogRow.handleOpen(newData)
    },
    async handleDelete(template_ids) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.delete('V4/soc.log.download.template.batch.del', { template_ids })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    async handleChangeStatus(status, template_ids) {
      await this.Fetch.post('V4/soc.log.download.template.batch.change.status', {
        status,
        template_ids
      })
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    },

    handleAction() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          // await this.Fetch.delete('V4/Web.ca.self.del', { ids: this.selectionId.join(',') })
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
