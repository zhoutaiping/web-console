<style lang="scss">
.ItemIcon {
  cursor: pointer;
  margin-right: 20px;
}
</style>

<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    :title="mode === 'Edit' ? '编辑身份认证源' : '请选择身份认证源'"
    :loading="loadingOptions"
    aside
    width="770px"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="180px"
    >
      <el-form-item
        v-if="!loadingOptions"
        label="供应商名称"
      >
        <template v-if="mode === 'Create'">
          <ItemIcon
            v-for="(item, index) in items"
            :key="index"
            :src="item.idp_logo"
            :title="item.idp_name"
            :active="item.idp_type === form.idp_type"
            :disabled="usedItems.includes(item.idp_type)"
            disabled-title="已添加"
            @click="handleClickItem(item.idp_type)"
          />
        </template>
        <ItemIcon
          v-else
          :src="formSettings[form.idp_type] && formSettings[form.idp_type].idp_logo"
          :title="formSettings[form.idp_type] && formSettings[form.idp_type].idp_name"
        />
      </el-form-item>
      <template v-if="form.idp_type">
        <el-form-item
          label="IDP 名称"
          prop="idp_name"
        >
          {{ formSettings[form.idp_type].idp_name }}
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formSettings[form.idp_type].fields.filter(_ => _.hidden !== true)"
          :key="index"
          :label="item.label"
          :prop="`idp_conf.${item.field}`"
          :rules="item.rules"
        >
          <FormItemPoly
            v-model="form.idp_conf[item.field]"
            :options="item"
          />
        </el-form-item>
        <!-- More Form -->
        <template v-if="formSettings[form.idp_type].visibleMore">
          <el-divider content-position="center">
            <a
              class="margin-bottom"
              type="text"
              @click="visibleMoreForm = !visibleMoreForm"
            >{{ visibleMoreFormText }}</a>
          </el-divider>
          <el-form-item
            v-for="(item, index) in formSettings[form.idp_type].fields.filter(_ => _.hidden === true)"
            v-show="visibleMoreForm"
            :key="index"
            :label="item.label"
            :prop="`idp_conf.${item.field}`"
            :rules="JSON.stringify(item.rules) === '{}' ? null : item.rules"
          >
            <FormItemPoly
              v-model="form.idp_conf[item.field]"
              :options="item"
            />
          </el-form-item>
        </template>
        <!-- 连接器 -->
        <template v-if="['oidc', 'saml', 'access-idp'].includes(form.idp_type)">
          <el-form-item>
            <el-checkbox
              :true-label="1"
              :false-label="0"
              v-model="form.idp_conf.check_connector_flag"
            >绑定连接器后，将通过连接器提供的单向隧道回源到客户网络访问应用</el-checkbox>
          </el-form-item>
          <template v-if="form.idp_conf.check_connector_flag">
            <el-form-item
              label="连接器"
              prop="idp_conf.allowed_connectors"
            >
              <SelectConnector
                v-model="form.idp_conf.allowed_connectors"
                hidden-default
                value-type="connector_uuid"
                style="width: 320px;"
              />
            </el-form-item>
            <el-form-item
              label="域名"
              prop="idp_conf.host"
            >
              <el-input
                v-model="form.idp_conf.host"
                style="width: 320px"
                placeholder="域名"
              />
            </el-form-item>
            <el-form-item
              label="协议"
              prop="idp_conf.proxy_protocol"
            >
              <yd-form-select
                v-model="form.idp_conf.proxy_protocol"
                :selects="selects.proxy_protocol"
                style="width: 320px"
                placeholder="协议"
              />
            </el-form-item>

            <!-- <el-form-item
              label="IP"
              prop="idp_conf.ip"
            >
              <el-input
                v-model="form.idp_conf.ip"
                style="width: 320px"
                placeholder="IP"
              />
            </el-form-item>
            <el-form-item
              label="端口"
              prop="idp_conf.port"
            >
              <el-input
                v-model="form.idp_conf.port"
                style="width: 320px"
                placeholder="端口"
              />
            </el-form-item> -->
            <!-- <el-form-item> -->
            <TableClusters
              v-model="form.idp_conf.clusters"
              style="margin-left: 158px"
            />
          </template>
        </template>
      </template>
    </el-form>
    <div class="margin-top" >
      <template v-if="form.idp_type === 'otp'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>YUNDUN 可以向填写的电子邮件地址/电话号码发送一次性PIN（OTP），作为配置身份提供商（IDP）的替代方法。您可以同时配置OTP和IDP，以允许用户使用自己的身份验证方法。</p>
        </DmAlert>
      </template>
      <template v-if="form.idp_type === 'wechat-work'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1. 打开企业微信客户端，点击工作台，列表中找到【添加第三方应用】（该步骤需要管理员权限，否则将无法操作）</p>
          <p>2. 点击添加第三方应用后，点击“我的企业”模块，进入到企业微信后台管理界面，获取到企业ID，该ID是企业微信下发给每个企业的唯一ID，将企业ID填写到该页面的【Corp ID】栏目</p>
          <p>3. 点击“应用管理”模块，选择“创建应用”，填写基本信息和权限后，点击【创建应用】</p>
          <p>4. 创建应用成功后，进入应用页面，可获取到Agentld和Secret，分别填写到该页面的【Agent ID】和【CorpSecret ID】栏目</p>
          <p>5. 选择“开发者接口-企业微信授权登录”功能，点击【设置授权回调域名】，填写上回调域名，完成接入。（回调域名可在本产品的“服务认证-单点登录”模块中找到，格式为：xxx.yundun-access.com）</p>
        </DmAlert>
      </template>
      <template v-if="form.idp_type === 'weixin'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1. 进入微信开放平台，https://open.weixin.qq.com/，注册微信开放平台，并完成企业认证；</p>
          <p>2. 击“管理中心”选择“网站应用”，点击【创建网站应用】；</p>
          <p>3. 输入相关信息、输入回调域名（回调域名，可在本产品的“服务认证-单点登录”模块中找到，格式为：xxx.yundun-access.com），点击提交审核，等待微信官方完成审核;</p>
          <p>4. 完成审核后，在应用详情内可获取 AppID、AppSecret ，对应appId、appSecret两个字段，填入后完成接入.</p>
        </DmAlert>
      </template>
      <template v-if="form.idp_type === 'dingtalk'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1. 访问钉钉开放平台 <a href="https://open-dev.dingtalk.com/">https://open-dev.dingtalk.com</a>，创建应用，在首页获取企业对应的【CorpID】；</p>
          <p>2. 创建新应用，选择H5应用，选择企业自主开发，进入应用内部可以获取到应用的【AppKey】和【AppSecret】；</p>
          <p>3. 点击权限管理，授权部门为全部员工，开通权限范围：</p>
          <ul>
            <li>a. 个人手机号信息</li>
            <li>b. 通讯录个人信息读权限</li>
            <li>c. 调用SNS API时需要具备的基本权限</li>
            <li>d. 企业员工手机号信息</li>
            <li>e. 邮箱等个人信息</li>
            <li>f. 通讯录部门信息读权限</li>
            <li>g. 维护通讯录的接口访问权限</li>
            <li>h. 成员信息读权限</li>
            <li>i. 通讯录部门成员读权限</li>
            <li>j. 调用企业API基础权限</li>
            <li>k. 调用OpenApp专有API时需要具备的权限</li>
          </ul>
          <p>4. 点击登录与分享，添加【回调域名】（白山云盾运营提供）；</p>
          <p>5. 点击开发管理，修改应用首页地址（白山云盾运营提供），请勿设置服务器出口IP，否则可能导致身份无法获取；</p>
          <p>6. 点击版本管理与发布，选择发布到全部员工。</p>
        </DmAlert>
      </template>
      <template v-if="form.idp_type === 'feishu'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1. 访问飞书开放平台 <a href="https://open.feishu.cn/app">https://open.feishu.cn/app</a>，创建企业自建应用；</p>
          <p>2. 点击凭证与基础信息，获取应用的【App ID】和【App Secret】；</p>
          <p>3. 点击安全设置，添加【重定向URL】（白山云盾运营提供的回调域名）；</p>
          <p>4. 点击权限管理，开通权限范围：</p>
          <ul>
            <li>a. 以应用身份读取通讯录</li>
            <li>b. 获取部门基础信息</li>
            <li>c. 获取部门组织架构信息</li>
            <li>d. 获取用户基本信息</li>
            <li>e. 获取用户组织架构信息</li>
            <li>f. 获取用户性别</li>
            <li>g. 获取用户邮箱信息</li>
            <li>h. 获取用户手机号</li>
            <li>i. 获取用户 user ID</li>
          </ul>
          <p>5. 点击应用功能-网页，启用网页，输入网页配置（白山云盾运营提供）；</p>
          <p>6. 点击版本管理与发布，对该应用发布即可</p>
        </DmAlert>
      </template>
      <template v-if="form.idp_type === 'github'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1. 登录自己Github账号：https://github.com</p>
          <p>2. 点击头像，选择设置选项</p>
          <p>3. 选择Denveloper settings，进入开发者设置</p>
          <p>4. 选择【OAuth Apps】，授权应用界面</p>
          <p>5. 点击【New OAuth Apps】，新建授权应用</p>
          <p>6. 填写相关注册信息，包括：Application name（应用名称）、Homepage URL（应用首页）、Application description（应用描述）、Aauthorization callback URL（回调域名，可在本产品的“服务认证-单点登录”模块中找到，格式为：xxx.yundun-access.com）</p>
          <p>7. 创建完成可获取到Client ID和Client Secret，分别填写到该页面的【Client ID】和【Client Secret】栏目</p>
        </DmAlert>
      </template>
      <template v-if="form.idp_type === 'access-idp'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1.Access协议是YUNDUN应用可信访问产品提供的一种私有化协议，支持使用CAS/LDAP协议对接您的身份认证源；</p>
          <p>2.如果您的IDP在内网：则需要在您的内网环境中部署连接器和IDP Agent，确保部署连接器的服务器可以与外网通信的同时可以访问IDP Agent，同时绑定连接器，填写IDP Agent的回源IP和端口；</p>
          <p>3.如果您的IDP在公网：则需要在您的公网环境中部署IDP Agent，这里的IDP域名则需要您自己绑定一个域名，确保该域名可以重定向至您的IDP Agent即可；</p>
        </DmAlert>
      </template>
      <template v-if="form.idp_type === 'yun_ad'">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1. 您可以启用白山云AD管理企业的组织架构、用户及用户组作为配置身份提供商（IDP）的替代方法，以允许用户使用自己的身份验证方法。</p>
          <p>2. 云AD内至少需要有一个有效用户才可正常使用。</p>
        </DmAlert>
      </template>
      <template v-if="['azure'].includes(form.idp_type)">
        <DmAlert>
          <strong>集成指导</strong>
          <p>1. 在Microsoft Azure portal创建应用：<a target="blank" href="https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app">https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app</a></p>
          <p>1.1 Supported account types请选择Any Azure AD directory - Multitenant（其他组织账号也可使用此应用）或 Single tenant（只有自己组织的成员可使用此应用）</p>
          <p>1.2 Redirect URI 由白山云盾运营提供</p>
          <p>1.3 创建完毕后记录【Application（client）ID】和【Directory（tenant）ID】</p>
          <p>2. 创建Client Secret：<a target="blank" href="https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-credentials-to-your-web-application">https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-credentials-to-your-web-application</a></p>
          <p>2.1 记录密钥的【Value】</p>
          <p>3. 给API添加权限：<a target="blank" href="https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-permissions-to-access-web-apis">https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-permissions-to-access-web-apis</a></p>
          <p>确保有以下权限：</p>
          <p>Users > User.Read: 当前登录用户能够读取到自己的用户资料。</p>
          <p>Directory > Directory.Read.All: 当前登录用户能够读取用户目录的相关数据。</p>
          <p>4. 在白山云盾控制台填写身份源配置</p>
          <p>将【Application（client）ID】填入【Client ID】，【Value】填入【Client Secret】，【Directory（tenant）ID】填入【Tenant ID】</p>
        </DmAlert>
      </template>
    </div>
    <template v-if="['yun_ad', 'saml', 'access-idp', 'oidc'].includes(form.idp_type)">
      <el-divider content-position="left">多因素身份认证设置</el-divider>
      <el-form
        style="margin-bottom: 100px"
        label-position="right"
        label-width="180px"
      >
        <el-form-item label="二次认证">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="form.idp_conf.twice_auth_status"
            @change="handleChangeTwiceAuthStatus"
          />
          <TipsTooltip style="margin-top: 3px">
            您可开启二次认证使用多因素验证身份（MFA），提高应用访问安全性。
          </TipsTooltip>
        </el-form-item>
        <el-form-item
          v-if="form.idp_conf && form.idp_conf.twice_auth_status"
          label="认证方式"
        >
          <yd-form-select
            v-model="form.idp_conf.twice_auth_mode"
            :selects="selects.twice_auth_mode"
            style="width: 160px; margin-right: 10px"
          />
          <yd-form-select
            v-model="form.idp_conf.twice_auth_source"
            :selects="selects.twice_auth_source"
            style="width: 160px"
          />
          <TipsTooltip
            v-if="['saml', 'access-idp', 'oidc'].includes(form.idp_type)"
            style="margin-top: 3px"
          >
            请确保能让系统读取到对应的身份信息，否则此认证方式不生效。
          </TipsTooltip>
        </el-form-item>
      </el-form>
    </template>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import ItemIcon from '@/components/Item/ItemIcon'
import FormItemPoly from '@/components/FormItem/FormItemPoly'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import { deepClone } from '@/utils'
import TableClusters from '../../../../components/TableClusters'
import SelectConnector from '../../../../components/SelectConnector'

function formatformSettings(list) {
  const formDefault = {}
  const fields = []
  let visibleMore = false

  list.forEach(item => {
    if (typeof item === 'string') {
      fields.push({
        placeholder: item,
        label: item,
        field: item
      })
    } else {
      if (item.hidden === true) visibleMore = true
      fields.push({
        ...item,
        placeholder: item.placeholder || item.field,
        label: item.label || item.field
      })
      if (item.defaultValue) {
        formDefault[item.field] = item.defaultValue
      }
    }
  })

  return {
    formDefault,
    fields,
    visibleMore
  }
}

export default createDialog({
  components: { ItemIcon, TipsTooltip, FormItemPoly, SelectConnector, TableClusters },

  data() {
    return {
      visibleMoreForm: false,
      loadingOptions: true,
      items: [],
      usedItems: [],
      formSettings: [],
      formDefault: {
        idp_type: '',
        idp_conf: {
          twice_auth_status: 0,
          twice_auth_mode: 'send_code',
          twice_auth_source: 'email',
          clusters: []
        }
      },
      selects: {
        twice_auth_mode: [
          {
            label: '验证码',
            value: 'send_code'
          }
        ],
        twice_auth_source: [
          {
            label: '邮件',
            value: 'email'
          },
          {
            label: '短信',
            value: 'mobile'
          }
        ],
        proxy_protocol: [
          {
            label: 'HTTPS',
            value: 'https'
          },
          {
            label: 'HTTP',
            value: 'http'
          }
        ]
      },
      formRules: {
        'idp_conf.allowed_connectors': {
          required: true,
          message: '请选择',
          trigger: 'blur'
        },
        'idp_conf.ip': {
          required: true,
          message: '请填写',
          trigger: 'blur'
        },
        'idp_conf.port': {
          required: true,
          message: '请填写',
          trigger: 'blur'
        }
      }
    }
  },

  computed: {
    visibleMoreFormText() {
      return this.visibleMoreForm ? '隐藏高级配置' : '显示高级配置'
    }
  },

  methods: {
    handleChangeTwiceAuthStatus(status) {
      if (status === 1) {
        this.form.idp_conf.twice_auth_mode = 'send_code'
        this.form.idp_conf.twice_auth_source = 'email'
      }
    },

    handleClickItem(idp_type) {
      this.form.idp_type = idp_type
      if (this.mode === 'Create') {
        this.form.idp_conf = {
          ...this.formSettings[idp_type].formDefault,
          check_connector_flag: 0,
          allowed_connectors: '',
          ip: '',
          port: '',
          host: '',
          clusters: [{
            ip: '',
            port: ''
          }]
        }
      }
    },

    initOptions(form, options) {
      this.visibleMoreForm = false
      this.$refs.Form.clearValidate()
      this.fetchOptions()
      this.mode = form.id ? 'Edit' : 'Create'
      if (this.mode === 'Edit') {
        if (form.idp_conf.allowed_connectors && form.idp_conf.allowed_connectors.length) {
          form.idp_conf.allowed_connectors = form.idp_conf.allowed_connectors[0]

          if (!form.idp_conf.clusters || !form.idp_conf.clusters.length) {
            form.idp_conf.clusters = [
              {
                ip: '',
                port: ''
              }
            ]
          }
        }
      }
      if (form.idp_type) this.handleClickItem(form.idp_type)
    },

    async fetchUsedItems() {
      const data = await this.Fetch.get('V4/zero.trust.idps')
      delete data._status
      this.usedItems = data.map(_ => _.idp_type)
    },

    async fetchOptions() {
      this.loadingOptions = true
      this.fetchUsedItems()
      const data = await this.Fetch.get('V4/zero.trust.idp.conf.fields')
      delete data._status

      const formSettings = {}
      const items = []
      this.items = data
      Object.keys(data).forEach(name => {
        const item = data[name]
        items.push({
          idp_type: name,
          ...item
        })
        formSettings[name] = {
          ...item,
          ...formatformSettings(item.fields)
        }
      })

      this.loadingOptions = false
      this.formSettings = formSettings
      this.items = items
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = {
        ...deepClone(this.form),
        idp_name: this.formSettings[this.form.idp_type].idp_name
      }

      if (form.idp_conf.allowed_connectors) {
        form.idp_conf.allowed_connectors = [form.idp_conf.allowed_connectors]
      }
      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/zero.trust.idp.add', form)
        } else {
          form.idp_id = form.id
          await this.Fetch.post('V4/zero.trust.idp.save', form)
        }
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
