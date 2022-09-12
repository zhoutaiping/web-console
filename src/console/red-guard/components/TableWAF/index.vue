<template>
  <div>
    <DmToolbar>
      <el-button
        :disabled="disabledAction"
        type="primary"
        @click="handleModify(handleCreate)"
      >新增规则</el-button>
      <el-button
        :disabled="selectionId.length === 0 || disabledAction"
        @click="handleModify(handleAction, 'stop')"
      >暂停</el-button>
      <el-button
        :disabled="selectionId.length === 0 || disabledAction"
        @click="handleModify(handleAction, 'open')"
      >启用</el-button>
      <el-button
        :disabled="selectionId.length === 0 || disabledAction"
        @click="handleModify(handleAction, 'delete')"
      >删除</el-button>
      <el-button @click="fetchList">刷新</el-button>
      <div slot="right">
        <yd-form-select
          v-model="bindParams.action"
          :selects="actionTypeView"
          default-text="处置方式"
          style="width: 120px; margin-right: 12px;"
        />
        <InputSearch
          v-model="bindParams.searchValue"
          placeholder="匹配条件"
          style="margin-right: 12px"
          @submit="handleSearch"
        />
        <el-button
          type="primary"
          @click="handleSearch"
        >查询</el-button>
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
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="规则ID/创建时间"
            min-width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.code }}<br>
              {{ scope.row.create_at }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="200"
            label="匹配条件"
            prop="active"
          >
            <template slot-scope="scope">
              <ColumnRules :items="scope.row.rules" />
            </template>
          </el-table-column>
          <el-table-column
            label="处置方式"
            min-width="180"
          >
            <template slot-scope="scope">
              <ColumnRulesAction :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="备注"
          >
            <template slot-scope="scope">
              <ColumnRemark
                :row="scope.row"
                @submit="handleSubmitRemark"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="70"
          >
            <template slot-scope="scope">
              <template v-if="type !=='ssl'">
                <template v-if="Number(scope.row.package_support) === 1 && Number(scope.row.status) === 1">
                  <ColumnRulesStatus :data="scope.row" />
                </template>
                <template v-else>
                  <span
                    class="color--warning"
                    text="暂停"
                  >暂停</span>
                  <TipsTooltip
                    v-show="Number(scope.row.package_support) === 0"
                    :status="'warning'"
                    title="因套餐到期或降级此策略已被暂停, 开通套餐后即可恢复"
                  />
                </template>
              </template>
              <template v-else>
                <ColumnRulesStatus :data="scope.row" />
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="优先级"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnBtnSort
                :disabled="scope.row.disabled || disabledAction"
                :disabled-up="scope.$index === 0"
                :disabled-down="scope.$index === list.length - 1"
                type="text"
                @on-set-down="handleModify(handleRuleSort, scope.$index, 'set-down')"
                @on-down="handleModify(handleRuleSort, scope.$index, 'down')"
                @on-up="handleModify(handleRuleSort, scope.$index, 'up')"
                @on-set-up="handleModify(handleRuleSort, scope.$index, 'set-up')"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="200"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  :disabled="disabledAction"
                  type="text"
                  @click="handleModify($refs.DialogRow.handleOpen, scope.row)"
                >编辑</el-button>
                <el-button
                  :disabled="disabledAction"
                  type="text"
                  @click="$refs.DialogLog.handleOpen(scope.row)"
                >修改记录</el-button>
                <router-link :to="{
                    name: 'cloud-speed.router.menaceAnalyze__AccurateAccessControl',
                    query: {
                      rule_id: scope.row.code
                    }
                }">
                  <el-button type="text">匹配记录</el-button>
                </router-link>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      :type="type"
      @init="handleUpdate"
    />
    <DialogLog ref="DialogLog" />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import wafMixins from '@/console/red-guard/mixins/waf'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import ColumnRulesStatus from '@/components/Column/ColumnRulesStatus'
import ColumnRemark from '@/components/Column/ColumnRemark'
import { arrToSortObj } from '@/utils/array'
import ColumnRulesAction from './components/ColumnRulesAction'
import DialogRow from './components/DialogRow'
import DialogLog from './components/DialogLog'
import ColumnRules from './components/ColumnRules'

export default {
  components: { DialogRow, DialogLog, ColumnBtnSort, ColumnRulesStatus, ColumnRulesAction, ColumnRemark, ColumnRules },

  mixins: [consoleData, wafMixins],

  props: {
    cardParams: Object,
    disabledActionByQuery: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'plus'
    },
    confirmModify: Function
  },

  data() {
    return {
      disabledAction: false,
      API_INDEX: '',
      bindParams: {
        action: '',
        searchValue: '',
        ...this.cardParams
      },
      selectionId: []
    }
  },

  computed: {
    actionTypeView() {
      if (this.type === 'ssl') {
        return this.wafSelects.actionType.filter(_ => ['block', 'white', 'deny'].includes(_.value))
      } else {
        return this.wafSelects.actionType
      }
    }
  },

  created() {
    if (this.type === 'ssl') {
      this.bindParams.policy_for_ssl = 1
      this.bindParams.domainid = this.$route.params.id
      this.wafFetchSettings({ type: 'ssl' })
      this.API_INDEX = 'V4/firewall.policy.get_domainid'
    } else {
      this.API_INDEX = 'V4/firewall.policy.get_groupId'
    }
    this.disabledAction = this.disabledActionByQuery && !['diy', 'batch', 'quote'].includes(this.$route.query.from)
  },

  methods: {
    async handleModify(fn, ...args) {
      this.confirmModify && await this.confirmModify()
      fn(...args)
    },

    handleCreate() {
      if (this.type === 'ssl') {
        this.$refs.DialogRow.handleOpen({
          action: 'deny'
        })
      } else {
        this.$refs.DialogRow.handleOpen()
      }
    },

    handleUpdate() {
      this.fetchList()
      this.$emit('init')
    },

    async handleAction(type) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        if (type === 'open') {
          await this.Fetch.post('V4/firewall.policy.open', { ids: this.selectionId })
        } else if (type === 'stop') {
          await this.Fetch.post('V4/firewall.policy.stop', { ids: this.selectionId })
        } else if (type === 'delete') {
          await this.Fetch.post('V4/firewall.policy.delete', { ids: this.selectionId })
        }
        this.$message.success('操作成功')
        this.fetchList()
        this.$emit('init')
      })
    },
    // 提交备注编辑
    async handleSubmitRemark(data) {
      if (data.remark.length > 255) {
        this.$message.warning('备注内容过长, 最长支持255字节')
        return
      }
      try {
        data.tjkd_app_id = this.$route.params.id
        data.type = this.type
        if (this.$route.params.groupId) data.group_id = this.$route.params.groupId
        await this.Fetch.post('/V4/firewall.policy.save', data)
      } catch (e) {
        return
      }
      this.$message.success('编辑成功')
      this.fetchList()
    },
    // 排序
    async handleRuleSort(index, type) {
      this.loading = true
      const list = this.list.map(item => item.id)
      const item = list.splice(index, 1)[0]

      if (type === 'up') {
        if (index === 0) { // 置顶
          list.unshift(item)
        } else { // 上移
          list.splice(index - 1, 0, item)
        }
      }
      if (type === 'down') {
        if (index === list.length - 1) { // 置底
          list.push(item)
        } else {
          list.splice(index + 1, 0, item)
        }
      }
      if (type === 'set-up') {
        list.unshift(item)
      }
      if (type === 'set-down') {
        list.push(item)
      }

      const arg = arrToSortObj(list)

      try {
        await this.Fetch.post('/V4/firewall.policy.sort', { new_sorts: arg })
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
      this.$message.success('操作成功')
      this.fetchList()
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
