<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="true"
    :loading="loading"
    title="精准访问控制"
  >
    <p slot="tips">针对七层提供精准化访问控制台，可以根据业务情况定制专有防护策略</p>
    <DmAlert v-if="support">
      <p>
        当前共有
        <strong>{{ dataStatus.total || '0' }}</strong> 条网站防护策略，已用
        <strong>{{ dataStatus.used || '0' }}</strong> 条策略， 剩余
        <strong>{{ dataStatus.remain || '0' }}</strong> 条策略，
        <span class="text--underline">策略优先级按照排列顺序由上向下</span>，暂停策略后，本策略不生效。
      </p>
      <p>
        <TipsButton>购买更多网站防护策略</TipsButton>
      </p>
      <p>
        支持引用YUNDUN专人维护的规则集，引用后您可根据业务实际情况进行调整
      </p>
    </DmAlert>
    <DmToolbar>
      <el-button
        v-if="support"
        id="add_rules"
        type="primary"
        @click="handleCreate()"
      >新增规则集</el-button>
      <el-button
        :disabled="selectionId.length === 0"
        @click="handleAction('stop')"
      >暂停</el-button>
      <el-button
        :disabled="selectionId.length === 0"
        @click="handleAction('open')"
      >启用</el-button>
      <el-button
        :disabled="selectionId.length === 0"
        @click="handleAction('delete')"
      >删除</el-button>
      <el-button
        v-show="isShow"
        @click="handleOpenRules"
      >引用规则集</el-button>
      <!-- <template slot="right">
        <InputSearch
          v-model="bindParams.searchValue"
          placeholder="匹配条件"
          style="margin-right: 12px"
          @submit="handleSearch"
        />
      </template> -->
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="tableLoading"
        border
      >
        <el-table
          ref="list"
          :data="list"
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            :selectable="row => row.selectable"
            type="selection"
            width="55"
          />
          <el-table-column
            label="规则集名称/规则ID"
            min-width="150"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.from === 'diy'">
                <ColumnPopoverInput
                  v-model="scope.row.name"
                  @submit="name => handleUpdateRow({name}, scope.row)"
                />
              </template>
              <template v-else>
                {{ scope.row.from | labelView(wafSelects.ruleFrom, null, scope.row.name) }}
              </template>
              <div>
                {{ scope.row.code }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="规则数"
            min-width="120"
          >
            <template slot-scope="scope">
              <div
                v-for="(item, index) in scope.row.countList"
                :key="index"
              >
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="规则集来源"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.from | labelView(wafSelects.ruleFrom) }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnRulesStatus :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            label="优先级"
            min-width="110"
          >
            <template slot-scope="scope">
              <ColumnBtnSort
                :disabled-up="scope.$index === 0"
                :disabled-down="scope.$index === list.length - 1"
                type="text"
                @on-set-down="handleRuleSort(scope.$index, 'set-down')"
                @on-down="handleRuleSort(scope.$index, 'down')"
                @on-up="handleRuleSort(scope.$index, 'up')"
                @on-set-up="handleRuleSort(scope.$index, 'set-up')"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnPopoverInput
                v-model="scope.row.remark"
                @submit="remark => handleUpdateRow({remark}, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="80"
          >
            <template slot-scope="scope">
              <router-link :to="{name: 'cloud-speed.router.websiteList__wafDetail', params: {groupId: scope.row.id}, query: { ...$route.query, from: scope.row.from,}}">
                <el-button type="text">管理</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
    <Rules
      ref="Rules"
      @init="fetchList"
    />
  </CardItemForm>
</template>

<script>
import domainMixins from '@/mixins/domain'
import create from '@/utils/create-basic'
import consoleData from '@/mixins/consoleData'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import ColumnRulesStatus from '@/components/Column/ColumnRulesStatus'
import ColumnPopoverInput from '@/components/Column/ColumnPopoverInput'
import wafMixins from '@/console/red-guard/mixins/waf'
import { arrToSortObj } from '@/utils/array'
import { labelView } from '@/utils/filter'
import DialogRow from './DialogRow'
import Rules from './Rules'
import consoleItem from '../../../../../mixins/consoleItem'

export default create({
  name: 'CardWaf',

  components: {
    Rules,
    ColumnBtnSort,
    ColumnRulesStatus,
    ColumnPopoverInput,
    DialogRow
  },

  mixins: [consoleData, consoleItem, wafMixins, domainMixins],

  props: {
    support: Boolean
  },

  data() {
    return {
      tableLoading: false,
      bindParams: {
        domainid: this.$route.params.id
      },
      API_INDEX: 'V4/firewall.policyGroup.get_domainid',
      dataStatus: {},
      id: this.$route.params.id,
      cardSupport: true,
      selectionId: []
    }
  },
  computed: {
    isShow() {
      const filter_flag = ['YD-WEBAQJS-TY', 'YD-WEBAQJS-GJ']

      return !filter_flag.includes(this.domainPlanInfo.meal_flag)
    }
  },
  created() {
    this.wafFetchGroupList()
  },

  methods: {
    init() {
      this.fetchStatus()
      this.loading = false
    },

    async handleUpdateRow(form, row) {
      try {
        await this.Fetch.post(`V4/firewall.policyGroup.save`, {
          ...row,
          ...form
        })
      } catch (e) {
        return
      }
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    },

    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        item.num = item.rules && item.rules.length || 0
        item.selectable = ['diy', 'batch', 'quote'].includes(item.from)

        const countList = []
        Object.keys(item.policy_num).forEach(key => {
          const count = item.policy_num[key]
          countList.push(`${labelView(key, this.wafSelects.actionType)}：${count} 条`)
        })
        item.countList = countList
      })
      return response
    },
    // 读取状态
    async fetchStatus() {
      const params = {
        domainid: this.id
      }
      const data = await this.Fetch.get('/V4/firewall.policy.stats_domainid', params)
      this.dataStatus = data
    },
    // 通用操作
    async handleAction(type) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        await this.Fetch.post(`V4/firewall.policyGroup.${type}`, { ids: this.selectionId })
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },
    // 新增
    async handleCreate() {
      await this.confirmAction()
      this.$refs.DialogRow.handleOpen()
    },
    // 编辑
    async handleRowEdit(form) {
      await this.confirmAction()
      this.$refs.DialogRow.handleOpen(form)
    },
    async handleOpenRules() {
      await this.confirmAction()
      this.$refs.Rules.handleOpen({}, this.id)
    },
    // 排序
    async handleRuleSort(index, type) {
      this.tableLoading = true
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
        await this.Fetch.post('V4/firewall.policyGroup.sort', { new_sorts: arg })
      } catch (e) {
        return
      } finally {
        this.tableLoading = false
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
})
</script>
