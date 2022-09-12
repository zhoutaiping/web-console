<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    title="引用规则集"
    width="850px"
    @submit="handleSubmit"
  >
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        border
      >
        <el-table
          :data="list"
          :expand-row-keys="expandList"
          row-key="id"
          @selection-change="e =>{ selRow = e}"
          @cell-click="cellClick"
        >
          <el-table-column
            type="expand"
            width="1"
          >
            <template slot-scope="scope">
              <RuleList
                ref="RuleList"
                :id="scope.row.id"
                style="margin:10px"
              />
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            v-for="(_, _index) in column"
            :key="_.prop"
            :label="_.label"
            :prop="_.prop"
            :min-width="_.width"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="_.prop === 'policy_num'">
                <el-button
                  type="text"
                  @mouseenter.native="SetExpand(scope.row)"
                >
                  {{ formartValue(scope.row, _.prop) }}
                </el-button>
              </div>
              <span v-else>
                {{ formartValue(scope.row, _.prop) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import createDialog from '@/utils/createDialog'
import RuleList from './Rule-list'
export default createDialog({
  name: 'RulePage',
  components: { RuleList },
  mixins: [consoleData],
  data() {
    return {
      selRow: [],
      bindParams: {
        domain_id: ''
      },
      API_INDEX: 'V4/firewall.policyGroup.tpl.get',
      column: [
        { label: '规则集名称', prop: 'name' },
        { label: '规则数', prop: 'policy_num' },
        { label: '更新时间', prop: 'update_at' },
        { label: '状态', prop: 'status' },
        { label: '备注', prop: 'remark' }
      ],
      expandList: []
    }
  },
  methods: {
    initOptions(form, options) {
      this.bindParams.domain_id = options
      this.expandList = []
      this.$refs.DmData.initPage()
    },

    formartValue(data, prop) {
      let val = data[prop]
      if (prop === 'status') {
        val = val === 'on' ? '启用' : '暂停'
      }
      return val
    },
    SetExpand(data) {
      this.expandList = this.expandList.includes(data.id) ? [] : [data.id]
      if (this.expandList.length) {
        this.$nextTick(() => {
          if (Number(data.policy_num) > 0) this.$refs.RuleList.init()
        })
      }
    },

    cellClick(row, column) {
      this.expandList = []
    },
    async fetchSubmit() {
      if (this.selRow.length === 0) {
        this.$refs.Dialog.resetSubmitLoading()
        this.$message.warning('请选择规则集')
        throw new Error()
      }
      const params = {
        domain_id: this.bindParams.domain_id,
        group_ids: this.selRow.map(i => i.id) || []
      }
      try {
        await this.Fetch.post(`/V4/firewall.policy.tpl.add`, params)
      } catch (e) {
        throw new Error()
      }
      this.Message('ACTION_SUCCESS')
    },
    async handleSubmit(form) {
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
