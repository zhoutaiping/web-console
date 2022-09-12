<template>
  <div>
    <DmToolbar class="margin-top">
      <el-button
        type="primary"
        @click="handleAdd"
      >新增</el-button>
      <el-button @click="handleDelete(multipleSelection)">删除</el-button>
    </DmToolbar>
    <DmData
      ref="DmData"
      :inner-card="false"
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
          <template slot="empty">
            暂未检测到报告生成计划，请点击
            <el-button
              type="text"
              @click="handleAdd"
            >新增</el-button>
            按钮创建计划
          </template>
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="id"
            label="计划ID"
            width="80"
          />
          <el-table-column
            prop="report_name"
            label="计划名称"
          />
          <el-table-column
            label="计划周期"
            width="100"
          >
            <template slot-scope="scope">
              {{ Number(scope.row.type) | labelView(Label.TASK_CYCLE_ALL) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="计划创建时间"
            width="150px"
          />
          <el-table-column
            label="计划说明"
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.remark || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="120px"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <!-- <el-button
                  type="text"
                  @click="handleDetail(scope.row)"
                >详情</el-button> -->
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  @click="handleDelete(scope.row.id)"
                >删除</el-button>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAdd
      ref="DialogAdd"
      @submit="handleAddSubmit"
    />
    <DialogDetail ref="DialogDetail" />
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import Fetch from '@/api/fetch'
import Label from '../../constants/label'
import DialogAdd from './components/DialogAdd'
import DialogDetail from './components/DialogDetail'
import { formatList } from '@/utils/response'

export default create({
  name: '',

  data() {
    return {
      loading: true,
      Label,
      list: [],
      multipleSelection: [],
      filters: {
        task: '1'
      },
      params: {
        daterange: [],
        report_type: 'plan'
      },
      selectsTask: [
        {
          label: '每日定时计划列表',
          value: '1'
        }
      ]
    }
  },

  components: { DialogAdd, DialogDetail },

  methods: {
    async init(params) {
      this.loading = true
      params = params || this.$refs.DmData.getParams()
      params = {
        ...params,
        ...this.params
      }
      const { list, total } = formatList(await Fetch.post('V4/member.report.getReportList', params))
      this.$refs.DmData.init({ total })
      this.list = list
      this.loading = false
    },

    handleSelectionChange(arr) {
      this.multipleSelection = arr.map(_ => _.id)
    },

    handleAdd() {
      this.$refs.DialogAdd.handleOpen()
    },

    async handleAddSubmit(form) {
      const isEdit = !!form.id
      const Dialog = this.$refs.DialogAdd
      Dialog.loading = true

      const sendUrl = isEdit ? 'V4/member.report.editReport' : 'V4/member.report.addReport'
      try {
        await Fetch.post(sendUrl, form)
        setTimeout(() => {
          Dialog.handleClose()
        }, 547)
        this.$message.success('操作成功')
        this.init()
      } finally {
        Dialog.loading = false
      }
    },

    async handleDelete(id) {
      id = Array.isArray(id) ? id.join(',') : id
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await Fetch.post('V4/member.report.delReport', { id })
        this.$message.success('操作成功')
        this.init()
      })
    },

    async handleEdit(row) {
      const { id } = row
      const data = await Fetch.post('V4/member.report.getPlanDetail', { id })
      data.type = Number(data.type)
      this.$refs.DialogAdd.handleOpen(data)
    },

    async handleDetail(row) {
      const { id } = row
      const data = await Fetch.post('V4/member.report.getPlanDetail', { id })
      this.$refs.DialogDetail.handleOpen(data)
    }
  }
})
</script>
