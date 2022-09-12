<template>
  <el-row :gutter="12">
    <el-col :span="12">
      <DmCard title="TOP10 今日被攻击页面">
        <DmTable
          :loading="loading"
          min-height
          type="white"
        >
          <el-table :data="pageList">
            <el-table-column
              prop="url"
              label="URL"
              min-width="200"
            >
              <template slot-scope="scope">
                <PopoverEllipsis v-model="scope.row.url"/>
              </template>
            </el-table-column>
            <el-table-column
              label="攻击次数"
              width="90"
              align="right"
            >
              <template slot-scope="scope">
                {{ scope.row.count }} {{ scope.row.unit }}
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmCard>
    </el-col>
    <el-col :span="12">
      <DmCard title="TOP10 今日攻击IP">
        <DmTable
          :loading="loading"
          min-height
          type="white"
        >
          <el-table :data="ipList">
            <el-table-column
              prop="ip"
              label="攻击IP"
              min-width="150"
            />
            <el-table-column
              prop="location"
              label="归属地"
              min-width="150"
            />
            <el-table-column
              label="拦截次数"
              align="right"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.count }} {{ scope.row.unit }}
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmCard>
    </el-col>
  </el-row>
</template>

<script>
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
export default {
  components: { PopoverEllipsis },

  data() {
    return {
      loading: true,
      pageList: [],
      ipList: []
    }
  },

  methods: {
    startLoading() {
      this.loading = true
    },

    async setData(data) {
      this.pageList = data.top_request_url
      this.ipList = data.top_remote_addr
      this.loading = false
    }
  }
}
</script>
