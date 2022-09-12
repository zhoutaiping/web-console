<template>
  <ConsolePageLayout
    :route-to="{
      name: 'zero-trust.router.connectorDevice',
      query: $route.query
    }"
    :title="info.device_name"
  >
    <DmCard title="设备详情">
      <el-row :gutter="30">
        <el-col
          :span="8"
          style="margin-left: 65px"
        >
          <ColumnItem
            width="100px"
            title="设备状态"
            empty-value=""
          >
            <span :class="`color--${info.online_status_color}`">
              {{ info.online_status }}
            </span>
            <i class="ya-dot ya-iconfont" />
          </ColumnItem>
          <ColumnItem
            v-model="info.public_ip"
            width="100px"
            title="公网IP"
          />
          <ColumnItem
            v-model="info.location"
            width="100px"
            title="地理位置"
          />
          <ColumnItem
            v-model="info.running_time"
            width="100px"
            title="运行时长"
          />
          <ColumnItem
            v-model="info.disk"
            width="100px"
            title="硬盘大小"
          />
          <ColumnItem
            v-model="info.cpu_count"
            width="100px"
            title="CPU核心数"
          />
        </el-col>
        <el-col :span="12">
          <ColumnItem
            v-model="info.version"
            width="140px"
            title="版本号"
          >
            <el-button
              v-if="info.updatable === 1"
              :disabled="info.online_status_code === 0"
              type="primary"
              size="mini"
              @click="handleUpdate"
            >更新
            </el-button>
            <el-button
              v-else-if="info.updatable === 2"
              disabled
            >
              更新中
            </el-button>
          </ColumnItem>
          <ColumnItem
            v-model="info.start_time"
            width="140px"
            title="最近一次上线时间"
          />
          <ColumnItem
            v-model="info.device_uuid"
            width="140px"
            title="设备UID"
          >
            <ItemCopy v-model="info.device_uuid" />
          </ColumnItem>
          <ColumnItem
            v-model="info.os"
            width="140px"
            title="操作系统"
          />
          <ColumnItem
            v-model="info.memory"
            width="140px"
            title="内存大小"
          />
        </el-col>
      </el-row>
    </DmCard>
    <CardDeviceReport class="margin-top" />
  </ConsolePageLayout>
</template>

<script>
import ColumnItem from '@/components/Column/ColumnItem'
import ItemCopy from '@/components/Item/ItemCopy'
import CardDeviceReport from './components/CardDeviceReport'

export default {
  components: { ColumnItem, ItemCopy, CardDeviceReport },

  data() {
    return {
      info: {}
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.info = await this.Fetch.get('V4/zero.trust.connector.device.info', {
        device_id: this.$route.params.deviceId
      })
    },

    handleUpdate() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        await this.Fetch.post('V4/zero.trust.connector.device.upgrade', { device_id: this.$route.params.deviceId })
        this.Message('ACTION_SUCCESS')
        this.fetchData()
      })
    }
  }
}
</script>
