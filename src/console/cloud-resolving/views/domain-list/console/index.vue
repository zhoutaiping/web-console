<template>
  <console-page-layout>
    <DmAlert :type="statusTips.color">
      <template v-if="statusTips.type === 'used'">
        <p>您已经使用 {{ appAssets.companyEN }} 高防智能 DNS：
          <ColumnListMore v-model="statusTips.yundun_servers" />
        </p>
      </template>
      <template v-else-if="statusTips.type === 'usedError'">
        <p>您未使用分配的云盾 NS 服务器</p>
        <p>请按照以下方式，修改您的域名DNS服务器地址</p>
        <p
          v-for="(item, index) in statusTips.yundun_servers"
          :key="index"
        >
          {{ statusTips.current_servers[index] }} >>> {{ item }}
        </p>
      </template>
      <template v-else-if="statusTips.type === 'notUsedDnsServer'">
        <p>您的 NS 服务器地址未接入</p>
        <p>请按照以下方式，修改您的域名 NS 服务器地址：</p>
        <p
          v-for="(item, index) in statusTips.yundun_servers"
          :key="index"
        >
          {{ statusTips.current_servers[index] }} >>> {{ item }}
        </p>
      </template>
      <template v-else>
        <p>{{ appAssets.companyEN }} 未能查询到您的 DNS 服务器</p>
        <p>
          <template v-if="statusTips.yundun_servers.length">
            请将域名的 NS 服务器修改为：
            <ColumnListMore v-model="statusTips.yundun_servers" />
          </template>
          <template v-else>
            资源分配中
          </template>
        </p>
      </template>
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleRowAdd"
      >添加记录</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleAddToGroups()"
      >添加至分组</el-button>
      <el-button
        :disabled="!selectionId.length"
        type="default"
        @click="handleAction('pause')"
      >暂停</el-button>
      <el-button
        :disabled="!selectionId.length"
        type="default"
        @click="handleAction('open')"
      >启用</el-button>
      <el-button
        :disabled="!selectionId.length"
        type="default"
        @click="handleAction('delete')"
      >删除</el-button>
      <template slot="right">
        <yd-form-select
          :selects="selectGroup"
          v-model="bindParams.group_id"
          default-text="选择分组"
          style="width: 140px"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="dnsSelects.recordType"
          v-model="bindParams.record_type"
          default-text="记录类型"
          style="width: 140px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.record_name"
          placeholder="请输入记录名称进行查询"
          @submit="handleSearch"
        />
      </template>
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
          :expand-row-keys="[NEW_ID]"
          row-key="id"
          @selection-change="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
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
            prop="name"
            min-width="180"
            label="主机记录"
          >
            <template slot-scope="scope">
              <ColumnRecordName
                :ref="`name-${scope.$index}`"
                :scope="scope"
                @focus="rowInputFocus = 'name'"
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
                  @visible-change="rowInputFocus = ''"
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
                @focus="rowInputFocus = 'value'"
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
                    @focus="rowInputFocus = 'mx'"
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
            min-width="140"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <el-input-number
                  v-model="scope.row.ttl"
                  :min="1"
                  :max="604800"
                  style="width: 120px"
                  controls-position="right"
                  placeholder="TTL"
                  @focus="rowInputFocus = 'ttl'"
                />
              </template>
              <template v-else>
                {{ scope.row.ttl }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="备注"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <el-input
                  v-model="scope.row.remark"
                  placeholder="备注"
                />
              </template>
              <template v-else>
                <ColumnRemark
                  :row="scope.row"
                  @submit="handleSubmitRemark"
                />
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="50"
          >
            <template slot-scope="scope">
              <span
                v-if="[2, 6].includes(scope.row.status)"
                class="color--warning"
              >暂停</span>
              <span
                v-else
                class="color--success"
              >启用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="120"
          >
            <template slot-scope="scope">
              <template v-if="!scope.row.$edit">
                <el-tooltip>
                  <template slot="content">
                    <template v-if="scope.row.is_sync_cdn === 0">
                      点击推送至{{ $t('cloud-speed.title') }}
                    </template>
                    <template v-else>
                      已推送至{{ $t('cloud-speed.title') }}
                    </template>
                  </template>
                  <el-link
                    :underline="false"
                    :type="scope.row.is_sync_cdn === 1 ? 'primary' : 'info'"
                    class="ya-iconfont ya-jiasu"
                    @click="handleRowSyncCDN(scope)"
                  />
                </el-tooltip>
                <el-divider direction="vertical" />
              </template>
              <template v-if="scope.row.$edit">
                <el-button
                  type="text"
                  @click="handleRowSave(scope)"
                >保存</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="handleRowCanel(scope)"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="handleRowEdit(scope)"
                >编辑</el-button>
                <el-divider direction="vertical" />
                <PopoverConfirm
                  content="确认删除？"
                  @submit="handleRowDelete(scope)"
                >
                  <el-button type="text">删除</el-button>
                </PopoverConfirm>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddGroups ref="DialogAddGroups" />
  </console-page-layout>
</template>

<script>
import { deepClone } from '@/utils'
import consoleData from '@/mixins/consoleData'
import consoleTable from '@/mixins/consoleTable'
import ColumnRemark from '@/components/Column/ColumnRemark'
import ColumnListMore from '@/components/Column/ColumnListMore'
import ColumnForm from '@/components/Column/ColumnForm'
import TipsRecord from './components/TipsRecord'
import ColumnRecordName from './components/ColumnRecordName'
import ColumnRecordValue from './components/ColumnRecordValue'
import dnsMixins from '../../../mixins/dns'
import DialogAddGroups from './components/DialogAddGroups'

const NEW_ID = 'new'

export default {
  components: { ColumnRemark, ColumnListMore, ColumnForm, TipsRecord, ColumnRecordName, ColumnRecordValue, DialogAddGroups },

  mixins: [consoleTable, consoleData, dnsMixins],

  data() {
    return {
      NEW_ID,
      API_INDEX: 'V4/CloudDns.DomainRecords.list',
      statusTips: {
        color: '',
        message: '',
        yundun_servers: [],
        current_servers: []
      },
      selectGroup: [],
      bindParams: {
        domain_id: this.$route.params.id,
        record_name: '',
        record_type: '',
        group_id: ''
      },
      rowInputFocus: '',
      rowKey: ['name', 'value'],
      selectionId: []
    }
  },

  created() {
    const domain_id = this.$route.params.id
    this.DNS_SET_DOMAIN_ID(domain_id)
    this.dnsFetchDomainInfo()
    this.fetchStatus()
    this.fetchGroup()
  },

  methods: {
    handleRowAdd() {
      const list = this.list
      if (list.some(_ => _.$edit)) return
      this.rowInputFocus = ''
      list.unshift({
        id: NEW_ID,
        name: '',
        type: 'A',
        view: 'any',
        value: '',
        mx: 1,
        ttl: 600,
        $edit: true
      })
    },

    handleAddToGroups() {
      this.$refs.DialogAddGroups.handleOpen({
        member_id: this.$route.params.member_id,
        relation_id: this.selectionId
      })
    },

    async handleRowSave(scope) {
      const { row, $index } = scope
      await this.handleCheckRow($index)
      const form = {
        domain_id: this.bindParams.domain_id,
        record_id: row.id,
        record_name: row.name,
        record_type: row.type,
        record_view: Array.isArray(row.view) ? row.view[row.view.length - 1] : row.view,
        record_value: row.type === 'MX' && row.value[row.value.length - 1] !== '.' ? row.value + '.' : row.value,
        record_ttl: row.ttl,
        record_mx: row.mx,
        record_remark: row.remark,
        remark: row.remark
      }

      try {
        if (form.record_id === NEW_ID) {
          await this.Fetch.post('V4/CloudDns.DomainRecords.add', form)
        } else {
          await this.Fetch.post('V4/CloudDns.DomainRecords.edit', form)
        }
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    handleRowCanel(scope) {
      if (scope.row.id && scope.row.$cache) {
        const cache = scope.row.$cache
        scope.row.name = cache.name
        scope.row.type = cache.type
        scope.row.view = cache.view
        scope.row.value = cache.value
        scope.row.mx = cache.mx
        scope.row.ttl = cache.ttl
        scope.row.$edit = false
      } else {
        this.list.splice(scope.$index, 1)
      }
    },

    handleRowEdit(scope) {
      scope.row.$edit = true
      scope.row.$cache = deepClone(scope.row)
    },

    async handleAction(type) {
      const form = {
        record_ids: this.selectionId,
        domain_id: this.$route.params.id
      }

      const TYPE_MAP = {
        open: 'V4/CloudDns.DomainRecords.batchOpen',
        pause: 'V4/CloudDns.DomainRecords.batchPause',
        delete: 'V4/CloudDns.DomainRecords.batchDelete'
      }

      try {
        await this.Fetch.post(TYPE_MAP[type], form)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async handleRowDelete(scope) {
      const { id } = scope.row
      const form = {
        record_id: id,
        domain_id: this.bindParams.domain_id
      }
      try {
        await this.Fetch.post('V4/CloudDns.DomainRecords.delete', form)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async handleRowSyncCDN(scope) {
      const row = scope.row
      if (row.is_sync_cdn === 1) return
      const form = {
        record_id: row.id,
        domain_id: this.bindParams.domain_id
      }

      try {
        await this.Fetch.get(`V4/CloudDns.DomainRecords.importRecord2CloudSpeed`, form)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async handleSubmitRemark(row) {
      const form = {
        record_id: row.id,
        domain_id: row.domain_id,
        record_remark: row.remark
      }
      try {
        await this.Fetch.post('V4/CloudDns.DomainRecords.edit.remark', form)
      } catch (e) {
        return
      }
      this.fetchList()
    },

    async fetchStatus() {
      let data
      try {
        data = await this.Fetch.get('V4/CloudDns.DomainRecords.getDomainDns', { domain_id: this.bindParams.domain_id })
      } catch (e) {
        // return
      }
      const { code } = data._status
      const { type } = data

      let tipType = 'notUsed'
      let color = 'warning'

      if (code === 1) {
        if (type === 1) {
          tipType = 'used'
          color = 'success'
        } else if (type === 2) {
          tipType = 'usedError'
        }
      } else {
        if (type !== 0) {
          tipType = 'notUsedDnsServer'
        }
      }
      this.statusTips.type = tipType
      this.statusTips.color = color
      this.statusTips.yundun_servers = data.yundun_servers
      this.statusTips.current_servers = data.current_servers
    },

    async fetchGroup() {
      const params = {
        domain_id: this.$route.params.id,
        member_id: this.$route.params.member_id
      }

      const data = await this.Fetch.post('V4/CloudDns.Member.GroupList', params)
      delete data._status
      this.selectGroup = data.map(_ => {
        return {
          label: _.group_name,
          value: _.id
        }
      })
    },

    formatResponse(response) {
      response.list = response.list.map(item => {
        return {
          ...item,
          status: Number(item.status),
          is_sync_cdn: Number(item.is_sync_cdn),
          $edit: false,
          $cache: null
        }
      })

      return response
    }
  }
}
</script>
