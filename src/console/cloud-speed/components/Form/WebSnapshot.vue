<template>
  <div>
    <DmAlert>
      1. 仅针对未曾创建快照的网站创建快照，创建完成后，会立即对网站全站更新快照，若创建网站快照的数量较多，则会存在一定时间的延迟<br>
      2. 针对统一创建网站快照的网站，在创建完成后，网站快照功能会自动开启
    </DmAlert>
    <div v-if="form.status === 'on'">
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-divider content-position="left">系统快照配置</el-divider>
        <el-form-item label="备份内容配置">
          <yd-form-radio
            :radios="addReserved(BACKUPS_TYPE, 'keep', isBatch)"
            v-model="form.backup_content"
          />
        </el-form-item>
        <el-form-item label="浏览器渲染抓取">
          <yd-form-radio
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep', isBatch)"
            v-model="form.limit_js"
            style="margin-right: 12px"
          />
          <TipsTooltip>需要网站支持浏览器渲染，开启后爬虫会以 JS 方式抓取，但需明白，开启后会加大整体爬取时长</TipsTooltip>
        </el-form-item>
        <el-form-item label="更新间隔">
          <yd-form-radio
            :radios="addReserved(selects.selectRegularUpdate, 'keep', isBatch)"
            v-model="form.regular_update"
            style="margin-right: 12px"
          />
        </el-form-item>
        <el-divider content-position="left">快照使用策略</el-divider>
        <el-form-item label="快照使用时间">
          <yd-form-radio
            :radios="addReserved(selects.use_time_mode, 'keep', isBatch)"
            v-model="form.use_time_mode"
          />
        </el-form-item>
        <template v-if="IS_CUSTOM_TIME.includes(form.use_time_mode)">
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
        <el-form-item label="区域模式">
          <yd-form-radio
            :radios="addReserved(selects.zone_mode, 'keep', isBatch)"
            v-model="form.zone_mode"
          />
        </el-form-item>
        <template v-if="form.zone_mode === 'white' || form.zone_mode === 'black'">
          <el-form-item
            v-if="isBatch"
            label="添加方式"
          >
            <yd-form-radio
              v-model="formBatch._pmode"
              :radios="SELECT.EDIT_TYPE_M2"
            />
          </el-form-item>
          <el-form-item>
            <SelectRegion
              v-if="form.zone_mode === 'white'"
              v-model="form.whiteList"
            />
            <SelectRegion
              v-if="form.zone_mode === 'black'"
              v-model="form.blackList"
            />
          </el-form-item>
        </template>
        <el-divider content-position="left">多备源设置</el-divider>
        <el-form-item label="选择快照">
          <yd-form-select
            v-model="form.on_use_mirror_name"
            :selects="isBatch ? addReserved(selectMirrorName, 'keep', isBatch) : selectType"
          />
        </el-form-item>
        <el-form-item
          label="备份快照"
        >
          <TableWebSnapShot
            ref="TableWebSnapShot"
            :is-batch="isBatch"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import SelectRegion from '@/components/Select/SelectRegion'
import baseMixins from './base'
import SELECT from '../../constant/select'
import TableWebSnapShot from './components/TableWebSnapShot'
import dialogBatch from '@/console/cloud-speed/mixins/dialog-batch'

const selectRegularUpdate = [
  {
    label: '12小时',
    value: 12
  },
  {
    label: '1天',
    value: 24
  },
  {
    label: '不更新',
    value: 0
  }
]

const selectType = [
  {
    label: '系统快照',
    value: '系统快照'
  }
]

const IS_CUSTOM_TIME = ['whitelist', 'blacklist']

export default {
  components: { SelectRegion, TableWebSnapShot },

  mixins: [baseMixins, dialogBatch],

  data() {
    return {
      IS_CUSTOM_TIME,
      addReserved,
      SELECT,
      selectType,
      selectMirrorName: [],
      config: {
        selectStatus: [
          {
            value: 'off',
            label: 'OFF'
          },
          {
            value: 'on',
            label: 'ON'
          }
        ]
      },
      selects: {
        selectRegularUpdate,
        use_time_mode: [
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
        zone_mode: [
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
        ]
      },
      BACKUPS_TYPE: [
        {
          label: '首页',
          value: 0
        },
        {
          label: '全站',
          value: 1
        }
      ],
      WEEKS: [
        {
          label: '星期一',
          value: '1'
        },
        {
          label: '星期二',
          value: '2'
        },
        {
          label: '星期三',
          value: '3'
        },
        {
          label: '星期四',
          value: '4'
        },
        {
          label: '星期五',
          value: '5'
        },
        {
          label: '星期六',
          value: '6'
        },
        {
          label: '星期日',
          value: '0'
        }
      ],
      formDefault: {
        backup_content: 0,
        regular_update: 0,
        limit_js: 0,
        status: 'off',
        use_time_mode: 'all',
        time_control: {
          weeks: [],
          startTime: '00:00',
          endTime: '23:59'
        },
        zone_mode: 'no',
        on_use_mirror_name: '',
        whiteList: [],
        blackList: []
      },
      formBatch: {
        _pmode: 'append'
      },
      formDefaultBatch: {
        _policy: 'keep',
        backup_content: 'keep',
        regular_update: 'keep',
        limit_js: 'keep',
        status: 'keep',
        use_time_mode: 'keep',
        time_control: {
          weeks: [],
          startTime: '00:00',
          endTime: '23:59'
        },
        zone_mode: 'keep',
        whiteList: [],
        blackList: [],
        on_use_mirror_name: 'keep'
      },
      rules: {
        time_control: {
          weeks: [{ type: 'array', required: true, message: '清选择星期' }],
          startTime: [{ type: 'string', required: true, message: '清选择' }],
          endTime: [{ type: 'string', required: true, message: '清选择' }]
        }
      }
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    setForm(form = {}) {
      if (this.isBatch) {
        this.fetchNameOverlap()
      } else {
        form.backup_content = Number(form.backup_content)
        form.limit_js = Number(form.limit_js)
        form.regular_update = Number(form.regular_update)
      }

      if (!form.time_control || !form.time_control.weeks) {
        delete form.time_control
      }
      this.form = {
        ...this.isBatch ? this.formDefaultBatch : this.formDefault,
        ...form
      }

      if (!this.isBatch) {
        const { backup_list = [] } = form
        this.$nextTick(() => {
          this.$refs.TableWebSnapShot.setList(backup_list)
        })
      }
    },

    async fetchNameOverlap() {
      const params = {}
      if (this.batchSelectType === 'custom') {
        params.domain_id = this.selectsId
      } else {
        params.group_id = this.batchGroupId
      }

      const data = await this.Fetch.get('V4/replaceMirror.mirror.getDomainMirrorNameOverlap', params)
      delete data._status

      this.selectMirrorName = data.map(value => {
        return {
          value,
          label: value
        }
      })
    },

    async getForm() {
      const status = this.form.status

      if (status === 'on') {
        this.$refs.Form.validate(valid => {
          if (!valid) throw new Error()
        })
      }

      let TableWebSnapShotData = {
        list: []
      }

      if (this.$refs.TableWebSnapShot) {
        TableWebSnapShotData = this.$refs.TableWebSnapShot.getList()
      }

      const form = {
        mirror: {
          status,
          limit_js: String(this.form.limit_js),
          backup_content: String(this.form.backup_content),
          regular_update: String(this.form.regular_update),
          backup_list: TableWebSnapShotData.list
        },
        safe_snap: {
          status,
          _policy: status,
          use_time_mode: this.form.use_time_mode,
          zone_mode: this.form.zone_mode,
          whiteList: this.form.whiteList,
          blackList: this.form.blackList,
          ...this.isBatch ? this.formBatch : {},
          on_use_mirror_name: this.form.on_use_mirror_name
        }
      }

      if (this.isBatch) {
        form.mirror._policy = TableWebSnapShotData._policy || 'keep'
      }

      if (form.safe_snap && IS_CUSTOM_TIME.includes(form.safe_snap.use_time_mode)) {
        form.safe_snap.time_control = this.form.time_control
      }

      return form
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
