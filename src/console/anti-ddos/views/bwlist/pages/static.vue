<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('on')"
      >启用</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('off')"
      >暂停</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('del')"
      >删除</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('ref')"
      >刷新</el-button>
      <template slot="right">
        <yd-form-select
          :selects="selectStatus"
          v-model="bindParams.status"
          default-text="使用状态"
          style="width: 120px"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="selectType"
          v-model="bindParams.black"
          default-text="类型"
          style="width: 120px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.srcIp"
          placeholder="源IP"
          @submit="handleSearch"
        />
        <!-- <InputSearch
          v-model="bindParams.dstIp"
          placeholder="防护目标IP"
          @submit="handleSearch"
        /> -->
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
            label="源IP"
            min-width="180"
          >
            <template slot-scope="scope">
              <ColumnList :list="scope.row.srcIpView" />
            </template>
          </el-table-column>
          <el-table-column
            label="源IP归属地"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.ipArea || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.black ? '黑名单' : '白名单' }}
            </template>
          </el-table-column>
          <el-table-column
            label="防御目标"
            min-width="100"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.global">
                {{ scope.row.clusterId | labelView(adsSelectCluster, 'label', '全部集群') }}
              </template>
              <template v-else>
                {{ scope.row.dstIp }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="140"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status"
                class="color--success"
              >启用</span>
              <span
                v-else
                class="color--danger"
              >暂停</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.note || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="150"
            prop="createTime"
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
  </div>
</template>

<script>
import consoleDataAds from '@/mixins/consoleDataAds'
import ColumnList from '@/components/Column/ColumnList'
import DialogRow from './components/DialogRow'
import adsMixins from '../../../mixins/ads'

export default {
  components: { ColumnList, DialogRow },

  mixins: [consoleDataAds, adsMixins],

  data() {
    return {
      API_INDEX: 'admin/bwlist/query',
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
      selectType: [
        {
          label: '黑名单',
          value: true
        },
        {
          label: '白名单',
          value: false
        }
      ],
      bindParams: {
        status: '',
        srcIp: '',
        dstIp: '',
        black: ''
      }
    }
  },

  created() {
    this.adsFetchClusterList()
  },

  methods: {
    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        item.srcIpView = item.srcIp.split('\n')
        item.blackWhiteType = `${item.global ? 'public' : 'private'}_${item.black ? 'black' : 'white'}`
      })
      return response
    },

    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/bwlist/execute/${operate}`, this.multipleSelection.map(_ => _.uuid))
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
