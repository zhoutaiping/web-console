<template>
  <div>
    <DmToolbar>
      <div slot="right">
        <InputSearch
          v-model="bindParams.domain"
          placeholder="请输入域名进行搜索"
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
          <el-table-column
            label="域名/IP"
            prop="domain"
            min-width="180"
          />
          <el-table-column
            label="端口"
            prop="port"
            min-width="120"
          />
          <el-table-column
            label="服务"
            prop="service"
            min-width="120"
          />
          <el-table-column
            label="首次发现时间"
            prop="create_at"
            min-width="180"
          />
          <el-table-column
            label="最近发现时间"
            prop="create_at"
            min-width="180"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'

export default {
  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/soc.assets.info.list',
      bindParams: {
        domain: this.$route.query.property_object
      },
      selectionId: []
    }
  },

  methods: {
  }
}
</script>
