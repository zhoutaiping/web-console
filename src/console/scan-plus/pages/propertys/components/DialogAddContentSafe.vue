<template>
  <DialogStep
    ref="Dialog"
    :steps="steps"
    :mode="mode"
    :active.sync="active"
    :submit-loading="submitLoading"
    width="500px"
    title-label="内容安全监测"
    @submit="handleSubmit"
    @next="handleNext"
  >
    <div style="margin: 0 50px;">
      <DmAlert
        v-show="active===1"
        class="margin-top"
      >
        请根据自身需求选择全站与自定义页面的监控频率
      </DmAlert>
      <el-form
        v-show="active===1"
        ref="FormStep1"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="监控对象">
          {{ form.domain }}
        </el-form-item>
        <el-form-item label="监控页面">
          <yd-form-radio-button
            :radios="selects.operationType"
            v-model="form.operationType"
            @change="changeOperationType"
          />
          <div>
            <template v-if="form.operationType === 1">
              监控首页：5分钟/次
            </template>
            <template v-if="form.operationType === 2">
              <yd-form-radio
                :radios="selects.scanRate[2]"
                v-model="form.scanRate"
              />
            </template>
            <template v-if="form.operationType === 3">
              <yd-form-radio
                :radios="selects.scanRate[3]"
                v-model="form.scanRate"
              />
            </template>
          </div>
        </el-form-item>
        <el-form-item label="监控协议">
          <yd-form-select
            :selects="selects.protocol"
            v-model="form.protocol"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="监控端口">
          <el-input
            v-model="form.port"
            style="width: 200px"
            placeholder="监控端口"
          />
        </el-form-item>
        <el-form-item label="浏览器渲染">
          <el-switch v-model="form.render" />
        </el-form-item>
        <el-form-item
          v-if="form.operationType === 3"
          label="自定义路径"
          prop="customUrl"
        >
          <el-input
            v-model="form.customUrl"
            :rows="5"
            type="textarea"
            placeholder="请输入路径，以“/”开头"
          />
        </el-form-item>
      </el-form>
      <el-form
        v-show="active===2"
        label-position="top"
        label-width="100px"
      >
        <DmAlert class="margin-top">
          外链内容监控周期为24h
        </DmAlert>
        <el-form-item label="选择监控项">
          <el-checkbox
            v-for="(item, index) in MONITOR_ITEM"
            :key="index"
            v-model="form[item.value]"
          >
            {{ item.label }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <FormNoticeBasic
        v-show="active === 3"
        ref="FormNoticeBasic"
        :pform="form"
      />
    </div>
  </DialogStep>
</template>

<script>
import DialogStep from '@/components/Dialog/DialogStep'
import RULE from '@/utils/verify'
import createDialog from '@/utils/createDialog'
import FormNoticeBasic from './FormNoticeBasicV2'

const MONITOR_ITEM = [
  {
    label: '篡改监控',
    value: 'tamper'
  },
  {
    label: '敏感词监控',
    value: 'sensitiveWord'
  },
  {
    label: '关键词',
    value: 'keyword'
    // disabled: true
  },
  {
    label: '异常状态码监控',
    value: 'statusCode'
  },
  {
    label: '恶意链接监控',
    value: 'darkChain'
  },
  {
    label: '风险外链监控',
    value: 'outerInspect'
  }
]

function urlVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = value.split(/[\n\r]/g)
    value = value.filter(_ => _)
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  value.forEach(item => {
    if (!RULE.slashBegin.test(item)) {
      callback(new Error('格式有误'))
    }
  })
  callback()
}

export default createDialog({
  components: { DialogStep, FormNoticeBasic },

  data() {
    return {
      submitLoading: false,
      MONITOR_ITEM,
      active: 1,
      id: '',
      mode: 'Create',
      selects: {
        operationType: [
          { value: 1, label: '首页' },
          { value: 2, label: '全站' },
          { value: 3, label: '自定义' }
        ],
        protocol: [
          {
            label: 'HTTPS',
            value: 'https'
          },
          {
            label: 'HTTP',
            value: 'http'
          }
        ],
        scanRate: {
          2: [
            { label: '1h/次', value: 60 },
            { label: '6h/次', value: 6 * 60 },
            { label: '12h/次', value: 12 * 60 }
          ],
          3: [
            { label: '30分钟/次', value: 30 },
            { label: '2h/次', value: 2 * 60 },
            { label: '6h/次', value: 6 * 60 }
          ]
        }
      },
      steps: [
        {
          title: '监控配置',
          icon: 'el-icon-setting'
        },
        {
          title: '监测详情',
          icon: 'el-icon-edit'
        },
        {
          title: '通知告警',
          icon: 'el-icon-bell'
        }
      ],
      formDefault: {
        detection_id: '',
        domain: '',
        operationType: 1,
        scanRate: 5,
        tamper: false,
        sensitiveWord: false,
        keyword: false,
        statusCode: false,
        darkChain: false,
        outerInspect: false,
        customUrl: '',
        protocol: 'http',
        render: false,
        // 每日最大通知次数--dayMaxNoticeNum    篡改监控--tamperCoolingTime     敏感词监控--sensitiveWordCoolingTime     关键词监控--keywordCoolingTime   恶意链接监控--darkChainCoolingTime   异常状态码监控--statusCodeCoolingTime
        dayMaxNoticeNum: 5,
        tamperCoolingTime: 0,
        sensitiveWordCoolingTime: 0,
        keywordCoolingTime: 0,
        darkChainCoolingTime: 0,
        statusCodeCoolingTime: 0
      },
      form: {},
      rules: {
        customUrl: [
          { required: true, trigger: 'blur', message: '请填写' }
        ]
      }
    }
  },

  methods: {
    async afterOpen(form) {
      this.active = 1
      let customUrl = JSON.parse(JSON.stringify(form.customUrl))
      if (customUrl && customUrl.length) customUrl = set(customUrl, form.startUrl)
      form.customUrl = customUrl.join('\n')
      this.$nextTick(() => {
        Object.assign(this.form, form)
      })

      function set(list = [], split_val = '') {
        return list.map(item => {
          const [startUrl, url] = item.split(split_val)
          return url
        })
      }
    },

    initOptions(form) {
      this.mode = form.uuid ? 'Edit' : 'Create'
      this.uuid = form.uuid ? form.uuid : ''
      this.form = {
        ...this.formDefault,
        ...form
      }

      this.$refs.FormNoticeBasic.restForm()

      if (this.mode === 'Edit') {
        this.$refs.FormNoticeBasic.setForm({
          freeTimeStart: form.freeTimeStart,
          freeTimeEnd: form.freeTimeEnd,
          alarmType: form.alarmType,
          alarmReceiver: form.alarmReceiver,
          dayMaxNoticeNum: form.dayMaxNoticeNum !== '' ? form.dayMaxNoticeNum : 5,
          tamperCoolingTime: form.tamperCoolingTime || 0,
          sensitiveWordCoolingTime: form.sensitiveWordCoolingTime || 0,
          keywordCoolingTime: form.keywordCoolingTime || 0,
          darkChainCoolingTime: form.darkChainCoolingTime || 0,
          statusCodeCoolingTime: form.statusCodeCoolingTime || 0,
          outerInspectCoolingTime: form.outerInspectCoolingTime || 0
        })
      }
    },

    changeOperationType() {
      const operationType = this.form.operationType
      if (operationType === 1) {
        this.form.scanRate = 5
      } else if (operationType === 2) {
        this.form.scanRate = 6 * 60
      } else if (operationType === 3) {
        this.form.scanRate = 2 * 60
      }
    },
    handleNext() {
      if (this.active === 1) {
        this.$refs.FormStep1.validate(valid => {
          if (!valid) throw new Error()
        })
      }

      this.active++
    },

    async handleSubmit() {
      const formNotice = await this.$refs.FormNoticeBasic.getForm()
      const form = {
        ...this.form,
        ...formNotice
        // notice_type: formNotice.alert_type
        // notice_member_list: formNotice.alert_receivers,
      }
      if (form.customUrl) {
        const customUrl = form.customUrl.split(/[\n\r]/g).filter(_ => _)
        form.customUrl = customUrl.map(i => {
          return form.protocol + '://' + form.domain + i
        })
      }

      this.submitLoading = true
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/content.safe.monitor.add', form)
        } else {
          // form.detection_id = this.id
          await this.Fetch.post('V4/content.safe.monitor.modify', form)
        }
      } catch (e) {
        return
      } finally {
        this.submitLoading = false
      }
      this.Message('ACTION_SUCCESS')
      this.handleClose()
      this.$emit('init')
    }
  }
})
</script>
