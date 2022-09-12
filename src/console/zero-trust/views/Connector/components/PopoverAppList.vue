<template>
  <el-popover
    :disabled="row.connector_app.length === 0"
    trigger="hover"
    @show="fetchData"
  >
    <yd-scroll style="max-height: 300px">
      <DmTable
        v-loading="loading"
        style="width: 250px"
        type="white"
      >
        <el-table
          :data="list"
        >
          <el-table-column
            prop="app_name"
            label="应用名称"
            min-width="55"
          />
          <el-table-column
            prop="app_type_name"
            label="应用类型"
            min-width="55"
          />
        </el-table>
      </DmTable>
    </yd-scroll>
    <a slot="reference"><slot /></a>
  </el-popover>
</template>

<script>

export default {
  props: {
    row: Object
  },

  data() {
    return {
      loading: true,
      list: []
    }
  },

  methods: {
    async fetchData() {
      this.loading = true
      const res = await this.Fetch.post('V4/zero.trust.connector.app.bind.list', {
        connector_id: this.row.connector_id
      })
      this.loading = false
      this.list = res.list
    }
  }
}
</script>
