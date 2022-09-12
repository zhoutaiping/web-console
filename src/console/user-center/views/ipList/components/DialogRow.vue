<template>
  <DmDialog
    ref="Dialog"
    :show-submit="false"
    :mode="mode"
    aside
    width="800px"
    title="管理IP列表"
    cance-text="关闭"
    @close="$emit('init')"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 支持IPv4、CIDR格式，且每个IP列表允许添加的IP上限为20万个<br >
      2. 支持使用CSV、TXT文件格式批量上传IP，单个文件仅支持添加2万条<br >
      3. 当使用TXT文档格式时，请以回车或英文逗号分隔多个IP<br >
      4. 当使用CSV文档格式时，同时支持上传IP信息及备注，格式请
      <el-popover trigger="hover">
        <template>
          <img src="./csv_test.png" alt="csv_test">
        </template>
        <span slot="reference" class="color--primary">参考图示</span>
      </el-popover>
    </DmAlert>
    <TableList
      v-if="userInfo.id"
      ref="TableList"
      :data-params="{
        user_ip_id: form.id,
        member_id: userInfo.id,
      }"
      :id="form.id"
    />
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TableList from './TableList'
export default createDialog({
  components: { TableList },

  data() {
    return {
      formDefault: {}
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.$nextTick(() => {
        this.$refs.TableList.fetchList()
      })
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
