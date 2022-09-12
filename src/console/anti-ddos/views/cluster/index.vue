<template>
  <ConsolePageLayout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增集群</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('on')"
      >启用</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('off')"
      >禁用</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('del')"
      >删除</el-button>
      <template slot="right">
        <yd-form-select
          v-model="bindParams.status"
          :selects="selectStatus"
          default-text="使用状态"
          style="width: 120px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.name"
          placeholder="集群名称"
          @change="handleSearch"
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="集群名称"
            min-width="180"
            prop="name"
          />
          <el-table-column
            label="集群设备/健康状态"
            min-width="280"
          >
            <template slot-scope="scope">
              <ColumnDevice :data="scope.row.deviceList" />
            </template>
          </el-table-column>
          <el-table-column
            label="使用状态"
            min-width="80"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status"
                class="color--success"
              >启用</span>
              <span
                v-else
                class="color--danger"
              >禁用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="180"
            prop="note"
          />
          <el-table-column
            label="更新时间"
            min-width="180"
            prop="updateTime"
          />
          <el-table-column
            label="操作"
            align="right"
            width="200"
          >
            <template slot-scope="scope">
              <router-link :to="{ name: 'anti-ddos.router.cluster__device', params: {id: scope.row.uuid}, query: {pageTitle: scope.row.name} }">
                配置设备
              </router-link>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </ConsolePageLayout>
</template>

<script>
import consoleDataAds from '@/mixins/consoleDataAds'
import DialogRow from './components/DialogRow'
import ColumnDevice from './components/ColumnDevice'

export default {
  components: { DialogRow, ColumnDevice },

  mixins: [consoleDataAds],

  data() {
    return {
      API_INDEX: 'admin/cluster/query',
      selectStatus: [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ],
      bindParams: {
        name: '',
        status: '',
        nohealth: false
      }
    }
  },

  methods: {
    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/cluster/execute/${operate}`, this.multipleSelection.map(_ => _.uuid))
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
}
</script>
