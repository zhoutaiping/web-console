<template>
  <div>
    <DmAlert>
      系统策略是指 {{ appAssets.companyEN }} 平台内置策略，无法编辑，用户或者用户组与策略关联后，即可获得策略所描述的操作权限。
    </DmAlert>
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
            label="策略名称"
            min-width="200"
          >
            <template slot-scope="scope">
              <router-link :to="routerDetail(scope.row)">
                {{ scope.row.strategy_name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            prop="desc"
            min-width="150"
          />
          <el-table-column
            label="绑定组织"
            min-width="200"
          >
            <template slot-scope="scope">
              <ColumnListMore v-model="scope.row.groupListView" />
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="updated_at"
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
                @click="handleBindUser(scope.row)"
              >关联用户</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="handleBindGroup(scope.row)"
              >关联分组</el-button>
              <el-divider direction="vertical" />
              <router-link :to="routerDetail(scope.row)">
                <el-button type="text">编辑</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogBindUser
      ref="DialogBindUser"
      @init="fetchList"
    />
    <DialogBindGroup
      ref="DialogBindGroup"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'
import DialogBindUser from './components/DialogBindUser'
import DialogBindGroup from './components/DialogBindGroup'

export default {
  components: { ColumnListMore, DialogBindUser, DialogBindGroup },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/permission.get.strategyList',
      bindParams: {
        strategy_type: 'sys'
      }
    }
  },

  methods: {
    routerDetail(row) {
      return {
        name: 'access-management.router.privileges__system__id',
        params: {
          id: row.id
        },
        query: {
          pageTitle: row.strategy_name
        }
      }
    },

    handleBindUser(row) {
      this.$refs.DialogBindUser.handleOpen({
        strategy_ids: [row.id]
      })
    },

    handleBindGroup(row) {
      this.$refs.DialogBindGroup.handleOpen({
        strategy_ids: [row.id]
      })
    },

    formatResponse(response) {
      response.list.forEach(item => {
        item.groupListView = item.group_list.map(_ => _.group_name)
      })
      return response
    }
  }
}
</script>
