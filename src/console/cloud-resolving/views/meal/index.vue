<style lang="scss" scoped>
.mr {
  margin-right: 10px;
}
</style>
<template>
  <console-page-layout>
    <DmToolbar>
      <div slot="right">
        <yd-form-select
          :selects="is_expire"
          v-model="bindParams.is_expire"
          default-text="所有套餐状态"
          filterable
          class="mr"
          @change="handleSearch"/>
        <yd-form-select
          :selects="meal_flag"
          v-model="bindParams.meal_flag"
          default-text="所有套餐版本"
          filterable
          class="mr"
          @change="handleSearch"/>
        <InputSearch
          v-model="bindParams.domain"
          placeholder="请输入域名进行模糊查询"
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
        <el-table :data="list">
          <el-table-column type="selection" width="55"/>
          <el-table-column label="套餐实例名称">
            <template slot-scope="scope">
              <span>{{ scope.row.plan_diy_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="套餐版本">
            <template slot-scope="scope">
              <span>{{ scope.row.plan_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="到期日期">
            <template slot-scope="scope">
              <span>{{ scope.row.expire_time }}</span><br>
              <span class="color--danger">{{ timeText(scope.row.expire_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支持域名">
            <template slot-scope="scope">
              <span>域名数量：{{ scope.row.domain_num }}</span><br>
              <span>已用：{{ scope.row.domain_num_used }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已绑定域名">
            <template slot-scope="scope">
              <div style="display:flex">
                <div style="width:90%;">
                  <div v-for="(item, index) in (scope.row.package_domains).slice(0, 2)" :key="'key1_'+index+'-'+scope.$index">
                    <span>{{ item }}</span>
                  </div>
                  <template v-if="scope.row.domain_show === true && scope.row.package_domains.length > 2">
                    <div v-for="(item, _index) in (scope.row.package_domains).slice(2, -1)" :key="'key2_'+_index+'-'+scope.$index" >
                      <span>{{ item }}</span>
                    </div>
                  </template>
                </div>
                <div v-if="scope.row.package_domains.length > 2" style="flex:1;text-align:center; cursor: pointer;" @click="domainText(scope.row,scope.$index)">
                  <i class="el-icon-arrow-down color--primary" style="float: right;"/>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="Help.openServicePanel(appAssets.afterKF)">续费</a>
              <el-divider direction="vertical"/>
              <a @click="$refs.edit.handleOpen(scope.row)">配置</a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>

    </DmData>
    <edit ref="edit" @init="fetchList"/>
  </console-page-layout>
</template>
<script>
import consoleData from '@/mixins/consoleData'
import edit from './edit'
export default {
  components: { edit },
  mixins: [consoleData],
  data() {
    return {
      package_domains: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6'
      ],
      bindParams: { is_expire: '', meal_flag: '', domain: '' },
      is_expire: [
        { label: '未到期', value: 1 },
        { label: '已到期', value: -1 }
      ],
      meal_flag: [
        { label: '普惠版', value: 'ph' },
        { label: '定制版', value: 'dz' }
      ],
      API_INDEX: '/V4/cloud.dns.package.list'
    }
  },
  methods: {
    domainText(data, index) {
      const domain_show = data.domain_show || false
      const list = JSON.parse(JSON.stringify(this.list))
      list[index].domain_show = !domain_show
      this.list = list
    },
    timeText(val) {
      let text_ = ''
      const moment = require('moment')
      function countTime(endTime) {
        const endTimeObj = new Date(endTime)
        // 时间差
        var leftTime = endTimeObj - new Date()
        // 定义变量 d,h,m,s保存倒计时的时间
        var d, h, m, s
        if (leftTime < 0) {
          return
        }
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
        m = Math.floor((leftTime / 1000 / 60) % 60)
        s = Math.floor((leftTime / 1000) % 60)
        const str = `${d}天${h}时${m}分${s}秒`
        if (d < 7) {
          return str
        } else {
          return ''
        }
      }
      if (val) {
        const isBeforeTime = moment(val).isBefore(new Date())
        if (isBeforeTime) { // 未到期
          text_ = '已到期'
        } else {
          text_ = countTime(val)
        }
      }
      return text_
    }
  }
}
</script>
