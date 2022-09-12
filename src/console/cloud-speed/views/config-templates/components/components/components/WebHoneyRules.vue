<template>
  <div>
    <DmTable
      border
      add-button
      @click-add-button="handleRowAdd"
    >
      <el-table :data="list">
        <el-table-column
          label="目录"
          min-width="150px"
        >
          <template slot-scope="scope">
            <ColumnForm
              :ref="`menu-${scope.$index}`"
              :rules="rowRules"
              :model="scope.row"
              prop="menu"
            >
              <el-input
                v-model="scope.row.menu"
                placeholder="以/开头，以/结束"
              />
            </ColumnForm>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          min-width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              placeholder="请输入内容"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          min-width="100px"
        >
          <template slot-scope="scope">
            <ColumnAction>
              <el-button
                type="text"
                @click="handleRowDelete(scope.$index)"
              >删除</el-button>
            </ColumnAction>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </div>
</template>

<script>
import consoleTable from '@/mixins/consoleTable'
import RULE from '@/utils/verify'
import ColumnForm from '@/components/Column/ColumnForm'

export default {
  components: { ColumnForm },

  mixins: [consoleTable],

  data() {
    return {
      rowKey: ['menu', '65'],
      row: {
        menu: '',
        remark: ''
      },
      rowRules: {
        menu: [
          {
            required: true,
            pattern: RULE.slashBegin,
            message: '格式有误',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    async getList() {
      try {
        await this.handleCheckList()
      } catch (e) {
        throw new Error()
      }
      return this.list
    }
  }
}
</script>
