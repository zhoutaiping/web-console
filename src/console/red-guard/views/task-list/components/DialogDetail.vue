<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    title="任务详情"
    width="800px"
  >
    <DmData
      ref="DmData"
      :auto-init="false"
      class="margin-top"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="domain"
            label="域名"
            min-width="150"
          />
          <el-table-column
            label="描述"
            min-width="250"
          >
            <template slot-scope="scope">
              应用防护配置：{{ scope.row.groupName }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            min-width="350"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.exec_code === 1">
                <span class="color--success">操作成功</span>
              </template>
              <template v-else>
                <span class="color--danger">操作失败</span>（{{ scope.row.exec_msg }}）
              </template>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </DmDialog>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import consoleDialog from '@/mixins/consoleDialog'
import CardInfos from '@/components/Card/CardInfos'
import configItem from '../../../constants/config-item'

const KEY_MAP = {
  web_honeypot_rules: 'Web蜜网',
  mirror: '网站快照'
}

Object.keys(configItem).forEach(key => {
  const item = configItem[key]
  KEY_MAP[item.apiKey] = item.title
})

export default {
  components: { CardInfos },

  mixins: [consoleDialog, consoleData],

  data() {
    return {
      API_INDEX: 'V4/cdntpl.task.child'
    }
  },

  methods: {
    formatResponse(response) {
      response.list.forEach(item => {
        item.params = JSON.parse(item.params)
        item.groupName = KEY_MAP[item.params.group]
      })
      return response
    },

    afterOpen(row) {
      this.bindParams = {
        task_key: row.task_key
      }
      this.list = []
      this.$nextTick(() => {
        this.$refs.DmData.initPage()
      })
    }
  }
}
</script>
