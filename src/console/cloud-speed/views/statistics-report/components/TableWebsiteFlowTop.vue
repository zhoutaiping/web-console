<template>
  <DmCard title="TOP5 网站流量">
    <DmTable
      :loading="loading"
      type="white"
    >
      <el-table :data="list">
        <el-table-column
          label="网站"
          prop="request_url"
        >
          <template slot-scope="scope">
            <PopoverEllipsis
              :href="`//${scope.row.sub_domain}`"
              v-model="scope.row.sub_domain"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          width="150"
          label="CDN流量"
        >
          <template slot-scope="scope">
            {{ scope.row.sum_bytes | byteView }}
          </template>
        </el-table-column>
        <el-table-column
          label="占比"
          width="120"
        >
          <template slot-scope="scope">
            <ColumnRatio :value="scope.row.percent / 100" />
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmCard>
</template>

<script>
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ColumnRatio from '@/components/Column/ColumnRatio'

export default {
  components: { PopoverEllipsis, ColumnRatio },

  data() {
    return {
      loading: true,
      list: []
    }
  },

  methods: {
    async fetchData(params) {
      this.loading = true
      const data = await this.Fetch.post('V4/stati.data.get', {
        ...params,
        top_size: 5,
        router: 'cdn.domain.flow.top'
      })
      this.list = data.domain_flow_top
      this.loading = false
    }
  }
}
</script>
