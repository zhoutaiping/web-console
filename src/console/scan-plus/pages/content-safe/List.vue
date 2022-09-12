<template>
  <div>
    <DmToolbar>
      <el-button
        :disabled="!selectionId.length"
        @click="handleChangeStatus('batchOn')"
      >开启</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleChangeStatus('batchOff')"
      >关闭</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleMultipleDelete()"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.domain"
          placeholder="请输入域名进行搜索"
          @submit="handleSearch()"
        />
      </div>
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
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="domain"
            label="监测对象"
            min-width="130"
          />
          <el-table-column
            prop="port"
            label="监控端口"
            min-width="130"
          />
          <el-table-column
            prop="protocol"
            label="监控协议"
            min-width="130"
          />
          <el-table-column
            label="监测页面"
            min-width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.operationType | labelView(consoleLabel.contentSafe.detection_page) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tamper"
            label="篡改"
            min-width="50"
            align="center"
          >
            <template slot-scope="scope">
              <span :class="{ 'color--danger': scope.row.taskEventCount.tamper > 0}">{{ scope.row.taskEventCount.tamper }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="关键词"
            min-width="60"
            align="center"
          >
            <template slot-scope="scope">
              <span :class="{ 'color--danger': scope.row.taskEventCount.keyword > 0}">{{ scope.row.taskEventCount.keyword }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="敏感字"
            min-width="60"
            align="center"
          >
            <template slot-scope="scope">
              <span :class="{ 'color--danger': scope.row.taskEventCount.sensitiveWord > 0}">{{ scope.row.taskEventCount.sensitiveWord }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="异常状态码"
            min-width="100"
            align="center"
          >
            <template slot-scope="scope">
              <span :class="{ 'color--danger': scope.row.taskEventCount.statusCode > 0}">{{ scope.row.taskEventCount.statusCode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="恶意链接"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span :class="{ 'color--danger': scope.row.taskEventCount.darkChain > 0}">{{ scope.row.taskEventCount.darkChain }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="风险外链监控"
            min-width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span :class="{ 'color--danger': scope.row.taskEventCount.outerInspect > 0}">{{ scope.row.taskEventCount.outerInspect }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            min-width="180"
          />
          <el-table-column
            prop="status"
            label="监测状态"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.status | labelView(consoleLabel.monitorStatus) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowEdit(scope.row)"
              >配置</el-button>
              <el-divider direction="vertical" />
              <router-link :to="{ name: 'scan-plus.router.content-safe__console__id', params: {id: scope.row.uuid}, query: {name: scope.row.domain, pageTitle: scope.row.domain }}">
                <el-button type="text">
                  控制台
                </el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddContentSafe
      ref="DialogAddContentSafe"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogAddContentSafe from '../propertys/components/DialogAddContentSafe'

export default {
  components: { DialogAddContentSafe },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/content.safe.monitor.list',
      bindParams: {
        domain: ''
      },
      selectionId: []
    }
  },

  methods: {
    formatResponse(response) {
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.uuid)
    },

    async handleRowEdit(row) {
      this.$refs.DialogAddContentSafe.handleOpen(row, { mode: 'Edit' })
    },

    async handleChangeStatus(status) {
      await this.Fetch.post(`/V4/content.safe.monitor.${status}`, {
        uuidList: this.selectionId
      })

      this.Message('ACTION_SUCCESS')
      this.fetchList()
      this.selectionId = []
    },

    async handleDelete() {
      await this.Fetch.delete('/V4/content.safe.monitor.batchDel', {
        uuidList: this.selectionId
      })
      this.Message('ACTION_SUCCESS')
      this.fetchList()
      this.selectionId = []
    },

    handleMultipleDelete() {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(() => {
        this.handleDelete()
      })
    }
  }
}
</script>
