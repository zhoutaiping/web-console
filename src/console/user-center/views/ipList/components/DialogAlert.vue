<template>
  <DmDialog
    ref="Dialog"
    :show-submit="false"
    width="450px"
    title="提示"
    cance-text="确定"
  >
    <yd-alert
      v-if="form.status"
      type="warning"
    >
      {{ form.status.message }}
    </yd-alert>
    <DmTable>
      <el-table :data="form.data">
        <el-table-column
          prop="code"
          label="规则 ID"
          min-width="180"
        />
        <el-table-column
          label="操作"
          min-width="60"
        >
          <template slot-scope="scope">
            <router-link :to="{name: 'cloud-speed.router.websiteList__wafDetail', params: {groupId: scope.row.group_id, id: scope.row.domain_id}, query: { from: 'diy'}}">
              <el-button type="text">管理</el-button>
            </router-link>
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
      formDefault: {}
    }
  }
})
</script>
