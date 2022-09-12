<template>
  <div>
    <DmAlert>
      当前套餐版本：
      <ItemPlan
        :data="domainPlanInfo"
        @open="handleMealOpen"
      /><br>
      <template v-if="appName === 'wofang'">
        加速流量限时限量免费中(50G/月)<br>
        1. 仅当域名被托管到沃防云解析后可选择NS接入模式<br>
        2. 当网站回源后，购买的“网站卫士”和“TCP安全加速”服务将一并关闭
      </template>
      <template v-else-if="appName === 'yidun'">
        当网站回源后，购买的 “TCP安全加速” 和 “{{ $t('red-guard.title') }}” 服务将一并关闭
      </template>
      <template v-else>
        <ol v-if="domainPlanInfo.meal_flag && domainPlanInfo.plan_setting && domainPlanInfo.plan_setting.meal">
          <template v-if="domainPlanInfo.meal_flag !== 'YD-WEBAQJS-TY'">
            <li class="num-item">
              域名包限制：单个域名包允许添加10个防护域名，支持添加1个主域名和与其相关的9个子域名或泛域名、或相同主域下的10个子域名或泛域名，
              <ButtonCollapse
                v-model="showMath"
                @click="showMath = !showMath"
              >
                更多
              </ButtonCollapse>
            </li>
            <p v-if="showMath">（域名包计算公式为{ [（x1+y1）/10] + [（x2+y2）/10] + [（x3+y3）/10] +.....}-1，其中x为主域名、y为子域名、[ ]中数值均向上取整）</p>
            <li class="num-item">
              服务用量 <ButtonCollapse
                v-model="showHelp"
                @click="showHelp = !showHelp"
              >
                帮助
              </ButtonCollapse>
            </li>
            <p v-if="showHelp">
              a. 域名包可用配额：套餐赠送：1 个，扩容：{{ domainPlanInfo.domain_packet_kurong_nums || 0 }} 个，已使用：{{ domainPlanInfo.domain_packet_used || 0 }} 个，剩余有效可用：{{ domainPlanInfo.domain_packet_unUsed || 0 }} 个<br>
              <template v-if="domainPlanInfo.plan_setting.meal.mainland_china_bandwidth">
                b. 国内带宽：套餐赠送：{{ domainPlanInfo.plan_setting.meal.mainland_china_bandwidth.value }} Mbps
                <template v-if="domainPlanInfo.plan_setting.cfg.kuorong.mainland_china_bandwidth">
                  , 扩容：{{ domainPlanInfo.plan_setting.cfg.kuorong.mainland_china_bandwidth.buy_num }} Mbps
                </template>
              </template>
              <template v-if="domainPlanInfo.plan_setting.meal.overseas_international_bandwidth">
                ，海外带宽：套餐赠送：{{ domainPlanInfo.plan_setting.meal.overseas_international_bandwidth.value }} Mbps
                <template v-if="domainPlanInfo.plan_setting.cfg.kuorong.overseas_international_bandwidth">
                  , 扩容：{{ domainPlanInfo.plan_setting.cfg.kuorong.overseas_international_bandwidth.buy_num }} Mbps
                </template>
              </template>
              <template v-if="domainPlanInfo.plan_setting.meal.overseas_china_acceleration_bandwidth">
                ，亚太 CN2 带宽：套餐赠送：{{ domainPlanInfo.plan_setting.meal.overseas_china_acceleration_bandwidth.value }} Mbps
                <template v-if="domainPlanInfo.plan_setting.cfg.kuorong.overseas_china_acceleration_bandwidth">
                  , 扩容：{{ domainPlanInfo.plan_setting.cfg.kuorong.overseas_china_acceleration_bandwidth.buy_num }} Mbps
                </template>
              </template>
              <template>
                <br>c. 套餐赠送网站容量：{{ domainMirrorInfo.meal }}，额外扩容：{{ domainMirrorInfo.kuorong }}，剩余可用容量：{{ domainMirrorInfo.remain }}
              </template>
            </p>
          </template>
          <li class="num-item">当网站回源后，购买的 “TCP安全加速” 和 “{{ $t('red-guard.title') }}” 服务将一并关闭</li>
          <li
            v-if="moduleSettings['cloud-speed'].supportNS"
            class="num-item"
          >
            仅当域名被托管到 {{ appAssets.companyEN }} "DNS安全加速" 后可选择NS接入模式
          </li>
        </ol>
      </template>
    </DmAlert>
    <DmToolbar>
      <DmButton
        v-if="isAdd"
        name="button.addWebsite"
        type="primary"
        @click="handleAddWebiste"
      />

      <el-dropdown
        trigger="click"
        @command="handleAction"
      >
        <el-button type="default">
          更多操作<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-if="isAdd"
            command="batchAdd"
          >
            {{ $t('button.batchAddWebsite') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-if="domainPlanInfo.meal_flag !== 'YD-WEBAQJS-TY'"
            command="batchSetting"
          >
            批量配置
          </el-dropdown-item>
          <el-dropdown-item command="batchDelete">
            批量删除
          </el-dropdown-item>
          <el-dropdown-item command="export">
            导出域名
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        :disabled="multipleSelection.length === 0"
        type="default"
        @click="handleDelete"
      >删除</el-button>
      <template slot="right">
        <el-date-picker
          v-if="visibleStartEndTime"
          v-model="daterange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="fetchList()"
        />
        <yd-form-select
          v-model="bindParams.ca_status"
          :selects="selectCaStatus"
          style="width: 110px"
          default-text="证书绑定"
          @change="handleSearch"
        />
        <yd-form-select
          v-show="!isChild"
          v-model="bindParams.group_id"
          :selects="selectGroup"
          style="width: 110px"
          default-text="全部分组"
          @change="handleSearch"
        />
        <el-cascader
          v-if="visibleStartEndTime"
          v-model="user_group_id"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'group_name'
          }"
          class="CascaderTree"
          placeholder="全部组织"
          change-on-select
          style="width: 120px"
          @change="fetchList()"
        />
        <yd-form-select
          v-model="bindParams.protected_status"
          :selects="SELECT.DOMAIN_NODE_OPTIONS"
          style="width: 140px"
          default-text="域名节点调度"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.domain"
          placeholder="请输入进行查询"
          style="width: 260px"
          @submit="handleSearch"
        >
          <yd-form-select
            slot="prepend"
            :selects="selectKeyrowdType"
            v-model="bindParams.search_domain_type"
            style="width: 110px"
          />
        </InputSearch>
      </template>
    </DmToolbar>
    <!-- Data -->
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="网站"
            min-width="180"
          >
            <template slot-scope="scope">
              <a
                :disabled="Number(scope.row.xy_refer_status) === 2"
                type="text"
                @click="handleWebsiteOperate('console', scope.row)"
              >{{ scope.row.domain }}</a>
            </template>
          </el-table-column>
          <el-table-column
            label="网站名称"
            min-width="150"
            prop="domain_name"
          >
            <template slot-scope="scope">
              <ColumnFormInput
                :tooltip="scope.row.domain_name ? scope.row.domain_name : undefined"
                v-model="scope.row.domain_name"
                :value-view="scope.row.domainNameBasic"
                :fetch-submit="domain_name => handleUpdateRow({domain_name}, 1, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="接入状态 / 服务状态"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnDomainStatus :row="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            label="接入模式"
            min-width="180"
          >
            <template slot-scope="scope">
              <ColumnInsertMode
                :row="scope.row"
                @init="fetchList"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="visibleStartEndTime"
            label="开始时间"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnPopoverDate
                :value="Number(scope.row.begin_time) === 0 ? null : (datetime(scope.row.begin_time, 'YYYY-MM-DD', 'X'))"
                :fetch-submit="begin_time => handleUpdateRow({begin_time}, 2, scope.row)"
                :disabled="isChild"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="visibleStartEndTime"
            label="到期时间"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnPopoverDate
                :value="Number(scope.row.expire_time) === 0 ? null : (datetime(scope.row.expire_time, 'YYYY-MM-DD', 'X'))"
                :fetch-submit="expire_time => handleUpdateRow({expire_time}, 3, scope.row)"
                :disabled="isChild || Number(scope.row.begin_time) === 0"
              >
                <template v-if="Number(scope.row.expire_status) == 2">
                  <a class="color--danger">
                    已到期
                  </a>
                </template>
              </ColumnPopoverDate>
            </template>
          </el-table-column>
          <el-table-column
            label="域名节点调度"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnSelect
                v-model="scope.row.protected_status"
                :selects="scope.row.nodeOptions"
                :disabled="scope.row.disabledChangeNode"
                @change="val => handleChangeMode(val, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="visibleStartEndTime"
            label="组织"
            min-width="180"
          >
            <template slot-scope="scope">
              <ColumnListMore
                v-if="scope.row.groups && scope.row.groups.length"
                :value="scope.row.groups.map(_ => _.group_name)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  :disabled="Number(scope.row.xy_refer_status) === 2"
                  type="text"
                  @click="handleWebsiteOperate('console', scope.row)"
                >控制台</el-button>
                <el-dropdown
                  size="small"
                  trigger="click"
                  @command="handleRowCommand"
                >
                  <el-button type="text">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :command="{scope, cmd: 'Redirect'}"
                      :disabled="scope.row.domain_redirect_status === 0"
                    >
                      显隐性转发
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddWebsite ref="DialogAddWebsite" />
    <DialogRedirect
      ref="DialogRedirect"
      @submit="handleSubmitRedirect"
    />
    <Renew
      ref="renew"
      :data="domainPlanInfo"
    />
    <UpMeal
      ref="up"
      :data="domainPlanInfo"
    />
    <Kuorong
      ref="kuorong"
      :data="domainPlanInfo"
    />
  </div>
</template>

<script>
import lockr from 'lockr'
import consoleData from '@/mixins/consoleData'
import domainMixins from '@/mixins/domain'
import ColumnProtectedMode from '@/components/Column/ColumnProtectedMode'
import ColumnDomainService from '@/components/Column/ColumnDomainService'
import ColumnDomain from '@/components/Column/ColumnDomain'
import ColumnListMore from '@/components/Column/ColumnListMore'
import ColumnFormInput from '@/components/Column/ColumnFormInput'
import ColumnPopoverDate from '@/components/Column/ColumnPopoverDate'
import ButtonCollapse from '@/components/Button/ButtonCollapse'
import ItemPlan from './components/ItemPlan'
import Renew from './components/renew'
import UpMeal from './components/up-meal'
import Kuorong from './components/kuorong'
import SELECT from '../../constant/select'
import ColumnDomainStatus from '../../components/ColumnDomainStatus'
import DialogRedirect from './components/DialogRedirect'
import ColumnInsertMode from './components/ColumnInsertMode'
import DialogAddWebsite from './components/DialogAddWebsite'
import { getUserstore } from '@/utils/auth'
import { countByteLen, cutStr } from '@/utils/util'
import { datetime } from '@/utils/filter'

const EDIT_TYPES = {
  DOMAIN_NAME: 1,
  BEGIN_TIME: 2,
  EXPIRE_TIME: 3
}

export default {
  components: {
    DialogAddWebsite,
    ColumnProtectedMode,
    ColumnDomainService,
    ColumnDomainStatus,
    ColumnListMore,
    ColumnDomain,
    ItemPlan,
    DialogRedirect,
    ColumnInsertMode,
    ColumnFormInput,
    ColumnPopoverDate,
    ButtonCollapse,
    Renew,
    UpMeal,
    Kuorong
  },

  mixins: [consoleData, domainMixins],

  data() {
    return {
      showMath: false,
      showHelp: false,
      EDIT_TYPES,
      datetime,
      API_INDEX: 'V4/Web.Domain.list',
      SELECT,
      selectGroup: [],
      treeData: [],
      daterange: [],
      user_group_id: [],
      bindParams: {
        group_id: '',
        protected_status: '',
        domain: '',
        search_domain_type: 1,
        ca_status: ''
      },
      selectKeyrowdType: [
        {
          label: '域名',
          value: 1
        },
        {
          label: '网站名称',
          value: 2
        }
      ],
      selectCaStatus: [
        {
          label: '已绑定',
          value: 1
        },
        {
          label: '未绑定',
          value: 0
        }
      ],
      multipleSelection: []
    }
  },
  computed: {
    isChild() {
      const { userType } = getUserstore()
      return userType === 'child'
    },
    isAdd() {
      const { userType } = getUserstore()
      return !(this.appAssets.companyEN === 'Westone' && userType === 'child')
    },
    visibleStartEndTime() {
      return this.appAssets.companyEN === 'Westone'
    }
  },

  created() {
    this.fetchGroupList()
    this.fetchTree()
    this.domainFetchPlanInfo(true)
  },

  methods: {
    async handleUpdateRow(form, edit_type, row) {
      if (edit_type === EDIT_TYPES.EXPIRE_TIME) {
        const { expire_time } = form
        const timex = Number(datetime(expire_time, 'X', 'YYYY-MM-DD'))
        if (timex < Number(row.begin_time)) {
          this.$message.warning('到期时间需要大于等于开始时间')
          throw new Error()
        }
      }

      if (edit_type === EDIT_TYPES.DOMAIN_NAME) {
        const { domain_name } = form
        if (domain_name && domain_name.length > 64) {
          this.$message.warning('大于最大长度')
          throw new Error()
        }
      }

      const { id } = row
      try {
        await this.Fetch.post('V4/Web.Domain.edit.batch', {
          // ...row,
          domain_ids: [id],
          edit_type,
          ...form
        })
      } catch (e) {
        return
      }
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    },

    async fetchTree() {
      const { list = [] } = await this.Fetch.get('V4/permission.get.subUserGroupTree')
      this.treeData = list
    },

    formatParams(params) {
      const send = {
        ...params
      }

      if (this.daterange && this.daterange.length) {
        const [start_time, end_time] = this.daterange
        Object.assign(send, {
          start_time, end_time
        })
      }

      if (this.user_group_id.length) send.user_group_id = this.user_group_id[this.user_group_id.length - 1]
      return send
    },
    handleAction(cmd) {
      if (cmd === 'batchAdd') {
        this.$router.push({
          name: 'cloud-speed.router.batch-add'
        })
      } else if (cmd === 'batchSetting') {
        if (this.multipleActionDisable) {
          this.$message.warning('请选择域名')
          return
        }
        this.handleBatchSetting()
      } else if (cmd === 'batchDelete') {
        this.$router.push({ name: 'cloud-speed.router.batch-delete' })
      } else if (cmd === 'export') {
        this.handleExport()
      }
    },
    // 导出域名
    async handleExport() {
      const params = this.formatParams()
      const data = await this.Fetch.get('V4/Web.Domain.list.export', params)
      this.Help.download(data.key)
    },

    handleRowWebsiteOperate(scope) {
      this.handleWebsiteOperate('console', scope.row)
    },
    // 提交显隐性转发配置
    async handleSubmitRedirect(data) {
      const form = {
        status: data._status === 'off' ? 'off' : 'on'
      }

      if (form.status === 'on') {
        form.jump_type = data._status
        form.jump_to = data.jump_to
      }

      try {
        await this.Fetch.put('/V4/web.domain.set.save', {
          domain_id: data.domain_id,
          group: {
            domain_redirect: form
          }
        })
      } catch (e) {
        this.$refs.DialogRedirect.resetSubmitLoading()
        return
      }
      this.$message.success('操作成功')
      this.fetchList()
      this.$refs.DialogRedirect.handleClose()
    },
    // 行更多操作
    async handleRowCommand(data) {
      const { scope } = data
      const { id: domain_id } = scope.row
      const form = {
        domain_id
      }
      const res = await this.Fetch.get(`/V4/web.domain.set.get`, {
        domain_id,
        group: 'domain_redirect'
      })
      const { domain_redirect: resForm } = res
      if (resForm.status) {
        form._status = resForm.status === 'on' ? resForm.jump_type : 'off'
        form.jump_to = resForm.jump_to
      }
      this.$refs.DialogRedirect.handleOpen(form)
    },
    // 读取分组
    async fetchGroupList() {
      const data = await this.Fetch.get('/V4/web.domain.group.list', { per_page: 1000 })
      this.selectGroup = data.list.map(_ => {
        return {
          label: _.group_name,
          value: _.id
        }
      })
    },
    // 进入批量配置
    handleBatchSetting() {
      const domainList = this.multipleSelection.map(_ => {
        return {
          value: _.id,
          label: _.domain
        }
      })

      const domainNot = []
      this.multipleSelection.forEach(_ => {
        if (['3', '5', '6', ' 7'].includes(_.check_status)) {
          domainNot.push(_.domain)
          return true
        }
      })
      if (domainNot.length > 0) {
        this.$message.warning(`${domainNot.join(' | ')} 不能进行批量配置（未通过审核或已设置回源）`)
        return
      }

      this.$router.push({
        name: 'cloud-speed.router.websiteList__batch-setting'
      })
      lockr.set('batch-domains', domainList)
    },

    async handleAddWebiste() {
      const data = await this.Fetch.get('sso/V4/getCertificationInfo')
      const state = data.check_status

      if (!['1', '4', '5', '6'].includes(state)) {
        this.$message.warning('添加网站前，需先待用户认证审核通过')
        return
      }

      this.$refs.DialogAddWebsite.handleOpen()
    },

    formatResponse(response) {
      const { list = [] } = response

      list.forEach(item => {
        const check_status = Number(item.check_status)
        item.disabledChangeNode = [0, 1, 3, 5, 6, 7].includes(check_status)
        item.joinLoading = false
        item.domainNameBasic = countByteLen(item.domain_name) > 24 ? cutStr(item.domain_name, 24) + '...' : item.domain_name
        item.nodeOptions = this.isChild ? [{
          value: '0',
          label: '回源',
          disabled: false
        },
        {
          value: '1',
          label: `${this.$t('cloud-speed.title')}网络`,
          disabled: false
        }] : [
          {
            value: '0',
            label: '回源',
            disabled: false
          },
          {
            value: '1',
            label: `${this.$t('cloud-speed.title')}网络`,
            disabled: false
          },
          {
            value: '2',
            label: 'TCP安全加速网络',
            disabled: Object.is(item.tjkd_plus_status, '0') && Object.is(item.tjkd_status, '0')
          }
        ]
      })

      this.$nextTick(() => {
        this.list.length && this.detectionJoin()
      })
      return response
    },
    // 获取接入状态
    async detectionJoin() {
      const useData = await this.Fetch.get('V4/Web.Domain.check.cname.use.yundun', {
        domain_ids: this.list.map(_ => _.id).join(',')
      })

      this.list.forEach(item => {
        if (useData[item.domain]) {
          item.use_yundun = useData[item.domain].use_yundun
        }
      })
    },
    // 切换域名节点调度
    async handleChangeMode(protected_status, row) {
      row.protected_status = protected_status
      const param = {
        domain_id: row.id,
        protected_status: row.protected_status
      }
      if (
        Object.is(row.protected_status, '2') &&
        Object.is(row.tjkd_status, '1')
      ) {
        param.protected_status = '1'
        try {
          await this.Fetch.post('V4/Tjkd.plus.domain.change.protect.status', param)
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
      } else {
        try {
          await this.Fetch.post('V4/Web.Domain.change.node', param)
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
      }
      this.fetchList()
    },
    // 网站控制操作
    handleWebsiteOperate(operate, row, index) {
      const id = row.id
      switch (operate) {
        case 'console':
          if (Object.is(row.check_status, '7')) {
            return
          }
          this.$router.push({
            name: 'cloud-speed.router.websiteList__console__id',
            params: { id },
            query: { pageTitle: row.domain }
          })
          break
      }
    },
    // 删除
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleDelete() {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchDelete(this.multipleSelection)
      })
    },

    async fetchDelete(selection) {
      const params = {
        domain_id: selection.map(_ => _.id)
      }
      try {
        await this.Fetch.delete(`V4/Web.Domain.remove`, params)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
      this.domainFetchPlanInfo(true)
    },

    handleMealOpen(type) {
      if (type === 'renew') {
        this.$refs.renew.handleOpen()
      } else if (type === 'up') {
        this.$refs.up.handleOpen()
      } else if (type === 'kuorong') {
        this.$refs.kuorong.handleOpen()
      }
    }
  }
}
</script>

<style lang="scss">
.CascaderTree {
  input::placeholder {
    color: #606266;
  }
}
</style>
