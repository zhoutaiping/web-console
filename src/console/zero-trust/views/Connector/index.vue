<template>
  <ConsolePageLayout>
    <DmAlert>
      1. 连接器提供了一种更安全访问内网应用的方式，通过建立一条客户网络到YUNDUN边缘节点的仅出站连接的单向隧道，可实现通过互联网即可安全访问内网应用，无需打开防火墙端口或配置ACL<br>
      2. 连接器需要与应用绑定，确保所有的访问请求通过YUNDUN的边缘节点筛选后通过连接器访问再到应用源站<br>
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleDelete(selectionId)"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.connector_name"
          placeholder="连接器名称"
          @submit="handleSearch"
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="连接器名称"
            prop="connector_name"
            min-width="120"
          />
          <el-table-column
            label="序列号"
            min-width="160"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.connector_uuid"
                :url="false"
                :max-length="8"
                line-feed
              />
              <ItemCopy
                :value="scope.row.connector_uuid"
                style="margin-left: 8px"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="设备状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnDevice v-model="scope.row.connector_device" />

              <el-tooltip
                class="item"
                effect="light"
                content="设备有更新"
                placement="top-start"
              >
                <el-button
                  v-show="scope.row.connector_device && scope.row.connector_device.updatable ===1"
                  type="text"
                  style="padding: 0 0 0 15px;"
                >
                  <i class="el-icon-top" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="已绑定应用"
            min-width="100"
          >
            <template slot-scope="scope">
              <!-- <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
              >
                <DmTable>
                  <el-table :data="scope.row.connector_app"/>
                </DmTable>
                <template
                  v-for="(item, index) in value"
                  v-if="(index + 1) > maxNum"
                >
                  <div
                    :key="index"
                    style="font-size: 12px"
                  >
                    <template v-if="lavelViewList && lavelViewList.length">
                      {{ item | labelView(lavelViewList) }}
                    </template>
                    <template v-else>
                      {{ item }}
                    </template>
                  </div>
                </template>
                <a slot="reference">...</a>
              </el-popover> -->

              <!-- <ColumnListMore
                :max-num="3"
                v-model="scope.row.connector_app"
              /> -->
              <PopoverAppList :row="scope.row">
                {{ scope.row.connector_app.length }}
              </PopoverAppList>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remarks"
            min-width="150"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <router-link :to="{name: 'zero-trust.router.connectorDevice', params: {id: scope.row.connector_id}, query: {pageTitle: scope.row.connector_name}}">
                <el-button type="text">管理</el-button>
              </router-link>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogBind.handleOpen(scope.row)"
              >绑定应用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
    <DialogBind
      ref="DialogBind"
      @init="fetchList"
    />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ItemCopy from '@/components/Item/ItemCopy'
import ColumnDevice from './components/ColumnDevice'
import DialogRow from './components/DialogRow'
import DialogBind from './components/DialogBind'
import PopoverAppList from './components/PopoverAppList'

export default {
  components: { ItemCopy, ColumnListMore, PopoverEllipsis, ColumnDevice, DialogRow, DialogBind, PopoverAppList },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.connector.list',
      bindParams: {
        connector_name: ''
      }
    }
  },

  computed: {
    selectionId() {
      return this.multipleSelection.map(_ => _.connector_id)
    }
  },

  methods: {
    formatResponse(response) {
      return response
    },

    handleDelete(connector_ids) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.delete('V4/zero.trust.connector.del', { connector_ids })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    handleAction() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.delete('V4/zero.trust.connector.del', { connector_ids: this.selectionId })
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
