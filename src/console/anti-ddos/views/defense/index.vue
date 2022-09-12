<template>
  <ConsolePageLayout>
    <DmAlert>
      当前套餐版本：<ItemPlan :data="planInfo">旗舰版</ItemPlan><br>
      1. 可用防护IP段配额：<strong>{{ planInfo.ip_block_can_use }}C</strong>，剩余可用配额：<strong>{{ planInfo.ip_block_unUsed }}C</strong>，<TipsButton>扩容可用配额</TipsButton><br>
      2. 已授权IP段：<strong>
        <ColumnListMore v-model="planInfo.ip_block_auth" />
      </strong><br>
      3. 当前已加入防御域被保护IP数量：<strong>{{ count.dstIpNum }}</strong>个<br>
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增防御域</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('del')"
      >删除</el-button>
      <template slot="right">
        <InputSearch
          v-model="bindParams.nameIP"
          placeholder="域名称/IP进行查询"
          @submit="handleSubmit"
        />
        <!-- <el-input
          v-model="bindParams.nameIP"
          clearable
          prefix-icon="el-icon-search"
          placeholder="请输入域名称/IP进行查询"
          @keyup.enter.native="$refs.DmData.fetchAdsList(bindParams)"
        /> -->
      </template>
    </DmToolbar>
    <TableDefense
      ref="DmData"
      @selection-change="handleSelectionChange"
    />
    <DialogRow
      ref="DialogRow"
      @init="$refs.DmData.fetchRef()"
    />
  </ConsolePageLayout>
</template>

<script>
import ItemPlan from '@/components/Item/ItemPlan'
import ColumnListMore from '@/components/Column/ColumnListMore'
import DialogRow from './components/DialogRow'
import TableDefense from './TableDefense'
import adsMixins from '../../mixins/ads'

export default {
  components: { ItemPlan, ColumnListMore, DialogRow, TableDefense },

  mixins: [adsMixins],

  data() {
    return {
      selectStatus: [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ],
      multipleSelectionMap: {},
      bindParams: {
        nameIP: ''
      },
      planInfo: {},
      count: {
        dstIpNum: '-'
      }
    }
  },

  computed: {
    multipleSelection() {
      const map = this.multipleSelectionMap
      const list = []
      Object.keys(map).forEach(key => {
        list.push(...map[key])
      })
      return list
    }
  },

  created() {
    this.adsFetchClusterList()
    this.adsFetchTemplateList()
    this.fetchPlanInfo()
    this.fetchCount()
  },

  methods: {
    handleSubmit(val) {
      this.bindParams.nameIP = val || ''
      this.$refs.DmData.fetchAdsList(this.bindParams)
    },
    async fetchCount() {
      const data = await this.$Ads.get('admin/defense/getDstIpNum')
      this.count.dstIpNum = data.dstIpNum
    },

    async fetchPlanInfo() {
      const { plans } = await this.Fetch.get('V4/member.product.plan', {
        product_flag: 'ADS'
      })
      this.planInfo = plans
    },

    handleSelectionChange(row) {
      const { val, parentId = 'root' } = row
      this.$set(this.multipleSelectionMap, parentId, val.map(_ => _.uuid))
    },

    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.$Ads.post(`admin/defense/execute/${operate}`, this.multipleSelection)
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.$refs.DmData.fetchRef()
      })
    }
  }
}
</script>
