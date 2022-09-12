<template>
  <yd-card
    horizontal
    title="精准化访问控制"
  >
    <template slot="tips">
      <p>针对四层提供精准化访问控制台，可以根据业务情况定制专有防护策略</p>
    </template>
    <yd-alert>
      <p>
        当前共有
        <strong>{{ dataStatus.total || '0' }}</strong> 条四层转发防护策略，已用
        <strong>{{ dataStatus.used || '0' }}</strong> 条策略，剩余
        <strong>{{ dataStatus.remain || '0' }}</strong> 条策略，<a
          type="text"
          @click="Help.openServicePanel(appAssets.afterKF)"
        >购买更多网站防护策略</a>
      </p>
      <p>针对四层提供精细化访问控制，可以根据业务情况定制专有防护策略</p>
      <p>策略优先级按照
      <span class="text--underline">排列顺序由上向下</span>，暂停策略后，本策略不生效</p>
    </yd-alert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleEditOpen()"
      >新增规则</el-button>
      <el-button
        :disabled="multipleActionDisable"
        @click="handleMultipleRuleAction('stop')"
      >暂停</el-button>
      <el-button
        :disabled="multipleActionDisable"
        @click="handleMultipleRuleAction('open')"
      >启用</el-button>
      <el-button
        :disabled="multipleActionDisable"
        @click="handleMultipleRuleAction('delete')"
      >删除</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="init"
    >
      <DmTable
        :loading="loading"
        border
        min-height
      >
        <el-table
          ref="list"
          :data="list"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :selectable="columnSelectable"
            width="55"
            type="selection"
          />
          <el-table-column
            min-width="110"
            label="规则 ID"
            prop="code"
          />
          <el-table-column
            min-width="150"
            label="匹配条件"
            prop="active"
          >
            <template slot-scope="scope">
              <column-rules :list="scope.row.rules" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="处置方式"
          >
            <template slot-scope="scope">
              <column-rules-action :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="50"
            label="备注"
            prop="remark"
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
            min-width="50"
          >
            <template slot-scope="scope">
              <column-rules-status :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="优先级（由上向下）"
          >
            <template slot-scope="scope">
              <column-btn-sort
                :disabled="scope.row.disabled"
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
            width="120"
            align="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.disabled"
                type="text"
                @click="handleEditOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical"/>
              <router-link
                :to="{
                  name: 'cloud-wall.router.dataReport__accurateAccessControl',
                  query: {
                    rule_id: scope.row.code
                  }
              }">
                <el-button
                  type="text"
                >匹配记录</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <!-- 备注 -->
    <dialog-tcp-remark
      ref="dialogRemark"
      @on-success="init"
    />
    <dialog-four-policy
      ref="dialogEdit"
      @on-success="init"
      @init-status="initStatus"
    />
  </yd-card>
</template>

<script>
import Help from '@/utils/help'
import { arrToSortObj } from '@/utils/array'
import consoleData from '@/mixins/consoleData'
import columnRulesStatus from '@/components/Column/ColumnRulesStatus'
import columnRules from '@/components/Column/ColumnRulesWall'
import columnBtnSort from '@/components/Column/ColumnBtnSort'
import columnRulesAction from '@/components/Column/ColumnRulesAction'
import ColumnRemark from '@/components/Column/ColumnRemark'
import DialogTcpRemark from './DialogTcpRemark'
import DialogFourPolicy from './DialogFourPolicy'

export default {
  components: {
    columnRules,
    columnBtnSort,
    columnRulesAction,
    columnRulesStatus,
    ColumnRemark,
    DialogTcpRemark,
    DialogFourPolicy
  },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/firewall.policy.get_packageid',
      Help,
      dataStatus: {},
      listPort: [],
      params: {
        package_id: this.$route.params.id
      },
      columnWidth: {
        selection: 30,
        code: 150,
        ruleAction: 130,
        remark: 120,
        status: 70,
        sort: 160,
        action: 120
      }
    }
  },

  mounted() {
    this.$store.commit('fetchIpList')
    this.initStatus()
  },

  methods: {
    formatResponse(response) {
      this.initPort()
      return response
    },

    init() {
      this.fetchList()
    },

    async initPort() {
      const { package_id } = this.params
      const data = await this.TjkdResource.plusPackagePortList({ package_id })
      this.listPort = data
    },
    // 读取状态
    async initStatus() {
      const params = {
        package_id: this.params.package_id,
        policy_type: 'tcp'
      }
      const data = await this.WallResource.firewallPolicyStatsDomainid(params)
      this.dataStatus = data
    },
    // 项目多选
    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },
    // 多选发送
    handleMultipleRuleAction(cmd) {
      const { multipleSelection } = this
      const ids = multipleSelection.map(item => parseInt(item.id, 10))
      this.handleRuleAction(ids, cmd)
    },
    // 规则状态操作
    async handleRuleAction(arg, cmd) {
      const CMD_MAP = {
        open: 'firewallPolicyOpen',
        stop: 'firewallPolicyStop',
        close: 'firewallPolicyClose',
        delete: 'firewallPolicyDelete'
      }
      const action = CMD_MAP[cmd]

      this.$confirm('确认此项操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await this.handleAction(action, arg)
        } catch (e) {
          return
        }

        if (cmd === 'delete') this.initStatus()

        this.$message.success('操作成功')
        this.init()
      })
    },
    // 通用操作
    async handleAction(fn, arg) {
      this.loading = true
      try {
        await this.WallResource[fn](arg)
      } catch (e) {
        this.loading = false
        throw new Error()
      }
      this.loading = false
      this.$refs.list.clearSelection()
    },

    columnSelectable(row) {
      return !row.disabled
    },
    // 打开编辑
    handleEditOpen(form) {
      this.$refs.dialogEdit.handleOpen(form, this)
    },
    // 提交备注编辑
    async handleSubmitRemark(form) {
      if (form.remark.length > 255) {
        this.$message.warning('备注内容过长, 最长支持255字节')
        return
      }
      form.type = 'tcp'

      try {
        await this.WallResource.firewallPolicySave(form)
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
      await this.WallResource.firewallPolicySort(arg)

      this.init()
    }
  }
}
</script>
