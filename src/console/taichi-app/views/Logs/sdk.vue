<template>
  <div>
    <ToolbarLog
      ref="toolbar"
      :show-export="false"
      style="overflow: hidden;"
      @init="handleSearch"
    />
    <DmData
      ref="dmData"
      style="margin-top: 12px"
      @init="init"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column
            width="180"
            prop="created_at"
            label="操作时间"
          />
          <el-table-column
            width="180"
            prop="package_name"
            label="操作套餐"
          />
          <el-table-column
            width="180"
            prop="user_ip"
            label="操作IP"
          />
          <el-table-column
            prop="content"
            label="详情"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import Fetch from '@/api/fetch'
import ToolbarLog from '@/components/Toolbar/ToolbarLog'
import { deepClone } from '@/utils'

export default {
  components: {
    ToolbarLog
  },

  data() {
    return {
      loading: true,
      list: []
    }
  },

  methods: {
    async handleSearch(params) {
      this.$refs.dmData.initPage()
    },

    async init(params) {
      params = deepClone(params)
      Object.assign(params, this.$refs.toolbar.params)

      this.loading = true
      const data = await Fetch.get('V4/tjkd.app.op.log.list', params)
      const total = parseInt(data.total, 10)
      this.$refs.dmData.init({ total })
      const { list = [] } = data
      this.list = list
      this.loading = false
    }
  }
}
</script>
