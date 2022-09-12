<template>
  <console-page-layout>
    <yd-alert>
      本月赠送云端短信1000条，赠送云端短信剩余{{ systemSmsNumber }}条，账号剩余短信<span>{{ usableSmsNumber }}</span>条，为避免短信条数用完后，您无法收到短信提醒，请保证您账号具有充足的短信条数。
      <TipsButton>购买短信条数</TipsButton>
    </yd-alert>
    <div class="tableHeader">

      <el-radio-group
        v-model="noticeType"
        @change="MessageTypeChangeFun"
      >
        <el-radio-button
          v-for="(item, index) in selectType"
          :label="item.value"
          :key="index"
        >
          {{ item.title }} ({{ unread_list[item.key] }})
        </el-radio-button>
      </el-radio-group>
    </div>
    <ComboTable
      :total="tableParams.total"
      :page-size="tableParams.pageSize"
      :page-sizes="tableParams.pageSizes"
      @on-size-change="getTableData"
      @on-current-change="getTableData"
    >
      <div slot="header_left">
        <el-button @click="deleteFun">删除</el-button>
        <el-button @click="updateMseeageType">标记为已读</el-button>
      </div>
      <div slot="body">
        <DmTable
          :loading="tableLoading"
          class="margin-top margin-bottom"
          min-height
        >
          <el-table
            :data="tableData"
            header-align="center"
            current-row-key="sss"
            class="message-list-table"
            @selection-change="handleSelectChange"
          >
            <el-table-column
              type="selection"
              align="center"
              width="55"
            />
            <el-table-column
              prop="msg_title"
              label="标题"
              align="left"
            >
              <template slot-scope="scope">
                <span
                  :class="{ hasRead: scope.row.read_flag === '1' }"
                  type="text"
                  class="message-title"
                  @click="messageDetail(scope.row)"
                >{{ scope.row.msg_title }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="notice_type"
              label="消息类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.notice_type }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="通知方式"
              align="center"
            >
              <template slot-scope="scope">
                <i
                  title="站内消息通知"
                  class="el-icon-message-solid iconfont-active margin-left"
                />
                <i
                  :class="{ 'iconfont-active': scope.row.switch_email === '1' }"
                  title="邮件通知"
                  class="el-icon-message margin-left"
                  style="margin-left: 10px"
                />
                <i
                  :class="{ 'iconfont-active': scope.row.switch_sms === '1' }"
                  title="短信通知"
                  class="el-icon-s-comment margin-left"
                  style="margin-left: 10px"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="notice_time"
              label="时间"
              align="right"
              min-width="165"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.notice_time }}</span>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </div>
    </ComboTable>
  </console-page-layout>
</template>

<script>
import MessageCenterResource from '../../resource/MessageCenterResource'
import ComboTable from '@/components/ComboTable/ComboTable'
import { mapActions } from 'vuex'
import Help from '@/utils/help'

export default {
  components: {
    ComboTable
  },

  data() {
    return {
      selectType: [
        {
          title: '全部消息',
          value: '',
          key: 'total'
        },
        {
          title: '安全消息',
          value: 2,
          key: 'security_notice'
        },
        {
          title: '故障消息',
          value: 3,
          key: 'fault_notice'
        },
        {
          title: '活动消息',
          value: 4,
          key: 'event_notice'
        },
        {
          title: '服务消息',
          value: 1,
          key: 'service_notice'
        }
      ],
      // totals: {
      //   all: 0,
      //   event_notice: 0,
      //   fault_notice: 0,
      //   security_notice: 0,
      //   service_notice: 0
      // },
      Help,
      noticeType: '',
      selectedItems: [],
      unread_list: {},
      tableParams: {
        type: 0,
        total: 0,
        page: 1,
        pageSize: 10
      },
      tableStatusParams: {
        user_id: 27037,
        web_message_id: [],
        status: 1
      },
      tableDeleteParams: {
        user_id: 27037,
        web_message_id: []
      },
      messageListSelectedArr: [],
      tableData: [],
      tableLoading: false,
      tableReadedNum: 0,
      tablenotReadNum: 0,
      value: '',
      systemSmsNumber: 0,
      usableSmsNumber: 0
    }
  },
  created() {
    this.init()
    this.getLastSms()
  },
  methods: {
    ...mapActions([
      'getUnReadNumber'
    ]),
    getTableData(current, size) {
      this.tableParams.page = current
      this.tableParams.pageSize = size
      this.init()
    },
    updateMseeageType() {
      if (this.selectedItems.length === 0) {
        this.$message({
          showClose: false,
          message: '勾选消息不能为空',
          type: 'warning'
        })
        return
      }
      this.tableLoading = true
      MessageCenterResource.updateMseeageType({
        message_id: this.selectedItems,
        read_flag: 1
      }).then(response => {
        this.$message({
          showClose: false,
          message: '消息状态更改成功',
          type: 'success'
        })
        this.init()
      }).catch(response => {
        this.tableLoading = false
      })
    },
    deleteFun() {
      if (this.selectedItems.length === 0) {
        this.$message({
          showClose: false,
          message: '勾选消息不能为空',
          type: 'warning'
        })
        return
      }
      this.tableLoading = true
      MessageCenterResource.delMessageList({
        message_id: this.selectedItems
      }).then(response => {
        this.$message({
          showClose: false,
          message: '删除成功',
          type: 'success'
        })
        this.selectedItems = []
        this.init()
      }).catch(response => {
        this.tableLoading = false
      })
    },
    onSubmit() { },
    messageDetail(row) {
      this.$router.push(`messageList/detail/${row.id}`)
    },
    handleSelectChange(selection) {
      this.selectedItems = []
      selection.forEach((value, index) => {
        this.selectedItems.push(Number(value.id))
      })
    },
    MessageTypeChangeFun(type) {
      this.noticeType = type
      this.init()
    },
    init() {
      this.tableLoading = true
      MessageCenterResource.getWebsiteList({
        notice_type: this.noticeType,
        page: this.tableParams.page,
        per_page: this.tableParams.pageSize
      }).then(
        result => {
          const { event_notice, fault_notice, security_notice, service_notice,
            total } = result.data.data.unread_list
          this.unread_list.event_notice = event_notice
          this.unread_list.fault_notice = fault_notice
          this.unread_list.security_notice = security_notice
          this.unread_list.service_notice = service_notice
          this.unread_list.total = total
          this.getUnReadNumber(this.unread_list.total)
          this.tableData = result.data.data.list
          this.tableParams.total = Number(result.data.data.total)
          this.tableLoading = false
        }
      )
      MessageCenterResource.getWebsiteList({
        notice_type: this.noticeType
      }).then(result => {
        sessionStorage.setItem('messageCenterList', JSON.stringify(result.data.data.list))
      })
    },
    messageTypeChange() {
      this.tableLoading = true
      this.messageTypeSelectData = []
      if (this.noticeType === '全部通知') {
        this.messageTypeSelectData = this.tableData
      } else {
        this.tableData.forEach((value, index) => {
          if (value.notice_type === this.noticeType) {
            this.messageTypeSelectData.push(value)
          }
        })
      }
      this.tableLoading = false
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

<style lang="scss" scoped>
.formCtrl {
  width: 500px;
}

.timeSelect {
  float: right;
  margin-right: 30px;
}

i {
  font-size: 18px;
  color: #aaa;
}

div.el-select {
  margin-left: 30px;
}

div.el-input-group__append {
  background-color: $--color-primary;
  cursor: pointer;
}

div.fuzzyQuery {
  float: right;
  width: 260px;
  margin-right: 58px;
}

.tableHeader {
  margin-bottom: 12px;
}

.readNum {
  color: $--color-primary;
}
.type-change-btn {
  display: inline-block;
  width: 140px;
  font-size: 12px;
  height: 50px;
  margin-right: 20px;
  line-height: 50px;
  box-sizing: border-box;
  cursor: pointer;
}
.type-change-btn i {
  margin-right: 4px;
  margin-left: 10px;
}
.typeBtnActive {
  background-color: $--color-primary;
  color: #fff;
}
.typeBtnActive i {
  color: #fff;
}
.message-operate-icon {
  color: $--color-primary;
  margin-right: 12px;
  cursor: pointer;
}
.message-title {
  cursor: pointer;
  font-weight: 900;
}
.message-title.hasRead {
  font-weight: 300;
}

.iconfont {
  font-size: 20px;
  margin-right: 6px;
}
.iconfont-active {
  color: $--color-primary;
}
.message-list-table {
  min-height: 120px;
}
.Tip-simulation {
  border: 1px solid rgb(255, 153, 52);
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff3e8;
}
.buy-sms {
  background-color: #fe8520;
  padding: 6px 12px;
  border-radius: 3px;
  border: 1px solid rgb(255, 153, 52);
  color: #555;
  cursor: pointer;
}
.ya-iconfont {
  width: 22px;
  height: 22px;
}
</style>
