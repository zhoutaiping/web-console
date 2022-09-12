<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogCreate.handleOpen()"
      >新增策略</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleDelete(selectionId)"
      >删除</el-button>

      <template slot="right">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-right: 8px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.strategy_name"
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
          @select="handleRowSelect"
          @select-all="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="策略名称"
            min-width="200"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'access-management.router.privileges__custom__id__manage',
                  params: {
                    id: scope.row.id
                  }
              }">
                {{ scope.row.strategy_name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="关联子账号数"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.users && scope.row.users.length || 0 }}
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
                @click="$refs.DialogUser.handleOpen({
                  belong_type: 'user',
                  strategy_ids: [scope.row.id]
              })" >关联用户</el-button>
              <el-divider direction="vertical" />
              <router-link
                :to="{
                  name: 'access-management.router.privileges__custom__id__manage',
                  params: {
                    id: scope.row.id
                  }
              }">
                <el-button type="text">编辑</el-button>
              </router-link>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="handleRowDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogUser
      ref="DialogUser"
      @init="fetchList"
    />
    <DialogCreate
      ref="DialogCreate"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'
import DialogCreate from './components/DialogCreate'
import DialogUser from './Detail/components/DialogUser'

export default {
  components: { ColumnListMore, DialogCreate, DialogUser },

  mixins: [consoleData],

  data() {
    return {
      dateRange: [],
      API_INDEX: 'V4/permission.get.strategyList',
      bindParams: {
        strategy_name: '',
        start_time: '',
        end_time: ''
      },
      selectionId: []
    }
  },

  methods: {
    formatParams(params) {
      const [start_time, end_time] = this.dateRange
      return {
        ...params,
        start_time,
        end_time
      }
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    formatResponse(response) {
      response.list.forEach(item => {
        item.groupListView = item.group_list.map(_ => _.group_name)
      })
      return response
    },

    async handleDelete(id) {
      const params = {
        id: Array.isArray(id) ? id.join(',') : id
      }

      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.delete('V4/permission.del.strategy', params)
        } catch (e) {
          return
        }
        this.fetchList()
      })
    },

    handleRowDelete(row) {
      this.handleDelete(row.id)
    }
  }
}
</script>
