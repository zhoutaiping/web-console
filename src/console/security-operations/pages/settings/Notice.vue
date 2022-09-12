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
            label="任务类型"
            prop="taskType"
            min-width="150"
          />
          <el-table-column
            label="通知时间"
            prop="remindTime"
            min-width="150"
          />
          <el-table-column
            label="通知方式"
            min-width="150"
          >
            <template slot-scope="scope">
              <!--  -->
              <yd-form-checkbox :checks="selectRemindType" />
            </template>
          </el-table-column>
          <el-table-column
            label="开关"
            prop="taskType"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-switch />
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'

export default {
  components: {},

  mixins: [consoleData],

  props: {},

  data() {
    return {
      API_INDEX: '',
      selectRemindType: [
        {
          label: '邮件',
          value: 'mail'
        },
        {
          label: '短信',
          value: 'sms'
        }
      ]
    }
  },

  computed: {},

  methods: {
    formatResponse(response) {
      return {
        list: [
          {
            taskType: '可用性监测',
            remindTime: '每周 周一 9:00',
            remindMethod: '邮件',
            available: false
          }]
      }
    }
  }
}
</script>
