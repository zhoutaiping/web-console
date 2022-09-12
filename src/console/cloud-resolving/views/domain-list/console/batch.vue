<template>
  <console-page-layout>
    <DmCard>
      <DmAlert>
        <strong class="color--primary">被操作域名：</strong>
        <div>
          <span
            v-for="(item, index) in batchList"
            :key="index"
          >
            <el-divider
              v-if="index"
              direction="vertical"
            />{{ item.label }}
          </span>
        </div>
      </DmAlert>
      <DmTable
        add-button
        border
        @click-add-button="handleRowAdd"
      >
        <el-table
          ref="Table"
          :data="list"
        >
          <el-table-column
            type="expand"
            width="1"
          >
            <template slot-scope="scope">
              <TipsRecord
                :type="scope.row.type"
                :focus="rowInputFocus"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="主机记录"
          >
            <template slot-scope="scope">
              <ColumnRecordName
                :ref="`name-${scope.$index}`"
                :scope="scope"
                @focus="handleRowInputFocus(scope.row, 'name')"
                @blur="handleRowInputBlur(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="记录类型"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <yd-form-select
                  v-model="scope.row.type"
                  :selects="dnsSelects.recordType"
                  @visible-change="handleRowInputFocus(scope.row, '')"
                />
              </template>
              <template v-else>
                {{ scope.row.type | labelView(dnsSelects.recordType) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="线路类型"
            min-width="180"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <el-cascader
                  v-model="scope.row.view"
                  :show-all-levels="false"
                  :options="dnsSelectRecordLine"
                  change-on-select
                  expand-trigger="hover"
                />
              </template>
              <template v-else>
                {{ scope.row.view | labelView(dnsRecordLineList) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="记录值"
            min-width="140"
          >
            <template slot-scope="scope">
              <ColumnRecordValue
                :ref="`value-${scope.$index}`"
                :scope="scope"
                @focus="handleRowInputFocus(scope.row, 'value')"
                @blur="handleRowInputBlur(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="优先级"
            min-width="140"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.type === 'MX'">
                <template v-if="scope.row.$edit">
                  <el-input-number
                    v-model="scope.row.mx"
                    :min="1"
                    :max="50"
                    style="width: 120px"
                    controls-position="right"
                    placeholder="MX"
                    @focus="handleRowInputFocus(scope.row, 'mx')"
                    @blur="handleRowInputBlur(scope.row)"
                  />
                </template>
                <template v-else>
                  {{ scope.row.mx || '--' }}
                </template>
              </template>
              <template v-else>
                {{ '--' }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="TTL"
            min-width="125"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <el-input-number
                  v-model="scope.row.ttl"
                  :min="1"
                  :max="604800"
                  controls-position="right"
                  placeholder="TTL"
                  @focus="handleRowInputFocus(scope.row, 'ttl')"
                  @blur="handleRowInputBlur(scope.row)"
                />
              </template>
              <template v-else>
                {{ scope.row.ttl }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="50"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowDelete(scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
      <el-divider />
      <el-button
        :loading="submitLoading"
        :disabled="!list.length"
        type="primary"
        size="medium"
        @click="handleSubmit()"
      >确认添加</el-button>
    </DmCard>
  </console-page-layout>
</template>

<script>
import consoleTable from '@/mixins/consoleTable'
import TipsRecord from './components/TipsRecord'
import ColumnRecordName from './components/ColumnRecordName'
import ColumnRecordValue from './components/ColumnRecordValue'
import dnsMixins from '../../../mixins/dns'

export default {
  components: {
    TipsRecord,
    ColumnRecordName,
    ColumnRecordValue
  },

  mixins: [consoleTable, dnsMixins],

  data() {
    return {
      batchList: [],
      submitLoading: false,
      rowKey: ['name', 'value'],
      rowInputFocus: '',
      row: {
        name: '',
        type: 'A',
        view: 'any',
        value: '',
        mx: 1,
        ttl: 600,
        $edit: true
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    async handleRowInputFocus(row, focus) {
      this.rowInputFocus = focus
      this.$refs.Table.toggleRowExpansion(row, true)
    },

    async handleRowInputBlur(row) {
      this.$refs.Table.toggleRowExpansion(row, false)
    },

    async handleSubmit() {
      await this.handleCheckList()
      this.submitLoading = true
      const form = {
        domain_ids: this.batchList.map(_ => _.value),
        records: this.list.map(_ => {
          return {
            record_mx: _.mx,
            record_name: _.name,
            record_ttl: _.ttl,
            record_type: _.type,
            record_value: _.value,
            record_view: _.view
          }
        })
      }
      try {
        await this.Fetch.post('V4/CloudDns.DomainRecords.batchAdd', form)
      } catch (e) {
        return
      } finally {
        this.submitLoading = false
      }

      this.Message('TASK_SUBMIT')
      this.$router.push({
        name: 'cloud-resolving.router.jobList'
      })
    },

    init() {
      this.dnsFetchRecordLine()
      const { list = [] } = this.$ls.get('BatchRecordList')
      this.batchList = list
    }
  }
}
</script>
