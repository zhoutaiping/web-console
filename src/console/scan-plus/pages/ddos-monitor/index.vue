<template>
  <console-page-layout
    :class="b()"
    title="DDOS 攻击监测"
  >
    <yd-alert>
      当前账号剩余监控 IP 数：{{ quota.nouse_ip }}个（C段{{ quota.noused_ip_c }}个）
    </yd-alert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogAddDDosMonitor.handleOpen()"
      >新增监测对象</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        @click="handleMultipleAction('Delete')"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="params.ip"
          placeholder="请输入监测对象进行查询"
          @submit="handleSearch"
        />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      class="margin-top"
      @init="init"
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
          <el-table-column label="监测对象">
            <template slot-scope="{ row }">
              <router-link :to="`ddos-monitor/${row.id}`">
                {{ row.ips }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="最近攻击时间"
            prop="last_attack_time"
          />
          <el-table-column
            label="攻击总数"
            prop="attack_total"
          />
          <el-table-column
            label="到期时间"
            prop="end_time"
          />
          <el-table-column label="监控状态">
            <template slot-scope="scope">
              <ColumnStatus
                v-model="scope.row.status"
                :settings="LABEL.DDOS_MONITOR_STATUS"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="200"
          >
            <template slot-scope="{ row }">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="handleAction('Edit', row)"
                >修改配置</el-button>
                <router-link :to="`ddos-monitor/${row.id}`">
                  <el-button type="text">查看详情</el-button>
                </router-link>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddDDosMonitor
      ref="DialogAddDDosMonitor"
      @submit="handleAddDDosMonitor"
    />
  </console-page-layout>
</template>

<script>
import create from '@/utils/create-basic'
import { formatList, mergeParams } from '@/utils/response'
import Fetch from '@/api/fetch'
import appMixins from '../../mixins/app'
import DialogAddDDosMonitor from '../../components/DialogAddDDosMonitor'

export default create({
  name: '',

  components: { DialogAddDDosMonitor },

  mixins: [appMixins],

  data() {
    return {
      loading: true,
      quota: {
        nouse_ip: 0,
        noused_ip_c: 0
      },
      list: [],
      multipleSelection: [],
      params: {
        used_ip: ''
      }
    }
  },

  methods: {
    handleSelectionChange(arr) {
      this.multipleSelection = arr
    },

    handleMultipleAction(action) {
      this.$confirm('确认操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleAction(action)
      })
    },

    async handleAction(action, row) {
      if (action === 'Edit') {
        // const id = row.id
        // const data = await Fetch.post('/V4/ddos.ip.detail', { id })
        const form = {
          id: row.id,
          plan_id: row.plan_id,
          ips: row.ips,
          remark: row.remark,
          notice_type: row.notice_type,
          notice_member_ids: row.notice_member_ids || []
        }
        this.$refs.DialogAddDDosMonitor.handleOpen(form, 'EDIT')
      } else if (action === 'Delete') {
        this.init()
        const params = {
          ids: row ? row.id : this.multipleSelection.map(_ => _.id)
        }
        this.handleDelete(params)
      }
    },

    async handleDelete(params) {
      this.loading = true
      try {
        await Fetch.post('/V4/ddos.ip.delete', params)
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.init()
    },

    async handleAddDDosMonitor(form) {
      const { _mode } = form
      delete form._mode
      try {
        await Fetch.post('/V4/ddos.ip.save', form)
      } catch (e) {
        return
      } finally {
        this.$refs.DialogAddDDosMonitor.submitLoading = false
      }
      this.$message({
        message: _mode === 'EDIT' ? '修改成功' : '添加成功',
        type: 'success'
      })
      this.init()
      this.$refs.DialogAddDDosMonitor.handleClose()
    },

    handleSearch() {
      this.$refs.DmData.initPage()
    },

    async init(params) {
      params = params || this.$refs.DmData.getParams()
      params.pagesize = params.per_page
      params.plan_id = 1
      this.loading = true
      try {
        const data = await Fetch.post('/V4/ddos.ip.list', mergeParams(params, this.params))
        const { list, total } = formatList(data)
        list.forEach(item => {
          item.status = Number(item.status)
        })
        this.list = list
        this.quota.noused_ip_c = data.noused_ip_c || 0
        this.quota.nouse_ip = data.nouse_ip || 0
        this.$refs.DmData.init({ total })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
