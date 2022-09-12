<template>
  <DmDialog
    ref="Dialog"
    :class="b()"
    :submit-text="submitText"
    :fetch-submit="fetchSubmit"
    width="700px"
    title="资产认证"
    @submit="handleSubmit"
  >
    <el-form>
      <el-form-item>
        <yd-form-radio-button
          :radios="VERIFY_TYPE"
          v-model="verify_type"
        />
      </el-form-item>
      <div
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
      >
        <DmAlert v-if="verify_type === VERIFY_TYPE_VAR.FILE_VERIFY">
          1. 创建内容为 <strong>{{ info.token }}</strong> 的 {{ info.file_name }} 文件<br>
          2. 将 {{ info.file_name }} 文件上传到网站 {{ info.property_object }} 的根目录下
          完成操作后请点击 <strong>立即认证</strong> 按钮
        </DmAlert>
        <DmAlert v-if="verify_type === VERIFY_TYPE_VAR.TXT_VERIFY">
          请到域名当前解析商处给该域名添加如下TXT记录：<br>
          主机记录：<strong>{{ info.record_value }}</strong><br>
          记录值：<strong>{{ info.token }}</strong><br>
          添加记录成功后，系统会自动扫描您添加的TXT记录（扫描过程大约需要1分钟），您可以点击 <strong>立即认证</strong> 按钮进行验证。
        </DmAlert>
        <DmAlert v-if="verify_type === VERIFY_TYPE_VAR.WORLD">
          1. 请下载 <a
            href="https://yundun-statics.yundun.com/%E8%B5%84%E4%BA%A7%E8%AE%A4%E8%AF%81%E6%8E%88%E6%9D%83%E4%B9%A6.docx"
            target="_blank"
          >授权书</a>，并签字盖章 <a @click="Help.openServicePanel(appAssets.afterKF)">联系我们</a> ，任何信息伪造、欺骗行为，将由用户负全部法律责任。<br>
          2. 签字盖章后表示您添加的资产已同意由上海云盾进行安全监测和漏洞扫描。<br>
          3. 授权书由人工审核，同时需要确定与添加资产的准确性，因此需要一定时间，一般为1~3天。<br>
          4. 使用授权书认证后，在进行漏洞扫描时，无需重新发送授权书。
        </DmAlert>
      </div>
    </el-form>
  </DmDialog>
</template>

<script>
import create from '@/utils/create-basic'
import Dialog from '@/components/Dialog/Dialog'
import consoleDialog from '@/mixins/consoleDialog'

const VERIFY_TYPE_VAR = {
  FILE_VERIFY: 1,
  TXT_VERIFY: 2,
  WORLD: 3
}

export default create({
  name: 'DialogAuth',

  components: { Dialog },

  mixins: [consoleDialog],

  data() {
    return {
      loading: true,
      property_id: '',
      property_type: 0,
      verify_type: VERIFY_TYPE_VAR.FILE_VERIFY,
      VERIFY_TYPE_VAR,
      VERIFY_TYPE: [
        {
          label: '文件认证',
          value: VERIFY_TYPE_VAR.FILE_VERIFY,
          disabled: false
        },
        {
          label: 'TXT记录认证',
          value: VERIFY_TYPE_VAR.TXT_VERIFY,
          disabled: false
        },
        {
          label: '授权书认证',
          value: VERIFY_TYPE_VAR.WORLD,
          disabled: false
        }
      ],
      info: {}
    }
  },

  computed: {
    submitText() {
      return this.verify_type === VERIFY_TYPE_VAR.WORLD ? '确认' : '立即认证'
    }
  },

  watch: {
    verify_type(val) {
      this.init()
    }
  },

  methods: {
    async init() {
      this.loading = true
      const params = {
        property_id: this.property_id,
        verify_type: this.verify_type
      }
      const data = await this.Fetch.post('V4/smgc.property.get.token', params)
      this.info = data
      this.loading = false
    },

    beforeOpen(form) {
      const { property_type } = form
      this.verify_type = VERIFY_TYPE_VAR.FILE_VERIFY
      if (property_type === 1) {
        this.VERIFY_TYPE.find(_ => _.value === VERIFY_TYPE_VAR.TXT_VERIFY).disabled = true
      } else {
        this.VERIFY_TYPE.find(_ => _.value === VERIFY_TYPE_VAR.TXT_VERIFY).disabled = false
      }
      this.property_id = form.id
      this.init()
    },

    async fetchSubmit() {
      if (this.verify_type === VERIFY_TYPE_VAR.WORLD) return
      await this.Fetch.post('V4/smgc.property.verify', {
        property_id: this.property_id,
        verify_type: this.verify_type
      })
    },

    async handleSubmit() {
      this.$message.success('认证成功')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
