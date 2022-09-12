<template>
  <DmDialog
    ref="Dialog"
    :action-visible="false"
    width="700px"
    title="提示"
    @submit="handleSubmit"
  >
    <yd-alert type="warning">
      部分 URL 未成功
    </yd-alert>
    <DmTable border type="white">
      <el-table
        :data="form.list"
        max-height="650"
      >
        <el-table-column
          prop="url"
          label="URL"
          min-width="250"
        />
        <el-table-column
          min-width="250"
          label="失败原因"
        >
          <template slot-scope="scope">
            <i class="el-icon-error color--danger" />
            {{ scope.row.message }}
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
        list: []
      }

    }
  },

  methods: {
    initOptions(form, options) {
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
