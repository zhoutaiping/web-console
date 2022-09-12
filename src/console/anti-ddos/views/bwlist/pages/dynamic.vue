<template>
  <div>
    <DmToolbar>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('rel')"
      >手动释放</el-button>
      <template slot="right">
        <yd-form-select
          :selects="selectStatus"
          v-model="bindParams.status_dynamic"
          default-text="状态"
          style="width: 120px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.srcIp_dynamic"
          placeholder="源IP"
          @submit="handleSearch"
        />
        <InputSearch
          v-model="bindParams.dstIp_dynamic"
          placeholder="防护目标IP"
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
            label="源IP"
            min-width="180"
            prop="srcIp"
          />
          <el-table-column
            label="目标IP"
            min-width="180"
            prop="dstIp"
          />
          <el-table-column
            label="源IP归属地"
            min-width="180"
            prop="ipArea"
          />
          <el-table-column
            label="跳数"
            min-width="80"
            prop="hops"
          />
          <el-table-column
            label="封禁类型"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.levelName }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="80"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status"
                class="color--success"
              >已生效</span>
              <span
                v-else
                class="color--danger"
              >已失效</span>
            </template>
          </el-table-column>
          <el-table-column
            label="释放剩余时间（s）"
            min-width="130"
            prop="timeout"
          />
          <el-table-column
            label="关联防御域"
            min-width="120"
            prop="defenseName"
          />
          <el-table-column
            label="关联集群"
            min-width="100"
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
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleDataAds from '@/mixins/consoleDataAds'
import adsMixins from '../../../mixins/ads'

export default {
  mixins: [consoleDataAds, adsMixins],

  data() {
    return {
      API_INDEX: 'admin/bwlist/queryDynamic',
      selectStatus: [
        {
          label: '生效',
          value: true
        },
        {
          label: '失效',
          value: false
        }
      ],
      bindParams: {
        status_dynamic: '',
        srcIp_dynamic: '',
        dstIp_dynamic: ''
      }
    }
  },

  created() {
    this.adsFetchClusterList()
  },

  methods: {
    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/bwlist/executeDynamic/${operate}`, this.multipleSelection.map(_ => _.uuid))
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
