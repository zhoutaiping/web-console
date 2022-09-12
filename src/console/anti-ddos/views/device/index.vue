<template>
  <ConsolePageLayout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增设备</el-button>
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
          :selects="selectStatus"
          v-model="bindParams.status"
          default-text="使用状态"
          style="width: 120px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.ip"
          placeholder="设备IP"
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="集群ID"
            min-width="280"
            prop="clusterId"
          />
          <el-table-column
            label="设备IP"
            min-width="150"
            prop="ip"
          />
          <el-table-column
            label="健康状态"
            min-width="140"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.health"
                class="color--success"
              >正常</span>
              <span
                v-else
                class="color--danger"
              >异常<template v-if="scope.row.tips">（{{ scope.row.tips }}）</template></span>
            </template>
          </el-table-column>
          <el-table-column
            label="使用状态"
            min-width="100"
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
            width="100"
          >
            <template slot-scope="scope">
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

export default {
  components: { DialogRow },

  mixins: [consoleDataAds],

  data() {
    return {
      API_INDEX: 'admin/device/query',
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
        status: '',
        ip: '',
        nohealth: false,
        clusterId: this.$route.params.id
      }
    }
  },

  methods: {
    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/device/execute/${operate}`, this.multipleSelection.map(_ => _.ip))
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
