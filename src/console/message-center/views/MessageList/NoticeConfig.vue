<template>
  <console-page-layout>
    <yd-alert>
      本月赠送云端短信条数{{ systemSmsNumber }}条，账号剩余短信条数<span>{{ usableSmsNumber }}</span>条，为避免短信条数用完后，您无法收到短信提醒，请保证您账号具有充足的短信条数。<TipsButton title="购买短信条数" />
    </yd-alert>
    <DmTable>
      <el-table
        :data="tableData.data"
        class="tableNotice"
      >
        <el-table-column
          prop="project_name"
          label="通知项目"
        />
        <el-table-column
          prop="project_des"
          label="描述"
        />
        <el-table-column
          label="通知方式"
          align="right"
        >
          <template slot-scope="scope">
            <el-checkbox-group
              v-model="scope.row.noticeConfig"
              :id="scope.row.id"
              @change="updateNoticeConfig(scope.row)"
            >
              <el-checkbox
                label="1"
                disabled
              >站内</el-checkbox>
              <el-checkbox label="2">邮件</el-checkbox>
              <el-checkbox label="3">短信</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </console-page-layout>
</template>

<script>
import MessageCenterResource from '../../resource/MessageCenterResource'

export default {
  data() {
    return {
      tableData: {
        data: [],
        titles: [],
        loading: false
      },
      buttonType: 0,
      checkArr: {},
      systemSmsNumber: 0,
      usableSmsNumber: 0
    }
  },

  created() {
    this.init()
    this.getLastSms()
  },

  methods: {
    init() {
      this.tableData.loading = true
      const params = {
        user_id: 27037
      }
      MessageCenterResource.getNoticeConfigList(params).then(
        result => {
          const noticeList = Object.values(result.data.data.list)
          for (let i = 0; i < noticeList.length; i++) {
            if (noticeList[i].noticeConfig === undefined) {
              noticeList[i].noticeConfig = []
            }
            noticeList[i].noticeConfig[0] = noticeList[i].switch_msg === '0' ? '0' : '1'
            noticeList[i].noticeConfig[1] = noticeList[i].switch_email === '0' ? '0' : '2'
            noticeList[i].noticeConfig[2] = noticeList[i].switch_sms === '0' ? '0' : '3'
          }
          this.tableData.data = noticeList
          this.tableData.loading = false
        }
      )
    },

    updateNoticeConfig(row) {
      this.tableData.loading = true
      const midValueArray = [0, 0, 0]
      row.noticeConfig.forEach((value, index) => {
        if (value === '1') {
          midValueArray[0] = 1
        } else if (value === '2') {
          midValueArray[1] = 1
        } else if (value === '3') {
          midValueArray[2] = 1
        }
      })
      MessageCenterResource.updateNoticeConfig({
        message_setting_id: row.id,
        project_key: row.project_key,
        switch_email: midValueArray[1],
        switch_sms: midValueArray[2],
        switch_msg: midValueArray[0]
      }).then(response => {
        this.$message.success('通知方式更改成功')
        this.tableData.loading = false
      }).catch(response => {
        this.tableData.loading = false
      })
    },

    getLastSms() {
      MessageCenterResource.getLastSms().then(response => {
        this.systemSmsNumber = Number(response.data.data.system_presented)
        this.usableSmsNumber = response.data.data.total_usable_sms_number
      })
    }
  }
}
</script>
