<template>
  <DmCard title="TOP5 网站带宽">
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
          label="带宽峰值"
        >
          <template slot-scope="scope">
            {{ scope.row.bandwidth | bitsView }}
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmCard>
</template>

<script>
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'

export default {
  components: { PopoverEllipsis },

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
        router: 'cdn.domain.bandwidth.top'
      })
      this.list = data.domain_bandwidth_top
      this.loading = false
    }
  }
}
</script>
