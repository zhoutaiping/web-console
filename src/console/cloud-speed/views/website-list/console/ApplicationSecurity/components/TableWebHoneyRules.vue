<template>
  <div>
    <DmTable
      :loading="loading"
      border
      add-button
      @click-add-button="handleRowAdd"
    >
      <el-table :data="list">
        <el-table-column
          min-width="120px"
          label="目录"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.$edit">
              <ColumnForm
                :model="scope.row"
                :item-rules="rowRules.menu"
                :ref="`menu-${scope.$index}`"
                prop="menu"
              >
                <el-input
                  v-model="scope.row.menu"
                  placeholder="以/开头，以/结束"
                />
              </ColumnForm>
            </template>
            <template v-else>{{ scope.row.menu }}</template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          label="备注"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.$edit">
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入内容"
              />
            </template>
            <template v-else>{{ scope.row.remark }}</template>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          prop="time"
          label="添加时间"
        />
        <el-table-column
          label="操作"
          align="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.$edit"
              type="text"
              @click="handleRowSave(scope)"
            >保存</el-button>
            <el-button
              v-else
              type="text"
              @click="handleRowEdit(scope)"
            >编辑</el-button>
            <el-divider direction="vertical" />
            <el-button
              v-if="scope.row.$edit"
              type="text"
              @click="handleRowCancel(scope)"
            >取消</el-button>
            <PopoverConfirm
              content="确认删除？"
              @submit="handleRowDelete(scope)"
            >
              <el-button
                v-show="!scope.row.$edit"
                type="text"
              >删除</el-button>
            </PopoverConfirm>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import RULE from '@/utils/verify'
import domainMixins from '@/mixins/domain'
import ColumnForm from '@/components/Column/ColumnForm'
import consoleItem from '../../../../../mixins/consoleItem'

export default {
  components: { ColumnForm },

  mixins: [domainMixins, consoleItem],

  data() {
    return {
      loading: true,
      rowKey: ['menu'],
      row: {
        menu: '',
        remark: ''
      },
      rowRules: {
        menu: {
          required: true,
          pattern: RULE.noProtocolUrl,
          message: ' ',
          trigger: 'blur'
        }
      },
      list: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.loading = true
      const params = {
        domain_id: this.domainId,
        group: 'web_honeypot'
      }

      const data = await this.Fetch.get('V4/web.domain.set.get.rule', params)
      const { list = [] } = data.web_honeypot

      list.forEach(_ => {
        Object.assign(_, _.value)
        _.$edit = false
      })

      this.list = list
      this.loading = false
    },

    async handleRowAdd() {
      await this.confirmAction()
      const item = {
        ...deepClone(this.row),
        $edit: true
      }
      this.list.push(item)
    },

    handleCheckRow(index) {
      this.rowKey.forEach(key => {
        const keyIndex = `${key}-${index}`
        if (this.$refs[keyIndex] && this.$refs[keyIndex].validate) {
          if (!this.$refs[keyIndex].validate()) {
            throw new Error()
          }
        }
      })
    },

    async handleRowSave({ row, $index }) {
      await this.handleCheckRow($index)
      try {
        await this.Fetch.post('V4/web.domain.set.save.rule', {
          group: {
            web_honeypot: {
              id: row.id,
              menu: row.menu,
              remark: row.remark
            }
          },
          domain_id: this.domainId
        })
      } catch (e) {
        return
      }

      this.Message('ACTION_SUCCESS')
      this.fetchData()
    },

    async handleRowEdit({ row }) {
      await this.confirmAction()
      row.$edit = true
      row.$cache = deepClone(row)
    },

    handleRowCancel({ row, $index }) {
      if (!row.id) {
        this.list.splice($index, 1)
      } else {
        Object.assign(row, row.$cache)
        row.$edit = false
      }
    },

    async handleRowDelete({ row }) {
      await this.confirmAction()
      try {
        await this.Fetch.delete('V4/web.domain.set.del.rule', {
          domain_id: this.domainId,
          group: {
            web_honeypot: {
              id: row.id
            }
          }
        })
      } catch (e) {
        return
      }

      this.Message('ACTION_SUCCESS')
      this.fetchData()
    }
  }
}
</script>
