<template>
  <DmCard
    title="连接器"
    style="height: 180px"
  >
    <template slot="action">
      <ItemNumberLite
        title="连接器总数"
        style="width: 120px; padding: 0px; margin-top: -14px"
      >
        {{ appTotal.connector_count }}
      </ItemNumberLite>
    </template>
    <div style="border: 1px solid #eee; height: 105px; padding-top: 18px">
      <el-row :gutter="12">
        <el-col :span="12">
          <ItemNumberLite
            title="设备总数"
            column
            border-right
          >
            {{ appTotal.device_count }}
          </ItemNumberLite>
        </el-col>
        <el-col :span="12">
          <ItemNumberLite
            title="在线"
            badge
            badge-color="success"
          >
            {{ appTotal.device_online_count }}
          </ItemNumberLite>
          <ItemNumberLite
            title="离线"
            badge
            badge-color="info"
          >
            {{ appTotal.device_offline_count }}
          </ItemNumberLite>
        </el-col>
      </el-row>
    </div>
  </DmCard>
</template>

<script>
import ItemNumberLite from '@/components/Item/ItemNumberLite'

export default {
  components: { ItemNumberLite },

  props: {
    appTotal: Object
  },

  data() {
    return {
    }
  },

  computed: {},

  methods: {}
}
</script>
