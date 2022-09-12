<template>
  <ConsolePageLayout>
    <DmAlert>
      新建设备后，点击获取
      <a
        v-for="(item, index) in imageMap"
        :key="index"
        :href="item.image_url"
        :download="item.image_type"
        style="margin-right:5px;"
        target="_blank"
      >
        {{ item.image_type }}
      </a>
      镜像下载地址，镜像安装完成后点此获取
      <router-link :to="connectorGuide('Docker')">
        <el-button
          type="text"
          style="margin-right:5px;"
        > Docker </el-button>
      </router-link>
      配置向导
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen({
          connector_id: $route.params.id
        })"
      >新增</el-button>
      <el-button @click="handleSearch">刷新</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.name"
          placeholder="设备名称"
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
            label="设备名称"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnPopoverInput
                v-model="scope.row.device_name"
                @submit="name => handleUpdateRow({device_name: name}, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="设备UID"
            min-width="160"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.device_uuid"
                :url="false"
                :max-length="8"
                line-feed
              />
              <ItemCopy
                :value="scope.row.device_uuid"
                style="margin-left: 8px"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="配置模板"
            min-width="200"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.config_template"
                :url="false"
                :max-length="20"
                line-feed
              />
              <ItemCopy
                :value="scope.row.config_template"
                style="margin-left: 8px"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="设备状态"
            min-width="150"
          >
            <template slot-scope="scope">
              <span :class="`color--${scope.row.online_status_color}`">{{ scope.row.online_status }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="公网IP"
            prop="public_ip"
            min-width="120"
          />
          <el-table-column
            label="版本号"
            min-width="120"
          >
            <template slot-scope="{row}">
              {{ row.version }}
              <el-tooltip
                class="item"
                effect="light"
                content="设备有更新, 点击查看"
                placement="top-start"
              >
                <router-link :to="connectorDevice(row)">
                  <el-button
                    v-show="row.updatable === 1"
                    type="text"
                    style="padding: 5px 0 0 10px;"
                  >

                    <i class="el-icon-top" />
                  </el-button>
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="服务状态"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.status"
                @change="status => handleChangeStatus(status, scope.row.device_id)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <router-link :to="connectorDevice(scope.row)">
                <el-button type="text">详情</el-button>
              </router-link>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="handleRowDiagnose(scope.row)"
              >在线诊断</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
    <DialogDiagnose ref="DialogDiagnose" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnPopoverInput from '@/components/Column/ColumnPopoverInput'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ItemCopy from '@/components/Item/ItemCopy'
import DialogRow from './components/DialogRow'
import DialogDiagnose from './components/DialogDiagnose'

export default {
  components: { ColumnPopoverInput, PopoverEllipsis, ItemCopy, DialogRow, DialogDiagnose },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.connector.device.list',
      bindParams: {
        connector_id: this.$route.params.id,
        device_name: ''
      },
      connectorDevice: (data) => {
        return {
          name: 'zero-trust.router.connectorDevice_Id',
          params: {
            id: this.$route.params.id,
            deviceId: data.device_id
          },
          query: {
            pageTitle: this.$route.query.pageTitle
          }
        }
      },
      connectorGuide: (type) => {
        return {
          name: 'zero-trust.router.connectorGuide',
          params: {
            id: this.$route.params.id,
            Guide: type
          },
          query: {
            pageTitle: this.$route.query.pageTitle
          }
        }
      },
      imageMap: []
    }
  },

  computed: {
    selectionId() {
      return this.multipleSelection.map(_ => _.device_id)
    }
  },
  mounted() {
    this.fetchImage()
  },
  methods: {
    async fetchImage() {
      const data = await this.Fetch.post('V4/zero.trust.connector.image.all', {})
      this.imageMap = data || []
      console.log(data)
    },
    async handleUpdateRow(form, row) {
      await this.Fetch.post('V4/zero.trust.connector.device.save', {
        device_id: row.device_id,
        ...form
      })
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    },

    handleDelete() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        await this.Fetch.delete('V4/zero.trust.connector.device.del', { device_ids: this.selectionId })
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    handleRowDiagnose(row) {
      this.$refs.DialogDiagnose.handleOpen(row)
    },

    async handleChangeStatus(status, device_id) {
      await this.Fetch.post('V4/zero.trust.connector.device.change.status', {
        device_id,
        status
      })
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
