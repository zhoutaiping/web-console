<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogAdd.handleOpen()"
      >添加资产</el-button>
      <el-button
        type="primary"
        @click="$refs.DialogBatchAdd.handleOpen()"
      >批量添加资产</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleDeleteProperty"
      >删除</el-button>
      <InputSearch
        slot="right"
        v-model="bindParams.property_name"
        placeholder="资产名称 / 资产地址"
        @submit="handleSearch"
      />
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
            label="资产名称"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnPropertyName
                :row="scope.row"
                @init="fetchList"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="认证"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnAuthentication
                :row="scope.row"
                @click="$refs.DialogAuth.handleOpen(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="所属套餐"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.plan_diy_name || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="到期时间"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnExpireTime :expire-time="scope.row.expire_time" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="200"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-dropdown
                  trigger="click"
                  @command="handleAddScan"
                >
                  <el-button
                    type="text"
                    @click="handleAddTask(scope.row)"
                  >
                    添加任务<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                      <!-- :disabled="scope.row.disabledAddContentSafe" -->
                    <el-dropdown-item
                      :command="{row: scope.row, key: 'ContentSafe'}"
                    >内容安全</el-dropdown-item>
                    <el-dropdown-item
                      :disabled="scope.row.disabledScanWeb"
                      :command="{row: scope.row, key: 'ScanWeb'}"
                    >Web漏洞扫描</el-dropdown-item>
                    <!-- 域名类型 -->
                    <!-- <template v-if="scope.row.property_type === 0">
                      <el-dropdown-item
                        :disabled="scope.row.disabledAddDnsMonitor"
                        :command="{row: scope.row, key: 'DnsMonitor'}"
                      >DNS劫持监控{{ scope.row.disabledAddDnsMonitorTips ? `（${scope.row.disabledAddDnsMonitorTips}）` : '' }}</el-dropdown-item>
                    </template> -->
                    <template v-if="[0,1].includes(scope.row.property_type)">
                      <el-dropdown-item
                        :disabled="scope.row.disabledAddUsabilityMonitor"
                        :command="{row: scope.row, key: 'UsabilityMonitor'}"
                      >服务可用性监测</el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <router-link :to="{ name: 'security-operations.router.scan__propertys__id', params: {id: scope.row.id}, query: {pageTitle: scope.row.property_object, property_object: scope.row.property_object, property_type: scope.row.property_type}}">
                  <el-button type="text">详情</el-button>
                </router-link>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAdd
      ref="DialogAdd"
      @init="fetchList"
    />
    <DialogBatchAdd
      ref="DialogBatchAdd"
      @init="fetchList"
    />
    <DialogAuth
      ref="DialogAuth"
      @init="fetchList"
    />
    <DialogAddDnsMonitor ref="DialogAddDnsMonitor" />
    <DialogAddUsabilityMonitor ref="DialogAddUsabilityMonitor" />
    <DialogAddContentSafe ref="DialogAddContentSafe" />
    <DialogAddScanWeb ref="DialogAddScanWeb" />
  </console-page-layout>
</template>

<script>
import RULE from '@/utils/verify'
import consoleData from '@/mixins/consoleData'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import ColumnPropertyName from './components/ColumnPropertyName'
import ColumnAuthentication from './components/ColumnAuthentication'
import DialogAdd from './components/DialogAdd'
import DialogBatchAdd from './components/DialogBatchAdd'
import DialogAuth from './components/DialogAuth'
import DialogAddContentSafe from './components/DialogAddContentSafe'
import DialogAddDnsMonitor from './components/DialogAddDnsMonitor'
import DialogAddUsabilityMonitor from './components/DialogAddUsabilityMonitor'
import DialogAddScanWeb from './components/DialogAddScanWeb'

export default {
  components: { ColumnExpireTime, ColumnPropertyName, ColumnAuthentication, DialogAdd, DialogBatchAdd, DialogAuth, DialogAddContentSafe, DialogAddDnsMonitor, DialogAddUsabilityMonitor, DialogAddScanWeb },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/smgc.property.list',
      bindParams: {
        property_name: ''
      },
      selectionId: []
    }
  },

  methods: {
    async handleAddTask(row) {
      const params = {
        property_id: row.id
      }
      const data = await this.Fetch.post('V4/smgc.property.info', params)
      row.disabledAddDnsMonitor = row.disabledAddDnsMonitor || data.dns_hijack_task_list.length > 0
      row.disabledAddDnsMonitorTips = data.dns_hijack_task_list.length > 0 ? '已添加' : ''

      row.disabledAddContentSafe = row.disabledAddContentSafe || data.risk_list.length > 0
      row.disabledScanWeb = row.disabledScanWeb || data.scan_task_list.length > 0
    },

    formatResponse(response) {
      response.list.forEach(item => {
        // 是否免费版套餐
        const isFreePackage = item.meal_flag === 'YD-SCANMFB'
        // 是否认证
        const isAuthentication = Number(item.property_status) !== 0

        item.property_type = Number(item.property_type)
        // item.disabledAddDnsMonitor = !item.package_id || isFreePackage || !isAuthentication
        item.disabledAddDnsMonitorTips = ''
        // item.disabledAddUsabilityMonitor = !item.package_id
        // item.disabledAddContentSafe = isFreePackage
        // item.disabledScanWeb = isFreePackage

        this.$set(item, 'disabledAddDnsMonitor', !item.package_id || isFreePackage || !isAuthentication)
        this.$set(item, 'disabledAddUsabilityMonitor', !item.package_id)
        this.$set(item, 'disabledAddContentSafe', isFreePackage)
        this.$set(item, 'disabledScanWeb', isFreePackage)
      })
      return response
    },
    // 删除资产
    handleDeleteProperty() {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(async () => {
        await this.Fetch.delete('V4/smgc.property.del', { property_ids: this.selectionId })
        this.fetchList()
      })
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    handleAddScan(data) {
      const { row, key } = data
      const form = {
        property_id: row.id,
        property_ids: [row.id],
        property_object: row.property_object,
        property_type: row.property_type
      }
      if (key === 'ScanWeb') {
        this.$refs.DialogAddScanWeb.handleOpen(form)
      } else if (key === 'HOST_SCAN') {
        if (!RULE.ipReg.test(row.property_object)) {
          this.$message({
            message: '添加主机扫描资产地址必须为 IP',
            type: 'warning'
          })
          return
        }
        if (this.hostNumber === 0) {
          this.$message({
            message: '剩余扫描次数已用完，请购买更多扫描',
            type: 'warning'
          })
          return
        }
        this.$refs.DialogAddHostScan.handleOpen(form)
      } else if (key === 'DDOS_MONITOR') {
        this.$refs.DialogAddDDosMonitor.handleOpen(form)
      } else if (key === 'UsabilityMonitor') {
        this.$refs.DialogAddUsabilityMonitor.handleOpen(form)
      } else if (key === 'DnsMonitor') {
        this.$refs.DialogAddDnsMonitor.handleOpen(form)
      } else if (key === 'ContentSafe') {
        this.$refs.DialogAddContentSafe.handleOpen({
          ...form,
          domain: row.property_object
        })
      }
    }
  }
}
</script>
