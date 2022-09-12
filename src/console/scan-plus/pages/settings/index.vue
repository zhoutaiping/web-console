<template>
  <div>
    <DmAlert>该通知与单独某个任务的通知互不影响，可使用其中一种方式通知，也可两种都使用。</DmAlert>
    <DmData
      ref="DmData"
      :show-pagination="false"
      @init="fetchList"
    >
      <DmTable
        :show-pagination="false"
        :loading="loading"
      >
        <el-table :data="list">
          <el-table-column
            label="任务类型"
            prop="title"
            min-width="150"
          />
          <el-table-column
            label="通知时间"
            min-width="150"

          >
            <template slot-scope="scope">
              {{ scope.row.noticeTimeView }}
            </template>
          </el-table-column>
          <el-table-column
            label="通知方式"
            min-width="150"
          >
            <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.notice_type "
                :key="index"
              >
                <span v-if="index > 0">, </span>
                {{ item | labelView(Select.RemindType) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="消息接收人"
            min-width="150"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.notice_receive.length <= 3">
                <span
                  v-for="(item, index) in scope.row.notice_receive "
                  :key="index"
                >
                  <span v-if="index > 0">, </span>
                  {{ item | labelView(selectNumber) }}
                </span>
              </template>
              <template v-else>
                {{ scope.row.notice_receive[0] | labelView(selectNumber) }} 等{{ scope.row.notice_receive.length }}个接收人
              </template>

            </template>
          </el-table-column>
          <el-table-column
            label="开关"
            prop="taskType"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.notice_switch"
                @change="handleChangeSwitch(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="150"
          >
            <template slot-scope="scope">
              <a @click="$refs.DialogRow.handleOpen(scope.row)">设置</a>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import { labelView } from '@/utils/filter'
import SelectMultiple from '@/components/Select/SelectMultiple'
import DialogRow from './components/DialogRow'
import Select from './select'

export default {
  components: { DialogRow, SelectMultiple },

  mixins: [consoleData],

  data() {
    return {
      Select,
      bindParams: {
        notice_receive: []
      },
      selectNumber: [],
      API_INDEX: 'V4/soc.notice.list'
    }
  },

  created() {
    this.fetchNumber()
  },

  methods: {
    async fetchNumber() {
      const data = await this.Fetch.get('V4/cloud.monitor.alertSetting.config')
      this.selectNumber = data.receivers_list.map(_ => {
        return {
          value: _.value,
          label: _.name
        }
      })
    },

    formatResponse(response) {
      const list = [
        {
          title: '内容安全',
          key: 'content_safe'
        },
        {
          title: 'WEB 漏扫',
          key: 'scan'
        },
        {
          title: '可用性监测',
          key: 'mcs'
        }
      ]
      const { list: map } = response
      return {
        list: list.map(item => {
          const settingItem = map[item.key]
          const noticeType = ['Hour', 'Day'].includes(settingItem.notice_time) ? settingItem.notice_time : 'Week'
          let noticeTimeView = labelView(noticeType, Select.NoticTime)

          if (['Week'].includes(noticeType)) {
            noticeTimeView += ' ' + labelView(settingItem.notice_time, Select.Week)
          }

          if (['Week', 'Day'].includes(noticeType)) {
            noticeTimeView += ' 9:00'
          }

          return {
            noticeTimeView,
            notice_receive: this.bindParams.notice_receive,
            ...item,
            ...settingItem
          }
        })
      }
    },

    async handleChangeSwitch(row) {
      try {
        await this.Fetch.post('V4/soc.notice.set', {
          ...row
        })
      } finally {
        this.fetchList()
      }
    }
  }
}
</script>
