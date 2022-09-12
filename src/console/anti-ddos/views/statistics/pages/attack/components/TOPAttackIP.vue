<template>
  <DmCard
    :loading="loading"
    title="TOP10 受攻击IP"
  >
    <DmTable
      :loading="loading"
      type="white"
    >
      <el-table
        :data="data"
        height="300px"
      >
        <el-table-column
          prop="key"
          label="受攻击IP"
          min-width="200"
        />
        <el-table-column
          label="攻击流量"
          min-width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.total_bytes | bitsView }}
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'CardAttackIpTop',

  data() {
    return {
      loading: true,
      data: []
    }
  },

  methods: {
    async init(params) {
      this.loading = true
      const data = await this.$Ads.post('admin/analyzeAttack/dstIpAckTop', {
        ...params
      })

      delete data._status
      this.data = data
      this.loading = false
    }
  }
})
</script>
