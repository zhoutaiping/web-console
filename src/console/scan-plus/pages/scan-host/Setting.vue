<template>
  <div :class="b()">
    <DmToolbar class="margin-top">
      <div slot="right">
        <InputSearch
          v-model="params.host_ip"
          placeholder="请输入主机IP进行查询"
          @submit="handleSearch"
        />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      :inner-card="false"
      class="margin-top"
      @init="init"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            label="主机名称"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.host_name || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            label="主机IP"
            prop="host_ip"
            min-width="150"
          />
          <el-table-column
            label="配置类型"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.scan_type | labelView(Label.TIMING_SETTING) }}
            </template>
          </el-table-column>
          <el-table-column
            label="扫描情况"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnScanStatus :row="scope.row"/>
            </template>
          </el-table-column>
          <el-table-column
            label="添加时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  :disabled="scope.row.scan_type === 1 || scope.row.scan_status === 5"
                  type="text"
                  @click="handleEdit(scope.row)"
                >管理</el-button>
                <el-button
                  :disabled="scope.row.scan_type === 1 || scope.row.scan_status === 5"
                  type="text"
                  @click="handleCancel(scope.row)"
                >取消剩余计划</el-button>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddHostScan
      ref="DialogAddHostScan"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import Fetch from '@/api/fetch'
import { formatList } from '@/utils/response'
import TipsQuota from '@/components/Tips/TipsQuota'
import { merge } from 'lodash/object'
import Label from '../../constants/label'
import ColumnScanStatus from '../../components/ColumnScanStatus'
import DialogAddHostScan from '../../components/DialogAddHostScan'
import { formatHostForm } from '../../constants/format'

export default create({
  name: '',

  components: { TipsQuota, ColumnScanStatus, DialogAddHostScan },

  data() {
    return {
      Label,
      title: '',
      loading: true,
      list: [],
      params: {
        host_ip: ''
      }
    }
  },

  methods: {
    handleSearch() {
      this.$refs.DmData.initPage()
    },

    async handleEdit(form) {
      const params = {
        id: form.id,
        type: 'getInfo'
      }
      const data = await Fetch.post('/V4/host.scan.editRecord', params)
      data.host_name = form.property_name // TODO
      data.notice_type = form.notice_type.map(Number)
      formatHostForm(data)
      this.$refs.DialogAddHostScan.handleOpen(data, 'EDIT')
    },
    // 取消剩余计划
    async handleCancel(row) {
      const params = {
        task_id: row.task_id,
        ope_action: 'stop'
      }
      let messsage
      try {
        messsage = await Fetch.post('/V4/host.scan.editPlanStatus', params)
      } catch (e) {
        return
      }
      this.init()
      this.$message({
        type: 'success',
        message: messsage || '操作成功'
      })
    },

    async handleEditSubmit(form) {
      try {
        const { _mode: mode } = form
        if (mode === 'EDIT') {
          delete form._mode
          form.type = 'edit'
          await Fetch.post('/V4/host.scan.editRecord', form)
        } else {
          await Fetch.post('/V4/host.scan.addRecord', form)
        }

        this.$message({
          type: 'success',
          message: mode === 'EDIT' ? '编辑成功' : '添加成功'
        })
      } catch (e) {
        return
      }
      this.$refs.DialogAddHostScan.handleClose()
      this.init()
    },

    async init(params) {
      params = params || this.$refs.DmData.getParams()
      this.loading = true
      try {
        const { list, total } = formatList(await Fetch.post('/V4/host.scan.getList', merge(params, this.params)))
        list.forEach(item => {
          formatHostForm(item)
        })
        this.list = list
        this.$refs.DmData && this.$refs.DmData.init({ total })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
