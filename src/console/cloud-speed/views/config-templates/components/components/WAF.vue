<template>
  <yd-card>
    <p slot="tips">针对七层提供精准化访问控制台，可以根据业务情况定制专有防护策略</p>
    <yd-form-select
      slot="action"
      v-model="form.status"
      :selects="STATUS_TYPE"
    />
    <DmTable
      border
      add-button
      add-button-text="新增规则"
      @click-add-button="handleRowEdit"
    >
      <el-table :data="list">
        <el-table-column
          label="匹配条件"
          prop="active"
          min-width="150"
        >
          <template slot-scope="scope">
            <ColumnRules
              v-if="!wafLoadingSettings"
              :items="scope.row.rules"
            />
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
          min-width="140"
          label="优先级（由上向下）"
        >
          <template slot-scope="scope">
            <ColumnBtnSort
              :disabled="scope.row.disabled"
              :disabled-up="scope.$index === 0"
              :disabled-down="scope.$index === list.length - 1"
              type="text"
              @on-set-down="handleRowDown(scope.$index, 'set-down')"
              @on-down="handleRowButton(scope.$index)"
              @on-up="handleRowTop(scope.$index)"
              @on-set-up="handleRowUp(scope.$index, 'set-up')"
            />
          </template>
        </el-table-column>
        <el-table-column
          min-width="110"
          align="right"
          label="操作"
        >
          <template slot-scope="scope">
            <ColumnAction>
              <el-button
                type="text"
                @click="handleRowEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                @click="handleRowDelete(scope.$index)"
              >删除</el-button>
            </ColumnAction>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <DialogRow
      ref="DialogRow"
      only-submit
      @submit="handleUpdate"
    />
  </yd-card>
</template>

<script>
import ColumnRules from '@/console/red-guard/components/TableWAF/components/ColumnRules'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import ColumnRulesStatus from '@/components/Column/ColumnRulesStatus'
import consoleTable from '@/mixins/consoleTable'
import wafMixin from '@/console/red-guard/mixins/waf'
import ColumnRulesAction from '@/console/red-guard/components/TableWAF/components/ColumnRulesAction'
import DialogRow from '@/console/red-guard/components/TableWAF/components/DialogRow'

export default {
  components: {
    ColumnRules,
    ColumnBtnSort,
    ColumnRulesStatus,
    ColumnRulesAction,
    DialogRow
  },

  mixins: [consoleTable, wafMixin],

  data() {
    return {
      STATUS_TYPE: [
        {
          label: 'OFF',
          value: 'off'
        },
        {
          label: 'ON',
          value: 'on'
        }
      ],
      form: {
        status: 'on'
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    handleUpdate(data) {
      if (data.id) {
        Object.assign(this.list.find(_ => _.id === data.id), data)
        return
      } else {
        data.id = parseInt(Math.random() * 100000000)
        data.status = '1'
        this.list.push(data)
      }
    },

    setForm(form) {
      this.form.status = form.status || 'off'
      const { policys = [] } = form
      policys.forEach((item, index) => {
        item.id = index + 1
      })
      this.list = form.policys || []
    },

    getForm() {
      this.list.forEach((item, index) => {
        item.sort = index + 1
      })
      const form = {
        ...this.form,
        policys: this.list
      }
      return form
    },

    init() {
      this.wafFetchSettings()
      this.loading = false
    },
    // 行编辑
    handleRowEdit(form) {
      this.$refs.DialogRow.handleOpen(form)
    }
  }
}
</script>
