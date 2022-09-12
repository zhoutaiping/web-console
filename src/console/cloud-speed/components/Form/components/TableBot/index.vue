<template>
  <div>
    <DmData
      ref="DmData"
      :show-pagination="false"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="Bot风险类型"
            prop="risk_name"
            min-width="150"
          />
          <el-table-column
            label="Bot类型"
            prop="bot_name"
            min-width="150"
          />
          <el-table-column
            label="Bot种类数"
            prop="bot_num"
            min-width="150"
          />
          <el-table-column
            label="处置方式"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnRulesAction :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="$refs.DialogRow.handleOpen(scope.row)"
                >编辑</el-button>
              </ColumnAction>
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
import wafMixins from '@/console/red-guard/mixins/waf'
import ColumnRulesAction from '@/console/red-guard/components/TableWAF/components/ColumnRulesAction'
import DialogRow from './components/DialogRow'

export default {
  components: { DialogRow, ColumnRulesAction },

  mixins: [wafMixins],

  data() {
    return {
      loading: true,
      list: [],
      selectionId: []
    }
  },

  created() {
    this.fetchList()
  },

  methods: {
    async fetchList() {
      this.loading = true
      const res = await this.Fetch.get('V4/firewall.policy.get_groupId', {
        group_id: this.wafGroupIds.bot
      })

      const nList = []
      const ruleList = {}
      // 按 type 归类
      res.list.forEach(item => {
        // 读取第一条规则的IP类型
        const rule = item.rules[0]
        const type = rule.data[0]
        ruleList[type] = item
      })
      // 输出合并数据
      Object.keys(this.wafBots).forEach(key => {
        const item = this.wafBots[key]
        const ruleItem = ruleList[item.bot_key]
        nList.push({
          action: 'watch', // 默认观察模式
          ...item,
          ...ruleItem
        })
      })

      this.list = nList
      this.loading = false
    }
  }
}
</script>
