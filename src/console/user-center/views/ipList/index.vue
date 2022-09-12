<template>
  <ConsolePageLayout>
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="IP列表"
    >
      <template slot="tips">账号级全局的IP列表，通过本列表，您可以管理数万个IP地址并在精准访问控制中引用它们，简化批量操作</template>
      <DmAlert>
        支持IPv4、IPv6、CIDR（如1.1.1.1/24）格式，且每个IP列表允许添加的IP上限为20万个
      </DmAlert>
      <DmToolbar>
        <el-button
          type="primary"
          @click="$refs.DialogCreate.handleOpen()"
        >新增IP列表</el-button>
        <el-button
          :disabled="!multipleSelection.length"
          @click="handleDelete(multipleSelection.map(_ => _.id))"
        >删除</el-button>
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              label="规则名称"
              prop="name"
              min-width="150"
            />
            <el-table-column
              label="IP条数"
              min-width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="$refs.DialogRow.handleOpen(scope.row)"
                >{{ scope.row.item_num }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.remark || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              label="添加时间"
              prop="created_at"
              min-width="180"
            />
            <el-table-column
              label="操作"
              align="right"
              min-width="150"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="$refs.DialogCreate.handleOpen(scope.row)"
                >编辑</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="$refs.DialogRow.handleOpen(scope.row)"
                >管理</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="handleDelete([scope.row.id])"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
    </CardItemForm>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
    <DialogCreate
      ref="DialogCreate"
      @init="fetchList"
    />
    <DialogAlert ref="DialogAlert" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogCreate from './components/DialogCreate'
import DialogRow from './components/DialogRow'
import DialogAlert from './components/DialogAlert'

export default {
  components: { DialogCreate, DialogRow, DialogAlert },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/user.ip.list',
      bindParams: {},
      selectionId: []
    }
  },

  methods: {
    handleDelete(ids) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.delete('V4/user.ip.del', { ids })
        } catch (e) {
          if (e && e.data && Array.isArray(e.data)) {
            this.$refs.DialogAlert.handleOpen(e)
          }
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
}
</script>
