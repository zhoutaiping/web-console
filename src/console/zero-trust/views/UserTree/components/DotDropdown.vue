<template>
  <el-dropdown
    trigger="click"
    @command="handleClick"
  >
    <i class="el-icon-more rotate" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="create">新增子组织</el-dropdown-item>
      <el-dropdown-item
        v-if="data.parentId && data.parentId !== 'root'"
        command="edit"
      >编辑组织</el-dropdown-item>
      <el-dropdown-item
        v-if="data.parentId && data.parentId !== 'root'"
        command="delete"
      >删除组织</el-dropdown-item>
      <el-dropdown-item
        command="export"
      >导出组织架构或用户</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>

export default {
  props: {
    // 注入数据
    data: {
      type: Object
    }
  },

  methods: {
    handleClick(cmd) {
      this.$emit(cmd, this.data)
    }
  }
}
</script>
