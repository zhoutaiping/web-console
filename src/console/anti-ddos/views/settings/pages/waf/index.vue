<template>
  <div>
    <DmAlert>
      策略优先级按照 排列顺序由上向下，暂停策略后，本策略不生效
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增规则</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('on')"
      >启用</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('off')"
      >暂停</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('del')"
      >删除</el-button>
      <template slot="right">
        <!-- <InputSearch
          v-model="bindParams.ip"
          placeholder="设备IP"
          @submit="handleSearch"
        /> -->
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      :show-pagination="false"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="adsSettings.ruleList"
          @selection-change="val => multipleSelection = val"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="规则ID"
            min-width="180"
            prop="uuid"
          />
          <el-table-column
            label="规则名称"
            min-width="100"
            prop="ruleName"
          />
          <el-table-column
            label="匹配条件"
            min-width="140"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.matchCondition" />
            </template>
          </el-table-column>
          <el-table-column
            label="处置方式"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.disposalWay | labelView(adsSelects.disposalWay) }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status"
                class="color--success"
              >启用</span>
              <span
                v-else
                class="color--danger"
              >暂停</span>
            </template>
          </el-table-column>
          <el-table-column
            label="优先级"
            width="100"
          >
            <template slot-scope="scope">
              <ColumnBtnSort
                :disabled-up="scope.$index === 0"
                :disabled-down="scope.$index === adsSettings.ruleList.length - 1"
                type="text"
                @on-set-up="handleRuleSort(scope.$index, 'Top')"
                @on-up="handleRuleSort(scope.$index, 'Up')"
                @on-down="handleRuleSort(scope.$index, 'Down')"
                @on-set-down="handleRuleSort(scope.$index, 'Bottom')"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
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
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import consoleTable from '@/mixins/consoleTable'
import DialogRow from './components/DialogRow'
import adsMixins from '../../../../mixins/ads'

export default {
  components: { ColumnBtnSort, DialogRow },

  mixins: [consoleTable, adsMixins],

  data() {
    return {
      loading: false,
      multipleSelection: [],
      selectStatus: [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ],
      bindParams: {
        status: '',
        ip: '',
        nohealth: false,
        clusterId: this.$route.params.id
      }
    }
  },

  methods: {
    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/accurate/execute/${operate}`, this.multipleSelection.map(_ => { return _.uuid }))
          this.Message('ACTION_SUCCESS')
          this.fetchList()
        } catch (e) {
          return
        }
      })
    },

    async handleRuleSort(index, type) {
      const list = this.adsSettings.ruleList
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
        await this.$Ads.post('admin/template/rule/upd', {
          protectTemplateId: this.$route.params.id,
          ruleUidList: list.map(_ => _.uuid).join(',')
        })
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
    },

    async fetchList() {
      this.loading = true
      try {
        await this.adsFetchSettings(this.$route.params.id)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
