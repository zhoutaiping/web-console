<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        v-permission="'cloud-resolving.addDomain'"
        type="primary"
        @click="$refs.DialogAddDomain.handleOpen()"
      >添加域名</el-button>
      <router-link
        v-permission="'cloud-resolving.addDomain'"
        :to="{name: 'cloud-resolving.router.domainList__batch-domain-save'}"
      >
        <el-button>批量添加域名</el-button>
      </router-link>
      <el-button
        :disabled="!selectionId.length"
        @click="handleBatchAddRecord"
      >
        批量添加记录</el-button>
      <router-link :to="{name: 'cloud-resolving.router.domainList__importLog'}">
        <el-button>导入记录</el-button>
      </router-link>
      <el-button
        :loading="exportLoading"
        :disabled="!selectionId.length"
        @click="handleExport"
      >导出记录</el-button>
      <el-button
        v-permission="'cloud-resolving.deleteWebsite'"
        :disabled="!selectionId.length"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <yd-form-select
          v-model="bindParams.group_id"
          :selects="selectGroup"
          style="width: 120px"
          default-text="全部分组"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.domain"
          placeholder="请输入域名名称进行查询"
          style="margin-left: 10px"
          @submit="handleSearch"
        />
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
          @selection-change="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="域名"
            min-width="200"
          >
            <template slot-scope="scope">
              <a @click="handleRowAction('console', scope.row)">{{ scope.row.domain }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="trust_status"
            label="托管状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnDomainAccessStatus :row="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="域名状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnDomainStatus :row="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            prop="plan_name"
            label="套餐版本"
            min-width="100"
          />
          <el-table-column
            prop="expiry_time"
            label="到期日期"
            min-width="180"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.plan_name === '免费版'">-</template>
              <template v-else>
                <ColumnExpireTime :expire-time="scope.row.expiry_time" />
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="'cloud-resolving.statisticsDomain'"
                type="text"
                @click="handleRowAction('statistics', scope.row)"
              >统计</el-button>
              <el-divider direction="vertical" />
              <el-button
                v-permission="'cloud-resolving.editDomain'"
                type="text"
                @click="handleRowAction('console', scope.row)"
              >管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddDomain
      ref="DialogAddDomain"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnDomain from '@/components/Column/ColumnDomain'
import ColumnDomainStatus from './components/ColumnDomainStatus'
import ColumnDomainAccessStatus from './components/ColumnDomainAccessStatus'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import DialogAddDomain from './components/DialogAddDomain'
import dnsMixins from '../../mixins/dns'

export default {
  components: {
    ColumnDomain,
    ColumnDomainStatus,
    ColumnDomainAccessStatus,
    ColumnExpireTime,
    DialogAddDomain
  },

  mixins: [consoleData, dnsMixins],

  data() {
    return {
      API_INDEX: 'V4/CloudDns.Domain.DnsDomain.list',
      selectGroup: [],
      exportLoading: false,
      bindParams: {
        group_id: '',
        domain: ''
      },
      selectionList: [],
      selectionId: []
    }
  },

  created() {
    this.fetchGroupList()
  },

  methods: {
    async handleExport() {
      const form = {
        domain_ids: this.selectionId
      }

      this.exportLoading = true
      let data
      try {
        data = await this.Fetch.post(`V4/CloudDns.Domain.DnsDomain.batchExport`, form)
      } catch (e) {
        return
      } finally {
        this.exportLoading = false
      }

      this.Help.download(data.key)
      this.fetchList()
    },

    handleDelete() {
      this.$confirm('此操作将永久删除该域名, 是否继续?', '提示', {
        type: 'warning'
      }).then(async() => {
        const form = {
          domain_ids: this.selectionId
        }
        try {
          await this.Fetch.post('V4/CloudDns.Domain.DnsDomain.batchDelete', form)
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    async fetchGroupList() {
      const data = await this.Fetch.get('/V4/cloud.dns.domain.group.all.list')
      this.selectGroup = data.map(_ => {
        return {
          label: _.group_name,
          value: _.id
        }
      })
    },

    handleBatchAddRecord() {
      this.DNS_SET_DOMAIN_ID()
      const list = this.selectionList.map(_ => {
        return {
          label: _.domain,
          value: _.id
        }
      })

      this.$ls.set('BatchRecordList', {
        userid: this.userInfo.id,
        list
      })
      this.$router.push({
        name: 'cloud-resolving.router.domainList__batch-record-save'
      })
    },

    handleRowAction(action, row) {
      const { id, member_id, domain } = row

      if (action === 'statistics') {
        this.$router.push({
          name: 'cloud-resolving.router.domainList__statistics__resolvingDomain',
          query: {
            domain,
            pageTitle: domain
          }
        })
      } else if (action === 'console') {
        this.$router.push({
          name: 'cloud-resolving.router.domainList__console__record',
          params: {
            id,
            member_id
          },
          query: {
            id,
            member_id,
            pageTitle: domain
          }
        })
      }
    },

    formatResponse(response) {
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
      this.selectionList = selection
    }
  }
}
</script>
