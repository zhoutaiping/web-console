<template>
  <DmCard
    :loading="loading"
    title="DDoS 攻击详情"
  >
    <template slot="action">
      <yd-form-select
        v-model="bindParams.ip"
        :selects="reportSelectIP"
        default-text="所有IP"
        style="margin-right: 8px; width: 150px;"
        @change="handleSearch"
      />
      <yd-form-select
        :selects="DDOS_ORDER"
        v-model="bindParams.order"
        placeholder="请选择排序"
        @change="handleSearch"
      />
    </template>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            prop="host_ip"
            label="防御IP"
            min-width="180"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.host_ip }}({{ scope.row.ip_location }})</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="begin_time"
            label="开始时间"
            min-width="180"
          />
          <el-table-column
            prop="end_time"
            label="结束时间"
            min-width="180"
          />
          <el-table-column
            prop="max_width"
            label="峰值带宽（Mbps）"
            min-width="130"
          />
          <el-table-column
            prop="duration"
            label="持续时间（秒）"
            min-width="120"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="100"
          >
            <template slot-scope="scope">
              <router-link :to="{name: 'cloud-wall.router.dataReport__ddosAttack__detail', query: scope.row}">
                <el-button type="text">查看</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </DmCard>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import { DDOS_ORDER } from '@/console/taichi-plus/constants/label'
import cwReport from '../../../../../mixins/cwReport'

export default {
  mixins: [consoleData, cwReport],

  data() {
    return {
      DDOS_ORDER,
      API_INDEX: 'V4/statistic.tjkd.plus.ddos.list',
      bindParams: {
        ip: '',
        order: 'max_width|desc'
      }
    }
  }
}
</script>
