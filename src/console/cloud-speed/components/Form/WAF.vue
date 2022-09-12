<template>
  <div>
    <el-form
      v-if="form.status === 'on'"
      label-width="120px"
      label-position="left"
    >
      <el-form-item
        v-if="isBatch"
        label="添加方式"
      >
        <yd-form-radio
          v-model="formBatch._pmode"
          :radios="SELECT.EDIT_TYPE_M2"
        />
      </el-form-item>
    </el-form>
    <DmTable
      v-if="form.status === 'on'"
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
              @on-set-up="handleRowTop(scope.$index)"
              @on-up="handleRowUp(scope.$index)"
              @on-down="handleRowDown(scope.$index)"
              @on-set-down="handleRowButton(scope.$index)"
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
  </div>
</template>

<script>
import ColumnRules from '@/console/red-guard/components/TableWAF/components/ColumnRules'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import ColumnRulesStatus from '@/components/Column/ColumnRulesStatus'
import consoleTable from '@/mixins/consoleTable'
import wafMixin from '@/console/red-guard/mixins/waf'
import ColumnRulesAction from '@/console/red-guard/components/TableWAF/components/ColumnRulesAction'
import DialogRow from '@/console/red-guard/components/TableWAF/components/DialogRow'
import { addReserved } from '@/utils/form'
import baseMixins from './base'
import SELECT from '../../constant/select'

export default {
  components: {
    ColumnRules,
    ColumnBtnSort,
    ColumnRulesStatus,
    ColumnRulesAction,
    DialogRow
  },

  mixins: [baseMixins, consoleTable, wafMixin],

  data() {
    return {
      SELECT,
      config: {
        selectStatus: [
          {
            value: 'off',
            label: 'OFF'
          },
          {
            value: 'on',
            label: 'ON'
          }
        ]
      },
      formDefault: {
        status: 'off'
      },
      formBatch: {
        _pmode: 'append'
      }
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    handleUpdate(data) {
      if (data.id) {
        Object.assign(this.list.find(_ => _.id === data.id), data)
        return
      } else {
        data.id = parseInt(Math.random() * 100000000)
        data.status = '1'
        this.list.unshift(data)
      }
    },

    setForm(form = {}) {
      this.form = {
        ...this.formDefault,
        ...form
      }
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
        ...this.isBatch ? this.formBatch : {}
      }
      if (this.form.status === 'on') {
        form.policys = this.list
      }
      return form
    },
    // 行编辑
    handleRowEdit(form) {
      this.$refs.DialogRow.handleOpen(form)
    },

    initConfig() {
      this.wafFetchSettings()
      const selectStatus = this.config.selectStatus
      this.$emit('initConfig', {
        selectStatus: addReserved(selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
