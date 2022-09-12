<template>
  <DmDialog
    ref="Dialog"
    :mode="mode"
    :footer="false"
    width="600px"
    title="提示"
    @submit="handleSubmit"
  >
    <yd-alert type="danger">
      {{ form.fail_total }} 个证书绑定失败，原因: {{ form.remark }}<br>
    </yd-alert>
    <DmTable>
      <el-table :data="form.list">
        <el-table-column
          prop="ca_name"
          label="证书名称"
          width="180"
        />
        <el-table-column
          prop="issuer"
          label="颁发机构"
          min-width="200"
        />
        <el-table-column
          label="状态"
          min-width="80"
          align="right"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.fail" class="color--danger">
              失败
            </span>
            <span v-else class="color--success">
              成功
            </span>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      formDefault: {
        list: [],
        remark: ''
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = 'Edit'
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
