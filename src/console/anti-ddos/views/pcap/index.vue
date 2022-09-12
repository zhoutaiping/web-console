<template>
  <ConsolePageLayout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增抓包任务</el-button>
      <!-- <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('on')"
      >开始</el-button> -->
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('off')"
      >停止</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('del')"
      >删除</el-button>
      <template slot="right">
        <InputSearch
          v-model="bindParams.dstIp"
          placeholder="目标IP"
          @submit="handleSearch"
        />
        <InputSearch
          v-model="bindParams.srcIp"
          placeholder="源IP"
          @submit="handleSearch"
        />
        <yd-form-select
          :selects="adsSelectCluster"
          v-model="bindParams.clusterId"
          default-text="清洗集群"
          style="width: 180px"
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
            label="名称"
            min-width="100"
            prop="name"
          />
          <el-table-column
            label="抓包方向"
            min-width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.stage | labelView(adsSelects.stage) }}
            </template>
          </el-table-column>
          <el-table-column
            label="目标IP/端口"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.dstIp || '全部' }}/{{ scope.row.dstPort || '全部' }}
            </template>
          </el-table-column>
          <el-table-column
            label="源IP/端口"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.srcIp || '全部' }}/{{ scope.row.srcPort || '全部' }}
            </template>
          </el-table-column>
          <el-table-column
            label="协议类型"
            min-width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.protocol | labelView(adsSelects.protocol) }}
            </template>
          </el-table-column>
          <el-table-column
            label="采样比"
            min-width="80"
            prop="sampleRatio"
          />
          <el-table-column
            label="抓包数量"
            min-width="80"
            prop="sampleNum"
          />
          <el-table-column
            label="状态"
            min-width="80"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === 0"
                class="color--warning"
              >已停止</span>
              <span
                v-else-if="scope.row.status === -1"
                class="color--danger"
              >未开始</span>
              <span
                v-else
                class="color--success"
              >进行中</span>
            </template>
          </el-table-column>
          <el-table-column
            label="抓包集群"
            min-width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.clusterId | labelView(adsSelectCluster) }}
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
            width="150"
          >
            <template slot-scope="scope">
              <!-- <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button> -->
              <el-button
                type="text"
                @click="handleRowRestart(scope.row)"
              >重新抓包</el-button>
              <el-divider direction="vertical" />
              <el-button
                :disabled="!scope.row.filePath"
                type="text"
                @click="downloadFile(`${scope.row.filePath}`)"
              >下载</el-button>
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
import { downloadFile } from '@/utils/export'
import DialogRow from './components/DialogRow'
import adsMixins from '../../mixins/ads'

export default {
  components: { DialogRow },

  mixins: [consoleDataAds, adsMixins],

  data() {
    return {
      API_INDEX: 'admin/pcap/query',
      downloadFile,
      bindParams: {
        dstIp: '',
        srcIp: '',
        clusterId: ''
      }
    }
  },

  created() {
    this.adsFetchClusterList()
  },

  methods: {
    async handleRowRestart(row) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/pcap/execute/copy`, [row.uuid])
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/pcap/execute/${operate}`, this.multipleSelection.map(_ => _.uuid))
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
