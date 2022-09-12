<template>
  <console-page-layout>
    <DmToolbar>
      <TipsButton>
        <el-button
          hide-null
          type="primary"
        >添加套餐</el-button>
      </TipsButton>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            prop="package_name"
            label="套餐名称"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnPackageName
                :row="scope.row"
                @init="fetchList"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="套餐到期时间"
            min-width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.expire_status === '0'">
                <ColumnExpireTime :expire-time="scope.row.expire_time" />
              </div>
              <div v-else-if="scope.row.expire_status === '1'">
                <ColumnExpireTime :expire-time="scope.row.expire_time" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="package_type_name"
            label="套餐"
            min-width="100"
          />
          <el-table-column
            label="CNAME(仅非网站使用)"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnCname
                :disabled="scope.row.package_type_name === '共享版'"
                :row="scope.row"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="防护IP"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnList
                :list="scope.row.ips"
                :num="4"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="配置数量"
            min-width="160"
          >
            <template slot-scope="scope">
              <ColumnSettingNum :row="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            label="健康检查"
            min-width="140"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.healthy_conf_flag">
                <div>回源失败统计时间间隔：<a @click="handleEditHelthy(scope.row)">{{ scope.row.fails_timeout }} 秒</a></div>
                <div>回源失败次数统计：<a @click="handleEditHelthy(scope.row)">{{ scope.row.max_fails }} 次</a></div>
                <div>切换到新源IP的保持时间：<a @click="handleEditHelthy(scope.row)">{{ scope.row.keep_new_src_time }} 秒</a></div>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="handleEditHelthy(scope.row)"
                >设置健康检查</el-button>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="套餐节点调度"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnSelect
                v-model="scope.row.node_status"
                :selects="scope.row.nodeOptions"
                @change="val => handleChangeNode(val, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="操作"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="statusAtNow(scope.row)"
              >实时状态</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <yd-dialog
      :visible.sync="realTimeStatusDialog"
      title="实时状态"
      @close="clearInterBeforeClose"
    >
      IP实时状态：
      <el-select
        v-model="ipSelectValue.value"
        size="small"
        placeholder="请选择"
        class="ip-select-dialog"
        @change="IpChangeFun"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-row>
        <el-col :span="12">
          <yd-card height="100">
            <item-number
              :loading="statusLoading"
              v-model="inBefore"
              :unit="unit"
              title="流入清洗前"
            />
          </yd-card>
        </el-col>
        <el-col :span="12">
          <yd-card height="100">
            <item-number
              :loading="statusLoading"
              v-model="inAfter"
              :unit="unit"
              title="流入清洗后"
            />
          </yd-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <yd-card height="100">
            <item-number
              :loading="statusLoading"
              v-model="outBefore"
              :unit="unit"
              title="流出清洗前"
            />
          </yd-card>
        </el-col>
        <el-col :span="12">
          <yd-card height="100">
            <item-number
              :loading="statusLoading"
              v-model="outAfter"
              :unit="unit"
              title="流出清洗后"
            />
          </yd-card>
        </el-col>
      </el-row>
    </yd-dialog>
    <DialogHealthy
      ref="DialogHealthy"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import ColumnPackageName from './components/ColumnPackageName'
import ColumnCname from '@/components/Column/ColumnCname'
import TaichiPlusResource from '@/console/taichi-plus/resource/TaichiPlusResource'
import ItemNumber from '@/components/Item/ItemNumber'
import ColumnList from '@/components/Column/ColumnList'
import ColumnSettingNum from './components/ColumnSettingNum'
import DialogHealthy from './components/DialogHealthy'

export default {
  components: {
    ItemNumber,
    ColumnList,
    ColumnExpireTime,
    ColumnPackageName,
    ColumnCname,
    ColumnSettingNum,
    DialogHealthy
  },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/Tjkd.plus.package.list',
      statusLoading: false,
      realTimeStatusDialog: false,
      packageUpgradeDialog: false,
      protectLevelDialog: false,
      options: [],
      ipSelectValue: '',
      statusAtNowParams: {},
      summaryList: [],
      nearlyOutTimeNum: 0,
      inBefore: 0,
      inAfter: 0,
      outBefore: 0,
      outAfter: 0,
      unit: '',
      packageIdCache: ''
    }
  },

  beforeDestroy() {
    this.clearInterBeforeClose()
  },

  methods: {
    handleEditHelthy(row) {
      if (row.tcp_rule === 0) {
        this.$message.warning('请在添加四层转发规则后设置健康检查')
        return
      }
      this.$refs.DialogHealthy.handleOpen({
        ...row,
        package_id: row.id
      })
    },

    async handleChangeNode(protect_node_type, row) {
      const params = {
        package_id: row.id,
        protect_node_type
      }

      try {
        await this.Fetch.post('V4/Tjkd.plus.package.change.protect.node', params)
      } catch (e) {
        return
      } finally {
        this.fetchList()
      }
      this.Message('ACTION_SUCCESS')
    },

    IpChangeFun() {
      this.statusLoading = true
      this.statusAtNowParams = {
        package_id: this.packageIdCache,
        ip: this.ipSelectValue.value
      }
      // 清除掉原来的间歇定时器
      if (this.interval !== '') {
        clearInterval(this.interval)
      }
      this.interval = setInterval(this.getStatusAtNow, 3000)
    },

    clearInterBeforeClose() {
      if (this.interval !== '') {
        clearInterval(this.interval)
      }
    },

    statusAtNow(row) {
      this.statusLoading = true
      if (this.interval !== '') {
        clearInterval(this.interval)
      }
      this.options = []
      row.ips.forEach((v, i) => {
        this.options.push({
          label: v.value,
          value: v.value
        })
      })
      this.ipSelectValue = row.ips[0]

      // 由于弹出框里面获取不到当前的套餐ID： package_id
      // 所以在弹出框内切换IP之前，预先把套餐ID缓存在data层
      // 当随后切换套餐详情的时候，套餐ID也会在这里被正确的重新覆写
      this.packageIdCache = row.id
      this.statusAtNowParams = {
        package_id: row.id,
        ip: this.ipSelectValue.value
      }
      this.interval = setInterval(this.getStatusAtNow, 3000)
      this.realTimeStatusDialog = true
    },

    getStatusAtNow() {
      if (this.statusAtNowParams.ip === undefined) {
        return
      }
      this.statusLoading = true
      TaichiPlusResource.getStatusAtNow(this.statusAtNowParams).then(
        response => {
          const param = response.data.data.list
          this.unit = response.data.data.unit
          if (param.length === 0) {
            this.inBefore = this.inAfter = this.outBefore = this.outAfter = 0
          } else {
            this.inBefore = param.trafficin_before
            this.inAfter = param.trafficin_after
            this.outBefore = param.trafficout_before
            this.outAfter = param.ttrafficout_after
          }
          this.statusLoading = false
        }
      )
    },

    formatResponse(response) {
      response.list.forEach(item => {
        item.ips = item.ips.map(value => {
          return { value }
        })
        item.nodeOptions = [
          {
            value: '1',
            label: 'TCP安全加速网络',
            disabled: !item.tjkd_node_status
          }
        ]
      })
      return response
    }
  }
}
</script>
