<template>
  <div>
    <DmAlert>
      智能调度系统会根据设备信誉与资源适用访客类型以及响应速度等综合信息为终端设备分配边缘资源。
      <!-- <br>
      因设备信誉模型未全量上线，暂时隐藏提示信息“您可以通过
      <router-link :to="{name: `taichi-app.router.business__id__BusinessSecurity`, params: {id: $route.params.id}}">
        控制台-> 业务安全
      </router-link> 配置设备信誉模型，以便更加贴合自身业务情况。 -->
    </DmAlert>
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
        >
          <el-table-column
            label="IP"
            prop="ip_string"
            min-width="150"
          />
          <el-table-column
            label="运营商/归属地"
            min-width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.isp }} / {{ scope.row.location }}
            </template>
          </el-table-column>
          <el-table-column
            label="适用访客类型"
            prop="type"
            min-width="120"
          />
          <el-table-column
            label="健康状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span :class="`color--${scope.row.monitor_status_color}`">{{ scope.row.monitor_status }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="连接延迟"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.client_content_time }} s
            </template>
          </el-table-column>
          <el-table-column
            label="使用状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span :class="`color--${scope.row.status_color}`">{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="状态码200"
            align="right"
            prop="status_200"
            min-width="100"
          /> -->
          <el-table-column
            label="独立访客数"
            align="right"
            prop="access_count"
            min-width="100"
          />
        </el-table>
      </DmTable>
    </DmData>
    <!-- <DialogRow
      ref="DialogRow"
      @init="fetchList"
    /> -->
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'

export default {
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/tjkd.app.package.pool.ip.list',
      bindParams: {
        package_id: this.$route.params.id
      }
    }
  }
}
</script>
