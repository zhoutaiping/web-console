<template>
  <div>
    <DmTable
      add-button
      border
      @click-add-button="handleRowAdd"
    >
      <el-table :data="list">
        <el-table-column
          label="指定URL"
          min-width="150px"
        >
          <template slot-scope="scope">
            <ColumnForm
              v-if="scope.row.$edit"
              :ref="`url-${scope.$index}`"
              :rules="rowRules"
              :model="scope.row"
              prop="url"
            >
              <el-input
                v-model="scope.row.url"
                placeholder="以/开头"
              />
            </ColumnForm>
            <template v-else>
              {{ scope.row.url }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="关键词（多个用，分开）"
          min-width="150px"
        >
          <template slot-scope="scope">
            <ColumnForm
              v-if="scope.row.$edit"
              :ref="`key_word-${scope.$index}`"
              :rules="rowRules"
              :model="scope.row"
              prop="key_word"
            >
              <el-input
                v-model="scope.row.key_word"
                placeholder="关键词"
              />
            </ColumnForm>
            <template v-else>
              {{ scope.row.key_word }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="120px"
        >
          <template slot-scope="scope">
            <ColumnAction>
              <template v-if="scope.row.$edit">
                <el-button
                  type="text"
                  @click="handleRowSave(scope.row, scope.$index)"
                >保存</el-button>
                <el-button
                  type="text"
                  @click="handleRowCancel(scope.row, scope.$index)"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="handleRowEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  @click="handleRowDelete(scope.$index)"
                >删除</el-button>
              </template>
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
  props: {
    startUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rowKey: ['url', 'key_word'],
      row: {
        $edit: true,
        url: '',
        key_word: ''
      },
      rowRules: {
        url: [
          {
            required: true,
            pattern: RULE.noProtocolUrl,
            // pattern: RULE.haveHttpOrNotUrl,
            message: ' ',
            trigger: 'blur'
          }
        ],
        key_word: [
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
    async setList(list) {
      this.list = []
      list = list.map(item => {
        const [url, key_word] = item.split('|')
        return {
          url: url,
          key_word,
          $edit: false
        }
      })
      this.$nextTick(() => {
        this.list = list
      })
    },

    handleRowDelete(row, index) {
      this.list.splice(index, 1)
      this.handleChange()
    },

    handleRowEdit(row) {
      row.$edit = true
    },

    handleRowCancel(row) {
      row.$edit = false
    },

    handleRowSave(row) {
      this.handleChange()
      row.$edit = false
    },

    async handleChange() {
      const list = await this.getList()
      this.$emit('change', list)
    },

    async getList() {
      // try {
      //   await this.handleCheckList()
      // } catch (e) {
      //   throw new Error()
      // }

      const list = this.list.map(item => {
        const { key_word } = item
        let url = item.url
        if (url.indexOf(this.startUrl) < 0) {
          url = this.startUrl + url
        }
        console.log()
        return `${url}|${key_word}`
      })
      return list
    }
  }
}
</script>
