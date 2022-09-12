<template>
  <div>
    <DmData
      ref="DmData"
      :auto-init="false"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="domain"
            label="监控对象"
            min-width="150"
          />
          <el-table-column
            prop="localtion"
            label="被劫持区域"
            min-width="150"
          />
          <el-table-column
            prop="isp"
            label="被劫持ISP"
            min-width="150"
          />
          <el-table-column
            label="被劫持到"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnListMore v-model="scope.row.hijack_ipset" />
            </template>
          </el-table-column>
          <el-table-column
            prop="begin_time"
            label="被劫持时间"
            min-width="150"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'

export default {
  components: { ColumnListMore },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/dns.hijack.event.list',
      bindParams: {
        sub_domain: this.$route.query.property_object
      },
      selectionId: []
    }
  },

  mounted() {
    if (this.$route.query.property_object) this.fetchList()
  },

  methods: {
    formatResponse(response) {
      response.list.forEach(item => {
        item.localtion = `${item.country}-${item.province}-${item.city}`
      })
      return response
    }
  }
}
</script>
