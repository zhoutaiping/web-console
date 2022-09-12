<template>
  <DmCard
    title="应用"
    style="height: 180px"
  >
    <el-row :gutter="12">
      <el-col :span="12">
        <el-row style="margin-top: 10px">
          <el-col :span="8">
            <ItemNumberLite
              title="自建应用"
              column
              border-right
            >
              {{ appTotal.self_host_app_count }}
            </ItemNumberLite>
          </el-col>
          <el-col :span="8">
            <ItemNumberLite
              title="协议应用"
              column
              border-right
            >
              {{ appTotal.protocol_app_count }}
            </ItemNumberLite>
          </el-col>
          <el-col :span="8">
            <ItemNumberLite
              title="SaaS应用"
              column
            >
              {{ appTotal.saas_app_count }}
            </ItemNumberLite>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <ItemNumberLite
          border
          title="今日访问应用数："
        >
          {{ appTotal.distinct_app_id }}
        </ItemNumberLite>
        <ItemNumberLite
          border
          title="本月访问应用数："
          style="margin-top: 10px"
        >
          {{ appTotal.month_active_app }}
        </ItemNumberLite>
      </el-col>
    </el-row>
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
