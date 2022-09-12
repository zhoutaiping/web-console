<style lang="scss">
.ItemIcon {
  cursor: pointer;
  margin-right: 20px;
}
.ProtocolApplication__DialogRow {
  .el-form {
    padding: 10px;
  }

  .el-divider__text {
    font-weight: 600;
    padding-left: 0px;
    padding-right: 45px;

    &.is-left {
      left: 0px;
      transform: translateY(-50%);
    }
  }
}
</style>

<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    :title="mode === 'Create' ? '创建协议应用' : `编辑协议应用（${form.app_name}）`"
    class="ProtocolApplication__DialogRow"
    width="680px"
    aside
    @submit="handleSubmit"
  >
    <DmAlert>请保证您填写信息的准确性，若添加后有修改相关应用信息，请同步更新为最新信息，避免使用过程中出现错误</DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-position="left"
      label-width="100px"
    >
      <el-divider content-position="left">基本信息</el-divider>
      <el-form-item label="协议类型">
        <yd-form-radio-button
          :radios="OPTIONS.app_protocol"
          v-model="form.app_protocol"
          @change="handleChangeProtocol"
        />
      </el-form-item>
      <el-form-item label="应用图标">
        <InputUploadIcon
          ref="InputUploadIcon"
          v-model="form.app_logo"
          :default-value="logos[form.app_protocol]"
          file-key="zero_trust_app_logo"
        />
      </el-form-item>
      <el-form-item
        label="应用名称"
        prop="app_name"
      >
        <el-input
          v-model="form.app_name"
          placeholder="应用名称"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="主机名"
        prop="host_name"
      >
        <el-input
          v-model="form.host_name"
          placeholder="主机名"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="端口"
        prop="host_port"
      >
        <el-input
          v-model="form.host_port"
          placeholder="端口"
          style="width: 100px"
        />
      </el-form-item>
      <div v-show="form.app_protocol === PROTOCOL_SSH">
        <el-form-item label="登录方式">
          <yd-form-radio
            :radios="OPTIONS.host_login_type"
            v-model="form.host_login_type"
          />
        </el-form-item>
      </div>
      <div v-show="form.host_login_type === USER_LOGIN">
        <el-form-item
          label="用户名"
          prop="host_username"
        >
          <el-input
            v-model="form.host_username"
            placeholder="用户名"
            style="width: 280px"
            auto-complete="new-password"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="host_password"
        >
          <el-input
            v-model="form.host_password"
            placeholder="密码"
            type="password"
            style="width: 280px"
            auto-complete="new-password"
          />
        </el-form-item>
      </div>
      <div v-show="form.host_login_type === PRIVATE_KEY_LOGIN">
        <el-form-item
          label="私钥"
          prop="host_private_key"
        >
          <el-input
            v-model="form.host_private_key"
            type="textarea"
            placeholder="私钥"
            style="width: 280px"
            rows="5"
          />
        </el-form-item>
        <el-form-item
          label="私钥口令"
          prop="host_passphrase"
        >
          <el-input
            v-model="form.host_passphrase"
            placeholder="私钥口令"
            type="password"
            style="width: 280px"
          />
        </el-form-item>
      </div>
      <el-divider content-position="left">其他信息</el-divider>
      <template v-if="form.app_protocol === PROTOCOL_RDP">
        <el-form-item label="安全模式">
          <yd-form-select
            :selects="OPTIONS.rdp_security"
            v-model="form.rdp_security"
          />
        </el-form-item>
        <el-form-item label="忽略证书校验">
          <el-switch v-model="form.rdp_ignore_cert" />
        </el-form-item>
        <el-form-item label="禁用身份验证">
          <el-switch v-model="form.rdp_disable_auth" />
        </el-form-item>
      </template>
      <template v-if="form.app_protocol === PROTOCOL_VNC">
        <el-form-item label="失败重试次数">
          <el-input-number
            v-model="form.vnc_autoretry"
            :min="1"
            :max="10"
            controls-position="right"
          />
        </el-form-item>
      </template>
      <el-form-item label="禁止复制">
        <el-switch v-model="form.disable_copy" />
      </el-form-item>
      <el-form-item label="禁止粘贴">
        <el-switch v-model="form.disable_paste" />
      </el-form-item>
      <!-- <el-divider content-position="left">连接器</el-divider> -->
      <el-form-item label="连接器">
        <SelectConnector
          ref="SelectConnector"
          v-model="form.connector_id"
          visible-form
          style="width: 280px"
        />
        <TipsTooltip>支持启用该域名关联<a href="/console/zero-trust/connector">连接器</a>处设置的内部DNS地址。<br>勾选启用将通过内部DNS解析回源域名，不启用则通过公共DNS解析回源域名</TipsTooltip>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import InputUploadIcon from '@/components/Input/InputUploadIcon'
import SelectConnector from '../../../components/SelectConnector'

const USER_LOGIN = 0
const PRIVATE_KEY_LOGIN = 1
const PROTOCOL_SSH = 'ssh'
const PROTOCOL_RDP = 'rdp'
const PROTOCOL_VNC = 'vnc'

const OPTIONS = {
  app_protocol: [
    {
      label: 'SSH',
      value: PROTOCOL_SSH
    },
    {
      label: 'RDP',
      value: PROTOCOL_RDP
    },
    {
      label: 'VNC',
      value: PROTOCOL_VNC
    }
  ],
  host_login_type: [
    {
      label: '用户名密码登录',
      value: USER_LOGIN
    },
    {
      label: '私钥登录',
      value: PRIVATE_KEY_LOGIN
    }
  ],
  rdp_security: [
    {
      label: 'any',
      value: 'any'
    },
    {
      label: 'nla',
      value: 'nla'
    },
    {
      label: 'nla-ext',
      value: 'nla-ext'
    },
    {
      label: 'tls',
      value: 'tls'
    },
    {
      label: 'vmconnect',
      value: 'vmconnect'
    },
    {
      label: 'rdp',
      value: 'rdp'
    }
  ]
}

export default createDialog({
  components: { InputUploadIcon, SelectConnector },

  data() {
    return {
      USER_LOGIN,
      PRIVATE_KEY_LOGIN,
      PROTOCOL_SSH,
      PROTOCOL_RDP,
      PROTOCOL_VNC,
      OPTIONS,
      formRules: {
        app_name: {
          required: true,
          message: '请填写应用名称',
          trigger: 'blur'
        },
        host_name: {
          required: true,
          message: '请填写主机名称',
          trigger: 'blur'
        },
        host_port: {
          required: true,
          message: '请填写主机端口',
          trigger: 'blur'
        },
        host_username: {},
        host_password: {}
      },
      logos: {
        vnc: 'https://yundunarticle.yundun.com/zerotrust_app_VNC.png',
        ssh: 'https://yundunarticle.yundun.com/zerotrust_app_SSH.png',
        rdp: 'https://yundunarticle.yundun.com/zerotrust_app_RDP.png'
      },
      formDefault: {
        app_type: 1,
        app_protocol: PROTOCOL_SSH,
        app_name: '',
        app_logo: '',
        host_name: '',
        host_port: '',
        host_login_type: USER_LOGIN,
        host_username: '',
        host_password: '',
        host_private_key: '',
        host_passphrase: '',
        rdp_security: 'any',
        rdp_ignore_cert: true,
        rdp_disable_auth: false,
        rdp_auth_domain: '',
        vnc_autoretry: 3,
        disable_copy: false,
        disable_paste: false,
        connector_id: ''
      }
    }
  },

  methods: {
    handleChangeProtocol(value) {
      // if (this.form.host_username) this.form.host_username = ''
      // if (this.form.host_password) this.form.host_password = ''
      this.$nextTick(() => {
        this.$refs.InputUploadIcon.reset()
      })

      if (value === PROTOCOL_SSH) {
        this.formRules.host_username = {}
        this.formRules.host_password = {}
      } else {
        // this.formRules.host_username = {
        //   required: true,
        //   message: '请填写',
        //   trigger: 'blur'
        // }
        // this.formRules.host_password = {
        //   required: true,
        //   message: '请填写',
        //   trigger: 'blur'
        // }
        this.form.host_login_type = USER_LOGIN
      }
    },

    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.mode = form.id ? 'Edit' : 'Create'

      if (this.mode === 'Create') {
        this.$nextTick(() => {
          this.$refs.InputUploadIcon.reset()
        })
      } else {
        this.$refs.SelectConnector.setForm({
          resolve_by_inner_dns: form.resolve_by_inner_dns
        })
      }
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = { ... this.form, ...this.$refs.SelectConnector.getForm() }

      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/zero.trust.app.add', form)
        } else {
          if (form.host_private_key === this.formOld.host_private_key) delete form.host_private_key
          await this.Fetch.post('V4/zero.trust.app.save', form)
        }
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      if (this.mode === 'Create') {
        this.$confirm('您的应用还未配置任何规则，默认情况下YUNDUN-Access会阻止所有人访问该应用，是否立即添加规则？', '提示', {
          confirmButtonText: '添加规则',
          cancelButtonText: '无规则保存',
          type: 'warning'
        }).then(() => {
          this.$emit('open-settings')
        })
      }

      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
