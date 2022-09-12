<template>
  <console-page-layout>
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
            type="selection"
            width="45"
          />
          <el-table-column
            label="套餐名称"
            min-width="180"
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
            prop="meal_flag_name"
            min-width="100"
          />
          <el-table-column
            label="到期时间"
            min-width="140"
          >
            <template slot-scope="scope">
              <ColumnExpireTime :expire-time="scope.row.expire_time" />
            </template>
          </el-table-column>
          <el-table-column
            label="已绑定网站"
            min-width="250"
          >
            <template slot-scope="scope">
              <ColumnList :list="scope.row.bind_domain_list_view" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="packageUpgradeDialog = true"
              >续费</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow ref="DialogRow" />
    <yd-dialog
      :visible.sync="packageUpgradeDialog"
      title="提示"
      width="400px"
    >
      <p>亲爱的用户:</p>
      <p>如需购买、升级、或续费{{ $t('red-guard.title') }}服务，请联系商务</p>
    </yd-dialog>
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnList from '@/components/Column/ColumnList'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import ColumnPackageName from './components/ColumnPackageName'
import DialogRow from './components/DialogRow'

export default {
  components: {
    ColumnExpireTime,
    ColumnPackageName,
    ColumnList,
    DialogRow
  },

  mixins: [consoleData],

  data() {
    return {
      packageUpgradeDialog: false,
      bindParams: {
        display_free: 0
      },
      API_INDEX: 'V4/cloudsafe.hwws.package.list'
    }
  },

  methods: {
    formatResponse(response) {
      response.list.forEach(item => {
        item.bind_domain_list_view = Object.values(item.bind_domain_list)
      })
      return response
    }
  }
}
</script>
