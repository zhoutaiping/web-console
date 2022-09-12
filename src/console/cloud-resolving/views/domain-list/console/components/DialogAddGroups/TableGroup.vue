<template>
  <div>
    <DmData
      ref="DmData"
      :show-pagination="false"
      :inner-card="false"
      @init="fetchList"
    >
      <DmTable
        add-button
        @click-add-button="handleRowAdd"
      >
        <el-table
          :data="list"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column label="分组名称">
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <el-input
                  v-model="scope.row.group_name"
                  placeholder="分组名称"
                />
              </template>
              <template v-else>
                {{ scope.row.group_name }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <el-button
                  type="text"
                  @click="handleRowSave(scope)"
                >保存</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="handleRowCancel(scope)"
                >取消</el-button>
              </template>
              <template v-else>
                <PopoverConfirm
                  content="确认删除？"
                  @submit="handleRowDelete(scope)"
                >
                  <el-button type="text">删除</el-button>
                </PopoverConfirm>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import { deepClone } from '@/utils'
import ColumnForm from '@/components/Column/ColumnForm'

export default {
  components: { ColumnForm },

  mixins: [consoleData],

  props: {
    value: [Number, String]
  },

  data() {
    return {
      API_INDEX: 'V4/CloudDns.Member.GroupList',
      API_METHOD: 'post',
      bindParams: {
        domain_id: this.$route.params.id,
        member_id: this.$route.params.member_id
      },
      rowKey: ['name'],
      row: {
        group_name: ''
      },
      rowRules: {
        group_name: [
          {
            required: true,
            message: ' ',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    handleCurrentChange(row) {
      this.$emit('input', row.id)
    },

    handleRowAdd() {
      this.list.push({
        ...deepClone(this.row),
        $edit: true
      })
    },

    async handleRowSave({ row }) {
      const form = {
        group_name: row.group_name,
        domain_id: this.$route.params.id,
        member_id: this.$route.params.member_id
      }

      try {
        if (form.id) {
          await this.Fetch.post('', form)
        } else {
          await this.Fetch.post('V4/CloudDns.Member.AddGroup', form)
        }
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    handleRowCancel({ row, $index }) {
      if (row.id && row.$cache) {
        const cache = row.$cache
        row.group_name = cache.group_name
      } else {
        this.list.splice($index, 1)
      }
    },

    async handleRowDelete({ row }) {
      const { id } = row
      const form = {
        group_id: id,
        member_id: this.$route.params.member_id
      }
      try {
        await this.Fetch.post('V4/CloudDns.Member.DelGroup', form)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    handleRowEdit(scope) {
      scope.row.$edit = true
      scope.row.$cache = deepClone(scope.row)
    },

    formatResponse(response) {
      const list = response
      list.forEach(item => {
        item.$edit = false
        item.$cache = null
      })
      return {
        list
      }
    }
  }
}
</script>
