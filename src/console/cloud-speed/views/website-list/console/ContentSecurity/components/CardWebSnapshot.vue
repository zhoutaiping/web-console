<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="false"
    title="网站快照"
  >
    <SelectSwitch
      v-if="list && list.length"
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="handleUpdateStatus"
    />
    <template slot="tips">
      分区域、分时间对外提供快照访问控制，强烈建议在敏感时期启用网站快照访问控制，可100%保障内容安全。
    </template>
    <TableWebSnapshotList
      ref="TableWebSnapshotList"
      :status="form.status"
      @update="handleUpdateList"
    />
    <el-form
      v-if="list && list.length"
      :model="form"
      class="margin-top"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="快照使用时间">
        <yd-form-radio
          :radios="selectTime"
          v-model="form.use_time_mode"
        />
      </el-form-item>
      <template v-if="form.use_time_mode !== 'all'">
        <el-form-item
          label="星期"
          prop="time_control.weeks"
        >
          <yd-form-checkbox
            :checks="WEEKS"
            v-model="form.time_control.weeks"
            show-check-all
          />
        </el-form-item>
        <el-form-item
          label="时间"
          prop="time_control.startTime"
        >
          <el-time-picker
            v-model="form.time_control.startTime"
            value-format="HH:mm"
            placeholder="--|--"
            style="margin-right: 8px"
          />
          <el-time-picker
            v-model="form.time_control.endTime"
            value-format="HH:mm"
            placeholder="--|--"
          />
        </el-form-item>
      </template>
      <el-form-item label=" ">
        <el-button
          type="primary"
          @click="handleUpdate"
        >保存</el-button>
      </el-form-item>
      <el-divider />
      <el-form-item label="区域模式">
        <yd-form-radio
          v-model="form.zone_mode"
          :radios="selectMode"
          @change="handleUpdate"
        />
      </el-form-item>
      <el-form-item v-show="form.zone_mode !== 'no'">
        <SelectRegion
          v-show="form.zone_mode === 'black'"
          v-model="form.blackList"
          :fetch-submit="val => updateZoneLimitList(val, 'black')"
        />
        <SelectRegion
          v-show="form.zone_mode === 'white'"
          v-model="form.whiteList"
          :fetch-submit="val => updateZoneLimitList(val, 'white')"
        />
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="open"
      title="提示"
      width="400px"
      class="off-box"
    >
      <span>
        关闭快照服务后，开启定时更新的系统快照仍会继续爬取，
        是否同时关闭系统快照的定时更新？</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="setSnapSafeStatus(form.status, true)"
        >同时关闭定时更新</el-button>
        <el-button
          type="primary"
          @click="setSnapSafeStatus(form.status, false)"
        >仅关闭快照</el-button>
      </span>
    </el-dialog>
  </CardItemForm>
</template>

<script>
import create from '@/utils/create-basic'
import SelectSwitch from '@/components/Select/SelectSwitch'
import SelectRegion from '@/components/Select/SelectRegion'
import InputWeekTime from '@/components/Input/InputWeekTime'
import consoleItem from '../../../../../mixins/consoleItem'
import TableWebSnapshotList from './TableWebSnapshotList'

export default create({
  name: 'CardWebSnapshot',

  mixins: [consoleItem],

  components: {
    SelectSwitch,
    SelectRegion,
    InputWeekTime,
    TableWebSnapshotList
  },

  data() {
    return {
      SETTING_ID: 'safe_snap',
      WEEKS: [
        {
          label: '星期一',
          value: 1
        },
        {
          label: '星期二',
          value: 2
        },
        {
          label: '星期三',
          value: 3
        },
        {
          label: '星期四',
          value: 4
        },
        {
          label: '星期五',
          value: 5
        },
        {
          label: '星期六',
          value: 6
        },
        {
          label: '星期日',
          value: 0
        }
      ],
      selectTime: [
        {
          label: '全部时间',
          value: 'all'
        },
        {
          label: '指定时间白名单',
          value: 'whitelist'
        },
        {
          label: '指定时间黑名单',
          value: 'blacklist'
        }
      ],
      selectMode: [
        {
          label: '不启用',
          value: 'no'
        },
        {
          label: '启用白名单',
          value: 'white'
        },
        {
          label: '启用黑名单',
          value: 'black'
        }
      ],
      formDefault: {
        status: 'off',
        use_time_mode: 'all',
        zone_mode: 'no',
        list: [],
        whiteList: [],
        blackList: [],
        time_control: {
          week: '',
          startTime: '',
          endTime: ''
        }
      },
      open: false,
      list: []
    }
  },

  methods: {
    formatResponse(data) {
      if (data.time_control && data.time_control.weeks) {
        data.time_control.weeks = data.time_control.weeks.map(Number)
      }
      return data
    },

    handleUpdateList(list) {
      this.list = list
    },
    async updateZoneLimitList(listDate, type) {
      this.form[`${type}List`] = listDate
      try {
        await this.handleUpdate()
      } catch (e) {
        throw new Error()
      }
    },

    async handleUpdate() {
      await this.confirmAction()

      const TableWebSnapshotList = this.$refs.TableWebSnapshotList.getList()

      const onItem = TableWebSnapshotList.find(_ => Boolean(_.on_use))
      if (onItem) {
        this.form.on_use_mirror = Number(onItem.type) === 0 ? 'system' : onItem.mirror_id
      }
      this.fetchUpdate(null, null)
    },
    handleClose() {
      this.open = false
      this.form.status = 'on'
    },
    async handleUpdateStatus(status) {
      if (status === 'off') {
        this.open = true
        return
      }
      this.setSnapSafeStatus(status)
    },
    async setSnapSafeStatus(status, autoOff) {
      const data = {
        status,
        domain: this.domainInfo.domain
      }
      if (status === 'off') {
        data['autooff'] = autoOff
      }
      await this.confirmAction()
      try {
        await this.Fetch.post('V4/replaceMirror.mirror.setSnapSafeStatus', data)
      } finally {
        this.domainFetchSettings(this.SETTING_ID)
        this.open = false
        this.$refs.TableWebSnapshotList.fetchList()
      }
      this.Message('ACTION_SUCCESS')
    }
  }
})
</script>
<style lang="scss" scoped>
.off-box {
  ::v-deep .el-dialog__body {
    padding: 16px;
  }
  ::v-deep .el-dialog__foot {
    padding: 16px;
  }
  ::v-deep .el-dialog__header {
    font-size: 14px;
    border-bottom: 1px solid #eee;
    .el-dialog__title {
      padding-left: 12px;
      border-left: 3px solid #2d90e6;
    }
    .el-dialog__headerbtn {
      top: 12px;
      right: 16px;
    }
    .el-dialog__close {
      font-size: 15px;
    }
  }
}
</style>
