<template>
  <ConsolePageLayout>
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
            label="套餐名称"
            prop="package_name"
            min-width="150"
          />
          <el-table-column
            label="AccessKey"
            min-width="150"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.access_key }}</span>
              <el-tooltip content="点击可复制到粘贴板">
                <el-button
                  type="text"
                  @click="copyAccessKey(scope.row)"
                ><i
                  class="el-icon-copy-document"
                  style="margin-left: 8px"
                /></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="到期时间"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnExpireTime :expire-time="scope.row.expire_time" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="170"
            align="right"
          >
            <template slot-scope="scope">
              <router-link :to="{name: `${ModuleId}.router.meal__id`, params: {id: scope.row.id}}">
                <el-button type="text">
                  管理
                </el-button>
              </router-link>
              <el-divider direction="vertical" />
              <router-link :to="{name: `${ModuleId}.router.explorer`, params: {id: scope.row.id}}">
                <el-button type="text">
                  资源管理
                </el-button>
              </router-link>
              <el-divider direction="vertical" />
              <router-link :to="{name: `${ModuleId}.router.business__id`, params: {id: scope.row.id}, query: {title: scope.row.package_name}}">
                <el-button type="text">
                  控制台
                </el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'

export default {
  inject: ['ModuleId'],

  components: { ColumnExpireTime },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/tjkd.app.package.list'
    }
  },

  methods: {
    copyAccessKey(row) {
      this.Help.copyText(row.access_key)
      this.$message.success('复制成功')
    }
  }
}
</script>
