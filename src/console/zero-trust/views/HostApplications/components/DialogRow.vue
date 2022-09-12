<style lang="scss">
.ItemIcon {
  cursor: pointer;
  margin-right: 20px;
}

.selectDomainOption {
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    // pointer-events: none;
  }
}
</style>

<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    :title="mode === 'Create' ? '创建应用' : `编辑应用（${form.app_name}）`"
    width="780px"
    aside
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="上传 Logo">
        <InputUploadIcon
          v-model="form.app_logo"
          :default-value="defaultLogo"
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
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="访问模式">
        <yd-form-select
          :disabled="mode === 'Edit'"
          :selects="selectAccessMode"
          v-model="form.app_access_mode"
        />
      </el-form-item>
      <el-form-item
        v-if="form.app_access_mode === APP_ACCESS_MODE.CLIENT"
        label="应用配置"
        prop="client_access_conf__forwarding_profile"
      >
        <TableForwardingProfile
          ref="TableForwardingProfile"
          v-model="form.client_access_conf__forwarding_profile"
        />
      </el-form-item>
      
      <template v-if="form.app_access_mode === APP_ACCESS_MODE.CLIENT_PROXY">
        <TableClientAccessProxy
          ref="TableClientAccessProxy"
          :list="form.client_access_conf__forwarding_profile__CLIENT_PROXY"
        />
      </template>
      
      <template v-if="form.app_access_mode === APP_ACCESS_MODE.CLIENT_PROXY">
        <TableClientAccessProxyIP
          ref="TableClientAccessProxyIP"
          :value="form.client_access_conf__forwarding_profile__CLIENT_PROXY_IP"
        />
      </template>

      <template v-if="form.app_access_mode === APP_ACCESS_MODE.CLIENT_PROXY">
        <el-button
          style="margin-top: 16px"
          @click="handleRowAdd"
        >+ 域名类应用</el-button>

        <el-button
          style="margin-top: 16px; margin-bottom: 16px"
          @click="handleRowIPAdd"
        >+ IP类应用</el-button>
      </template>
      <el-form-item
        v-if="form.app_access_mode === APP_ACCESS_MODE.BROWSER"
        label="应用域名"
        prop="domain_path"
      >
        <el-select
          v-model="form.domain"
          :disabled="mode === 'Edit'"
          style="width: 200px"
          allow-create
          filterable
          @change="handleChangeDomain"
        >
          <el-option
            v-for="item in selectDomain"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
            <el-tooltip
              :visible-arrow="false"
              :disabled="!item.disabled"
              content="为保障业务数据传输安全性，启用服务前请确认域名服务状态正常，并前往web安全加速进行回源和证书配置"
              effect="light"
              placement="right"
              popper-class="RuleToolTip"
            >
              <a
                :class="item.disabled ? 'disabled' : ''"
                class="selectDomainOption"
                style="color: #606266; text-align: left; display: block"
              >{{ item.label }}</a>
            </el-tooltip>
          </el-option>
        </el-select>
        <el-select
          v-model="form.port"
          placeholder="端口"
          style="width: 80px;margin-left:5px;"
          @change="handleChangePort"
        >
          <el-option
            v-for="item in ports"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
            <el-tooltip
              :visible-arrow="false"
              :disabled="!item.disabled"
              content="为保障业务数据传输安全性，启用服务前域名需设置监听协议为HTTPS"
              effect="light"
              placement="right"
              popper-class="RuleToolTip"
            >
              <a
                :class="item.disabled ? 'disabled' : ''"
                class="selectDomainOption"
                style="color: #606266; text-align: left; display: block"
              >{{ item.label }}</a>
            </el-tooltip>
          </el-option>
        </el-select>
        <span style="display: inline-block; width: 20px; text-align: center;">
          /
        </span>
        <el-input
          v-model="form.domain_path"
          style="width: 180px"
          placeholder="demo"
        />
      </el-form-item>
      <el-form-item
        v-if="form.app_access_mode === APP_ACCESS_MODE.BROWSER"
        label="协议"
        prop="protocol"
      >
        <yd-form-select
          :selects="selectProtocol"
          v-model="form.protocol"
          disabled
        />
        <TipsTooltip v-if="Number(form.protocol) === 0">
          为保障流量传输安全．建议为该域名配置 <a href="/console/cloud-speed/certificateList">SSL证书</a> ，使用HTTPS协议
        </TipsTooltip>
      </el-form-item>
      <el-form-item
        v-if="form.app_access_mode === APP_ACCESS_MODE.BROWSER"
        label="会话过期时长"
        prop="session_duration"
      >
        <yd-form-select
          :selects="selectSessionDuration"
          v-model="form.session_duration"
        />
      </el-form-item>
      <el-form-item
        label="应用简介"
        prop="description"
      >
        <el-input
          :rows="3"
          v-model="form.description"
          style="width: 400px"
          placeholder="应用简介"
          type="textarea"
        />
      </el-form-item>
      <el-form-item v-if="form.app_access_mode === APP_ACCESS_MODE.BROWSER">
        <el-checkbox v-model="form.allow_client_access">允许通过客户端访问</el-checkbox>
        <TipsTooltip>勾选后不需要在浏览器进行身份认证</TipsTooltip>
      </el-form-item>
      <el-form-item
        label="连接器"
        prop="connector_id"
      >
        <SelectConnector
          ref="SelectConnector"
          v-model="form.connector_id"
          :visible-form="form.app_access_mode !== APP_ACCESS_MODE.CLIENT"
          style="width: 400px"
        />
        <TipsTooltip>支持启用该域名关联<a href="/console/zero-trust/connector">连接器</a>处设置的内部DNS地址。<br>勾选启用将通过内部DNS解析回源域名，不启用则通过公共DNS解析回源域名</TipsTooltip>
      </el-form-item>
      <el-form-item
        v-if="form.app_access_mode === APP_ACCESS_MODE.CLIENT"
        label="例外"
        prop="client_access_conf__exceptions"
      >
        <InputMultiple
          v-model="form.client_access_conf__exceptions"
          placeholder="需要排除的域名"
          style="width: 400px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import { deepClone } from '@/utils'
import createDialog from '@/utils/createDialog'
import InputUploadIcon from '@/components/Input/InputUploadIcon'
import RULE from '@/utils/verify'
import SelectConnector from '../../../components/SelectConnector'
import TableForwardingProfile from '../../../components/TableForwardingProfile'
import TableProxyForwardingProfile from '../../../components/TableProxyForwardingProfile'
import { APP_ACCESS_MODE, selectAccessMode } from '../../../constants/common'
import TableClientAccessProxy from './TableClientAccessProxy'
import TableClientAccessProxyIP from '../../../components/TableClientAccessProxyIP'

function validateDomains(rule, value, callback) {
  if (!value) return callback()
  if (typeof value === 'string') {
    value = [value]
  }

  value.forEach(item => {
    if (!RULE.domainWithPan.test(item)) {
      callback(new Error('格式不正确'))
    }
  })
  callback()
}

const defaultLogo = 'https://yundun-statics.yundun.com/164084762961cd590d004a8-png'

export default createDialog({
  components: { InputUploadIcon, SelectConnector, TableForwardingProfile, TableClientAccessProxy, TableProxyForwardingProfile, TableClientAccessProxyIP },

  data() {
    return {
      APP_ACCESS_MODE,
      selectAccessMode,
      domainIdMap: {},
      selectProtocol: [
        {
          label: 'HTTP',
          value: 0
        },
        {
          label: 'HTTPS',
          value: 1
        }
      ],
      selectDomain: [],
      defaultLogo,
      // port: [],
      selectSessionDuration: [
        {
          label: '本次会话有效',
          value: 0
        },
        {
          label: '15分钟',
          value: 900
        },
        {
          label: '30分钟',
          value: 1800
        },
        {
          label: '1小时',
          value: 3600
        },
        {
          label: '6小时',
          value: 3600 * 6
        },
        {
          label: '24小时',
          value: 3600 * 24
        },
        {
          label: '48小时',
          value: 3600 * 48
        },
        {
          label: '72小时',
          value: 3600 * 72
        },
        {
          label: '1周',
          value: 3600 * 24 * 7
        },
        {
          label: '2周',
          value: 3600 * 24 * 14
        },
        {
          label: '3周',
          value: 3600 * 24 * 21
        },
        {
          label: '1月',
          value: 3600 * 24 * 30
        }
      ],
      formRules: {
        app_name: {
          required: true,
          message: '请填写应用名称',
          trigger: 'blur'
        },
        client_access_conf__forwarding_profile: {
          required: true,
          message: '请填写',
          trigger: 'blur'
        },
        client_access_conf__exceptions: { validator: validateDomains, trigger: 'blur' }
      },
      formDefault: {
        app_logo: defaultLogo,
        app_name: '',
        domain: '',
        port: '',
        protocol: null,
        domain_path: '',
        session_duration: 86400,
        description: '',
        allow_client_access: false,
        app_access_mode: 2,
        client_access_conf__forwarding_profile__CLIENT_PROXY: [
          // {
          //   domain: '',
          //   port: '',
          //   back_to_origins: [
          //     {
          //       protocol: 'tcp',
          //       domain_ip: '',
          //       port: ''
          //     }
          //   ],
          //   type: 0
          // }
        ],
        client_access_conf__forwarding_profile__CLIENT_PROXY_IP: [
          // {
          //   domain: '',
          //   port: '',
          //   type: 1
          // }
        ],
        client_access_conf__forwarding_profile: [
          // {
          //   protocol: 'tcp',
          //   domain: '',
          //   port: ''
          // }
        ],
        client_access_conf__exceptions: [],
        // client_access_conf: {
        //   forwarding_profile: [
        //   ],
        //   exceptions: []
        // },
        // 编辑独有
        allowed_idps: [],
        auto_redirect_to_identity: 0,
        cors_allow_credentials: 0,
        cors_max_age: '',
        cors_allowed_origins: [],
        cors_allow_all_origins: 0,
        cors_allowed_headers: [],
        cors_allow_all_headers: 0,
        cors_allowed_methods: [],
        cors_allow_all_methods: 0,
        connector_id: ''
      }
    }
  },
  computed: {
    ports() {
      const domainItem = this.selectDomain.find(item => item.value === this.form.domain)
      return domainItem ? domainItem.ports : []
    }
  },
  methods: {
    getProtocol(domain, port) {
      const ports = this.selectDomain.find(_ => _.value === domain)?.ports || []
      return ports.find(_ => Number(_.value) === Number(port))?.prototype || 0
    },

    initOptions(form, options) {
      this.$refs.Form.clearValidate()
      this.fetchDomain()

      this.mode = form.id ? 'Edit' : 'Create'
      if (this.mode === 'Edit') {
        this.$refs.SelectConnector.setForm({
          resolve_by_inner_dns: form.resolve_by_inner_dns
        })
      }
    },

    handleChangeDomain() {
      this.form.port = this.ports?.[0].value || ''
      this.$nextTick(() => {
        this.handleChangePort()
      })
    },

    handleChangePort() {
      this.form.protocol = this.getProtocol(this.form.domain, this.form.port)
    },

    async fetchDomain() {
      const list = await this.Fetch.get('V4/zero.trust.app.usable.domain.list')
      delete list._status
      const selectDomain = list.map(_ => {
        const ports = []
        Object.keys(_.port_to_protocol).forEach(port => {
          const prototype = Number(_.port_to_protocol[port])
          ports.push({
            label: port,
            value: port,
            prototype
          })
        })

        return {
          label: _.domain_name,
          value: _.domain_name,
          disabled: _.disabled,
          ports
        }
      })

      const domainIdMap = {}
      list.forEach(item => {
        domainIdMap[item.domain_name] = item.domain_id
      })
      this.domainIdMap = domainIdMap
      this.selectDomain = selectDomain
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = deepClone({ ...this.form, ...this.$refs.SelectConnector.getForm() })

      form.client_access_conf = {
        forwarding_profile: form.client_access_conf__forwarding_profile,
        exceptions: form.client_access_conf__exceptions
      }

      if (form.app_access_mode === APP_ACCESS_MODE.CLIENT_PROXY) {
        form.client_access_conf = {
          proxy_forwarding_profile: [...form.client_access_conf__forwarding_profile__CLIENT_PROXY, ...form.client_access_conf__forwarding_profile__CLIENT_PROXY_IP],
        }
      }

      delete form.client_access_conf__forwarding_profile
      delete form.client_access_conf__exceptions
      delete form.client_access_conf__forwarding_profile__CLIENT_PROXY
      delete form.client_access_conf__forwarding_profile__CLIENT_PROXY_IP
      // delete form.client_access_conf__proxy_forwarding_profile__back_to_origins
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/zero.trust.app.add', {
            ...form,
            domain_id: this.domainIdMap[form.domain]
          })
        } else {
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
    },

    handleRowAdd() {
      this.$refs.TableClientAccessProxy.handleRowAdd()
    },

    handleRowIPAdd() {
      this.$refs.TableClientAccessProxyIP.handleAdd()
    }
  }
})
</script>
