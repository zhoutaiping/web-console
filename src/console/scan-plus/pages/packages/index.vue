<template>
  <div>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            min-width="150"
            label="套餐名称"
          >
            <template slot-scope="scope">
              <ColumnPackageName
                :row="scope.row"
                @init="fetchList"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="套餐版本"
            min-width="100"
            prop="plan_name"
          />
          <el-table-column
            min-width="150"
            label="到期时间"
          >
            <template slot-scope="scope">
              <ColumnExpireTime :expire-time="scope.row.expire_time" />
            </template>
          </el-table-column>
          <el-table-column
            min-width="300"
            label="已绑定资产"
          >
            <template slot-scope="scope">
              <ColumnListMore v-model="scope.row.property_list" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            align="right"
          >
            <template slot-scope="scope">
              <TipsButton>续费</TipsButton>
              <el-divider direction="vertical"/>
              <el-button
                type="text"
                @click="handleRowSetting(scope)"
              >配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogSettings
      ref="DialogSettings"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import ColumnList from '@/components/Column/ColumnList'
import ColumnListMore from '@/components/Column/ColumnListMore'
import ColumnPackageName from './components/ColumnPackageName'
import DialogSettings from './components/DialogSettings'

export default {
  components: { ColumnExpireTime, ColumnListMore, ColumnList, ColumnPackageName, DialogSettings },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/smgc.package.list'
    }
  },

  methods: {
    handleRowSetting(scope) {
      this.$refs.DialogSettings.handleOpen(scope.row)
    }
  }
}
</script>
