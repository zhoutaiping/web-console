<template>
  <div>
    <DmToolbar>
      <template slot="right">
        <InputSearch
          v-model="bindParams.addressIp"
          placeholder="IP地址"
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
            min-width="150"
            prop="ip"
          />
          <el-table-column
            label="目标IP"
            min-width="150"
            prop="dstIp"
          />
          <el-table-column
            label="源IP归属地"
            min-width="120"
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
            label="释放方式"
            min-width="120"
            prop="type"
          />
          <el-table-column
            label="命中时间"
            min-width="150"
            prop="hitTime"
          />
          <el-table-column
            label="释放时间"
            min-width="150"
            prop="createTime"
          />
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
      API_INDEX: 'admin/rbwlist/query',
      bindParams: {
        addressIp: ''
      }
    }
  },

  created() {
    this.adsFetchClusterList()
  }
}
</script>
