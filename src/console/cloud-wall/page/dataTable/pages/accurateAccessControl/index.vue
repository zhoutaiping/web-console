<template>
  <div>
    <DmToolbar>
      <yd-button-checkbox
        v-model="params.package_id"
        :checks="selectPackages"
        item-name="套餐"
        @submit="init"
      />
      <InputSearch
        v-model="params.rule_id"
        style="width: 240px"
        placeholder="规则ID"
        @submit="init"
      />
      <template slot="right">
        <yd-form-select
          v-model="params.action_mode"
          :selects="ACTION_TCP_TYPE"
          style="width: 140px"
          default-text="全部"
          @change="init"
        />
        <DateSelection
          custom-secound
          @timevalue="handleDateChange"
        />
      </template>
    </DmToolbar>
    <DmCard>
      <ItemNumberGroup>
        <ItemNumber
          v-for="(item, index) in listIndex"
          :loading="loading"
          :key="index"
          :value="item.value"
          :title="item.title"
          :color="item.color"
        />
      </ItemNumberGroup>
    </DmCard>
    <DmData
      ref="DmData"
      :inner-card="false"
      style="margin-top: 12px"
      @init="initPage"
      @auto-init="false"
    >
      <DmTable
        :loading="loading"
        animate
      >
        <el-table :data="list">
          <el-table-column
            width="200"
            label="规则ID"
          >
            <template slot-scope="scope">
              <PopoverWallRuleId :id="scope.row.rule_id">
                {{ scope.row.rule_id }}
              </PopoverWallRuleId>
            </template>
          </el-table-column>
          <el-table-column
            label="触发对象"
            prop="package_name"
          />
          <el-table-column label="处理方式">
            <template slot-scope="scope">
              <ColumnWallRecordActionStatus :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            label="触发次数"
          >
            <template slot-scope="scope">
              <a @click="handleToDetail(scope.row.rule_id)">
                <strong>{{ scope.row.rule_num }} 次</strong>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            align="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleToDetail(scope.row.rule_id)"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import { vPagination } from '@/utils/array'
import NavbarPage from '@/components/Navbar/NavbarPage'
import ColumnWallRecordActionStatus from '@/components/Column/ColumnWallRecordActionStatus'
import ItemNumber from '@/components/Item/ItemNumber'
import ItemNumberGroup from '@/components/Item/ItemNumberGroup'
import InputSearch from '@/components/Input/InputSearch'
import PopoverWallRuleId from '@/console/cloud-wall/components/PopoverWallRuleId'
import { createArr } from '@/utils/array'
import DateSelection from '@/components/DateSelect/DateSelection'
import { ACTION_TYPE, ACTION_TCP_TYPE } from '@/constants/cloud-wall'

export default {
  components: { NavbarPage, ItemNumber, InputSearch, ItemNumberGroup, PopoverWallRuleId, ColumnWallRecordActionStatus, DateSelection },

  data() {
    return {
      ACTION_TYPE,
      ACTION_TCP_TYPE,
      selectPackages: [],
      listIndex: [],
      loading: false,
      list: [],
      listRaw: [],
      params: {
        type: 'firewall_tcp',
        rule_id: '',
        package_id: [],
        action_mode: '',
        start_time: '',
        end_time: ''
      }
    }
  },

  created() {
    this.params.rule_id = this.$route.query.rule_id
    this.fetchPackageList()
  },

  methods: {
    handleDateChange(start_time, end_time) {
      this.params.start_time = start_time
      this.params.end_time = end_time
      this.init()
    },

    async fetchPackageList() {
      const data = await this.Fetch.get('V4/Tjkd.plus.package.all', { per_page: 1000 })
      if (data && data.list) {
        const { list } = data
        let nList = []
        nList = list.filter(item => item.flag === false)
        this.selectPackages = nList
      }
    },

    initPage(params) {
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    },

    handleToDetail(id) {
      const { start_time, end_time, type } = this.params
      this.$router.push({
        name: 'cloud-wall.router.dataReport__accurateAccessControl__id',
        params: {
          id
        },
        query: {
          start_time,
          end_time,
          type
        }
      })
    },

    async init() {
      const params = this.params
      this.loading = true
      this.listIndex = createArr(5)
      this.list = []

      const data = await this.Fetch.get('V4/firewall.report.package.block.list', params)
      const { total = 0, block_total = 0, pass_total = 0, deny_total = 0, watch_total = 0 } = data
      let { list = [] } = data

      if (params.action_mode) list = list.filter(item => item.action === params.action_mode)
      this.listRaw = list

      const listIndex = [
        {
          title: '总次数',
          value: total,
          color: 'primary'
        },
        {
          title: '封禁次数',
          value: block_total,
          color: 'warning'
        },
        {
          title: '放行次数',
          value: pass_total,
          color: 'green'
        },
        {
          title: '观察次数',
          value: watch_total,
          color: 'warning'
        },
        {
          title: '阻断次数',
          value: deny_total,
          color: 'danger'
        }
      ]

      this.$refs.DmData.init({ total: list.length })
      this.initPage({ page: 1, per_page: 10 })

      this.listIndex = listIndex
      this.loading = false
      this.showIndex = true
    }
  }
}
</script>
