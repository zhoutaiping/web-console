<style lang="scss">
.TableRule {
  .el-table__row.expanded {
    td {
      height: 0px;
      padding: 0px !important;
      overflow: hidden;
      * {
        height: 0px;
        padding: 0px !important;
        overflow: hidden;
      }
    }
  }

  .EditForm__footer {
    border-top: 1px solid $--border-color-base;
    padding-top: 15px;
    margin-top: 15px;
    text-align: center;
  }
}
</style>

<template>
  <div>
    <DmTable
      :add-button-disabled="Boolean(editId)"
      :loading="loading"
      class="TableRule"
      border
      add-button
      @click-add-button="handleRowAdd"
    >
      <el-table
        :data="list"
        :expand-row-keys="[editId]"
        row-key="id"
      >
        <el-table-column
          type="expand"
          width="1"
        >
          <template slot-scope="scope">
            <div style="padding: 0px 12px">
              <el-form
                ref="Form"
                :model="scope.row"
                :rules="formRules"
              >
                <el-row :gutter="12">
                  <el-col :span="10">
                    <el-form-item
                      prop="rule_name"
                      label="规则名称"
                    >
                      <el-input
                        v-model="scope.row.rule_name"
                        placeholder="规则名称"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="showDecision"
                    :span="6"
                  >
                    <el-form-item
                      prop="decision"
                      label="处置方式"
                    >
                      <yd-form-select
                        :selects="selectDecision"
                        v-model="scope.row.decision"
                        @change="() => scope.row.rule_conf = deepClone(defaultRuleConf)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!-- 规则 -->
              <div
                v-for="(item, index) in selectLogic"
                v-if="scope.row.rule_conf.filter(_ => _.logic === item.value).length"
                :key="index"
              >
                <el-divider content-position="left">{{ item.label }}</el-divider>
                <TableRuleGroup
                  ref="TableRuleGroup"
                  :decision="scope.row.decision"
                  :group-title="item.label"
                  :select-rule-key="selectRuleKey"
                  :select-api-token="selectApiToken"
                  :select-access-group="selectAccessGroup"
                  :show-logic="item.value"
                  :data="scope.row.rule_conf"
                  @add="handleAddRuleByLogic(item.value, scope.row.rule_conf)"
                />
              </div>
              <div style="margin-top: 20px">
                <el-button
                  v-for="(item, index) in selectLogic"
                  :key="index"
                  @click="handleAddRuleByLogic(item.value, scope.row.rule_conf)"
                >+ {{ item.label }}</el-button>
              </div>
              <!-- 操作 -->
              <div class="EditForm__footer">
                <el-button
                  :loading="submitLoading"
                  type="primary"
                  @click="handleRowSubmit(scope)"
                >保存</el-button>
                <el-divider direction="vertical" />
                <el-button @click="handleRowCancel(scope)">取消</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="rule_name"
          label="规则名"
          min-width="180"
        />
        <el-table-column
          v-if="showDecision"
          label="处置方式"
          min-width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.decision | labelView(selectDecision) }}
          </template>
        </el-table-column>
        <el-table-column
          label="匹配对象"
          min-width="250"
        >
          <template slot-scope="scope">
            <el-tag
              v-for="(item, index) in scope.row.rule_conf "
              :key="index"
              style="margin-right: 8px"
            >{{ item.key | labelView(selectRuleKeyView) }}<!-- TODO --></el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="modifySort"
          label="优先级"
          min-width="120"
        >
          <template slot-scope="scope">
            <ColumnBtnSort
              :disabled="Boolean(editId)"
              :disabled-up="scope.$index === 0"
              :disabled-down="scope.$index === list.length - 1"
              type="text"
              @on-set-up="handleRuleSort(scope.$index, 'Top')"
              @on-up="handleRuleSort(scope.$index, 'Up')"
              @on-down="handleRuleSort(scope.$index, 'Down')"
              @on-set-down="handleRuleSort(scope.$index, 'Bottom')"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作"
          min-width="100"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="Boolean(editId)"
              type="text"
              @click="handleRowEdit(scope)"
            >编辑</el-button>
            <el-divider direction="vertical" />
            <el-button
              :disabled="Boolean(editId)"
              type="text"
              @click="handleRowDelete(scope)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </div>
</template>

<script>
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import { arrToSortObj } from '@/utils/array'
import TableRuleGroup from './TableRuleGroup'
import { deepClone } from '../../../../../utils'

const EDIT_ID = 'ADD'
export default {
  components: { ColumnBtnSort, TableRuleGroup },

  props: {
    selectRuleKey: Array,
    fetchRowSubmit: Function,
    fetchData: Function,
    deleteRowSubmit: Function,
    modifySort: Function,
    showLogics: {
      type: Array,
      default: () => ['include', 'require', 'exclude']
    },
    availableDecision: {
      type: Array,
      default: () => ['deny', 'bypass', 'allow']
    },
    showDecision: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      deepClone,
      editId: '',
      editCache: {},
      rowKey: [],
      EDIT_ID,
      loading: false,
      submitLoading: false,
      list: [],
      formRules: {
        rule_name: {
          required: true,
          message: '请填写规则名',
          trigger: 'blur'
        },
        decision: {
          required: true,
          message: '请选择',
          trigger: 'blur'
        }
      },
      defaultLogic: '',
      selectAccessGroup: [],
      selectApiToken: []
    }
  },

  computed: {
    selectDecision() {
      return [
        {
          label: '拒绝',
          value: 'deny'
        },
        {
          label: '允许',
          value: 'allow'
        },
        {
          label: '绕过',
          value: 'bypass'
        }
      ].filter(_ => this.availableDecision.includes(_.value))
    },
    defaultRuleConf() {
      return [
        { 'logic': this.showLogics[0], 'data': [] }
      ]
    },
    row() {
      return {
        id: EDIT_ID,
        rule_name: '',
        decision: '',
        rule_conf: deepClone(this.defaultRuleConf)
      }
    },
    selectLogic() {
      return [
        {
          label: '包括',
          value: 'include'
        },
        {
          label: '必须',
          value: 'require'
        },
        {
          label: '除外',
          value: 'exclude'
        }
      ].filter(_ => this.showLogics.includes(_.value))
    },
    selectRuleKeyView() {
      const list = []
      this.selectRuleKey.forEach(item => {
        list.push(item)
        if (item.children) {
          list.push(...item.children)
        }
      })
      return list
    }
  },

  created() {
    this.fetchAccessGroup()
    this.fetchApiToken()
  },

  methods: {
    async fetchApiToken() {
      const data = await this.Fetch.get('V4/zero.trust.api.token.all')
      delete data._status
      this.selectApiToken = data.map(_ => {
        return {
          label: _.token_name,
          value: _.client_id
        }
      })
    },

    async fetchAccessGroup() {
      const data = await this.Fetch.get('V4/zero.trust.app.access.group.all.list')
      delete data._status
      this.selectAccessGroup = data.map(_ => {
        return {
          label: _.group_name,
          value: _.group_uuid
        }
      })
    },

    async handleRowAdd() {
      this.list.push(deepClone(this.row))
      this.editId = EDIT_ID
    },

    async handleRuleSort(index, type) {
      const list = this.list.map(item => item.id)

      const item = list.splice(index, 1)[0]

      if (type === 'Down') {
        list.splice(index + 1, 0, item)
      } else if (type === 'Up') {
        list.splice(index - 1, 0, item)
      } else if (type === 'Top') {
        list.unshift(item)
      } else if (type === 'Bottom') {
        list.push(item)
      }

      this.loading = true
      try {
        await this.modifySort({
          new_sorts: arrToSortObj(list)
        })
      } catch (e) {
        return
      } finally {
        this.loading = false
      }

      this.handleInit()
      this.Message('ACTION_SUCCESS')
    },

    handleAddRuleByLogic(logic, list) {
      list.push({
        logic,
        data: []
      })
    },

    async handleRowEdit(scope) {
      this.editCache = deepClone(scope.row)
      this.editId = scope.row.id
    },

    async handleRowCancel(scope) {
      if (this.editId === EDIT_ID) {
        this.list.splice(scope.$index, 1)
      } else {
        scope.row = deepClone(this.editCache)
      }
      this.editId = ''
      this.editCache = {}
    },

    async handleRowSubmit(scope) {
      const form = scope.row
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      if (!form.rule_conf || !form.rule_conf.length) {
        this.$message.warning('至少添加一条规则')
        return
      }

      if (this.showLogics.includes('include')) {
        if (!form.rule_conf.filter(_ => _.logic === 'include').length) {
          this.$message.warning('至少添加一条包括规则')
          return
        }
      }

      if (this.$refs.TableRuleGroup && this.$refs.TableRuleGroup.length) {
        for (const item of this.$refs.TableRuleGroup) {
          await item.checkList()
        }
      }

      form.rule_conf.forEach(item => {
        if (item.key === 'everyone') item.data = []
      })

      if (this.fetchRowSubmit) {
        this.submitLoading = true
        try {
          await this.fetchRowSubmit(scope.row)
        } catch (e) {
          return
        } finally {
          this.submitLoading = false
        }
        this.handleInit()
        this.Message('ACTION_SUCCESS')
      }
      this.editId = ''
      this.editCache = {}
      this.$emit('submit', scope.row)
    },

    async handleRowDelete(scope) {
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(async() => {
        if (this.fetchRowSubmit) {
          try {
            await this.deleteRowSubmit(scope.row)
          } catch (e) {
            return
          }
          this.handleInit()
          this.Message('ACTION_SUCCESS')
        }
        this.$emit('submit', scope.row)
      })
    },

    async handleInit() {
      if (this.fetchData) {
        this.loading = true
        let rule_list = []
        try {
          const res = await this.fetchData()
          rule_list = res.rule_list
        } catch (e) {
          return
        } finally {
          this.loading = false
        }
        this.editId = ''
        this.list = rule_list
      }
    },

    setList(list) {
      this.editId = ''
      this.list = list
    }
  }
}
</script>
