<template>
  <DmDialog
    ref="Dialog"
    :loading="loading"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    :title="`编辑规则（${form.app_name}）`"
    aside
    width="800px"
    @submit="handleSubmit"
    @close="$emit('init')"
  >
    <el-form label-position="top">
      <el-form-item label="认证方式">
        <template v-if="idpList.length">
          <ItemIcon
            v-for="(item, index) in idpList"
            :key="index"
            :src="idpSettings[item.idp_type] && idpSettings[item.idp_type].idp_logo"
            :title="item.idp_name"
            :active="form.allowed_idps.includes(item.idp_uuid)"
            @click="handleClickIdpItem(item.idp_uuid)"
          />
        </template>
        <router-link
          v-else
          :to="{name: 'zero-trust.router.serviceCertification__iam'}"
        >前往添加</router-link>
      </el-form-item>
    </el-form>
    <el-form label-position="left">
      <el-form-item label="如果仅配置了一个，则跳过身份提供者选择">
        <el-switch
          :disabled="form.allowed_idps && form.allowed_idps.length !== 1"
          :active-value="1"
          :inactive-value="0"
          v-model="form.auto_redirect_to_identity"
        />
      </el-form-item>
    </el-form>
    <el-divider content-position="left">配置规则</el-divider>
    <TableRule
      ref="TableRule"
      :fetch-row-submit="fetchRowSubmit"
      :delete-row-submit="deleteRowSubmit"
      :select-rule-key="selectRuleKey"
      :modify-sort="modifySort"
      :available-decision="availableDecision"
      :fetch-data="fetchData"
      :show-logics="form.app_access_mode === APP_ACCESS_MODE.BROWSER ? ['include', 'require', 'exclude'] : ['require']"
      @init="fetchData"
    />
    <template v-if="Number(form.app_type) === 0 && form.app_access_mode === APP_ACCESS_MODE.BROWSER">
      <el-divider content-position="left">跨域（CORS）配置</el-divider>
      <el-form
        label-position="left"
        class="margin-top"
      >
        <el-form-item label="访问控制允许凭证">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="form.cors_allow_credentials"
          />
        </el-form-item>
        <el-form-item label="最大访问控制期限（秒）">
          <el-input-number
            v-model="form.cors_max_age"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <el-form
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="允许受访源站">
          <el-input
            v-if="form.cors_allow_all_origins"
            style="width: 200px;"
            disabled
          />
          <InputMultiple
            v-else
            v-model="form.cors_allowed_origins"
            placeholder="请输入源站"
            style="width: 200px; display: inline-block;"
          />
          <el-checkbox
            v-model="form.cors_allow_all_origins"
            :true-label="1"
            :false-label="0"
            style="margin-left: 12px;"
          >允许所有源站</el-checkbox>
        </el-form-item>
        <el-form-item label="允许请求头">
          <el-input
            v-if="form.cors_allow_all_headers"
            style="width: 200px;"
            disabled
          />
          <InputMultiple
            v-else
            v-model="form.cors_allowed_headers"
            placeholder="请输入请求头"
            style="width: 200px; display: inline-block;"
          />
          <el-checkbox
            v-model="form.cors_allow_all_headers"
            :true-label="1"
            :false-label="0"
            style="margin-left: 12px;"
          >允许所有请求头</el-checkbox>
        </el-form-item>
        <el-form-item label="允许受访方法">
          <el-input
            v-if="form.cors_allow_all_methods"
            style="width: 200px;"
            disabled
          />
          <yd-form-select
            v-else
            v-model="form.cors_allowed_methods"
            :selects="selectMedhos"
            multiple
            placeholder="请选择方法"
            style="width: 200px; display: inline-block;"
          />
          <el-checkbox
            v-model="form.cors_allow_all_methods"
            :true-label="1"
            :false-label="0"
            style="margin-left: 12px;"
          >允许所有方法</el-checkbox>
        </el-form-item>
      </el-form>
      <template v-if="form.app_access_mode === APP_ACCESS_MODE.BROWSER">
        <el-divider content-position="left">Cookie 属性</el-divider>
        <el-form
          label-position="left"
          label-width="140px"
        >
          <el-form-item label="SameSite">
            <yd-form-select
              :selects="selectSameSite"
              v-model="form.same_site"
            />
            <TipsTooltip>
              Cookie 的 SameSite 属性用来限制第三方属性，从而减少安全风险<br >
              Strict：禁止第三方 Cookie<br >
              Lax：除Get请求外，不发送第三方 Cookie<br >
              None：允许第三方 Cookie
            </TipsTooltip>
          </el-form-item>
          <el-form-item label="Http-Only">
            <el-switch v-model="form.http_only" />
            <TipsTooltip>
              可防止任何客户端脚本访问 Cookie，从而降低 XSS 攻击的可能性
            </TipsTooltip>
          </el-form-item>
          <el-form-item label="Binding Cookie">
            <el-switch v-model="form.binding_cookie" />
            <TipsTooltip>
              将浏览器与 Access 令牌相关联，可防止已授权令牌受到破坏，降低会话劫持攻击的可能性
            </TipsTooltip>
          </el-form-item>
        </el-form>
      </template>
    </template>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { arrRemove } from '@/utils/array'
import ItemIcon from '@/components/Item/ItemIcon'
import InputMultiple from '@/components/Input/InputMultiple'
import { arrToSelect } from '@/utils/format'
import { APP_TYPE } from '../../../constants/common'
import TableRule from './TableRule'
import { APP_ACCESS_MODE } from '../../../constants/common'

const MEDHOS = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'CONNECT', 'TRACE', 'PATCH']
export default createDialog({
  components: { ItemIcon, InputMultiple, TableRule },

  props: {
    applicationType: String
  },

  data() {
    return {
      APP_ACCESS_MODE,
      selectMedhos: arrToSelect(MEDHOS),
      idpList: [],
      idpSettings: {},
      loading: true,
      rulefields: {},
      allowed_idps_type: [],
      selectRuleKey: [],
      selectSameSite: [
        {
          label: 'Lax',
          value: 'Lax'
        },
        {
          label: 'Strict',
          value: 'Strict'
        },
        {
          label: 'None',
          value: 'None'
        }
      ],
      formDefault: {
        app_logo: '',
        app_name: '',
        domain: '',
        domain_path: '',
        session_duration: 86400,
        description: '',
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
        same_site: 'Lax',
        http_only: false,
        binding_cookie: false
      }
    }
  },

  computed: {
    availableDecision() {
      if (this.applicationType === 'host') {
        if (this.form.app_access_mode === APP_ACCESS_MODE.BROWSER) {
          return ['deny', 'bypass', 'allow']
        } else {
          return ['deny', 'allow']
        }
      } else {
        return ['deny', 'allow']
      }
    }
  },

  methods: {
    updateSelectRuleKey(allowed_idps_type) {
      const { app_type } = this.form
      const data = this.rulefields

      const commonValue = ['everyone', 'common', 'group_uuid', 'user_groups_self']
      const selectRuleKey = data.filter(_ => {
        if ([APP_TYPE.SAAS, APP_TYPE.PROTOCOL].includes(app_type) && _.value === 'api_tokens') {
          return false
        } else {
          return true
        }
      })

      this.selectRuleKey = selectRuleKey.filter(_ => [...commonValue, ...allowed_idps_type].includes(_.value))
    },

    initOptions(form, options) {
      this.fetchOptions(form)
      this.fetchIdps()
      this.fetchIdpSettings()
      this.$refs.TableRule.setList(form.rule_list)
      this.allowed_idps_type = form.allowed_idps_type
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchIdpSettings() {
      const data = await this.Fetch.get('V4/zero.trust.idp.conf.fields')
      delete data._status
      this.idpSettings = data
    },

    async handleClickIdpItem(value) {
      const form = this.form
      const { allowed_idps = [] } = this.form

      const action = allowed_idps.includes(value) ? 'del' : 'add'
      try {
        await this.Fetch.post('V4/zero.trust.app.save.idp', {
          app_uid: form.app_uid,
          idp_uuid: value,
          action
        })
      } catch (e) {
        return
      }

      if (allowed_idps.includes(value)) {
        arrRemove(allowed_idps, value)
      } else {
        allowed_idps.push(value)
      }

      if (allowed_idps.length !== 1) this.form.auto_redirect_to_identity = 0

      const { allowed_idps_type = [] } = await this.Fetch.post('V4/zero.trust.app.info', {
        app_uid: this.form.app_uid
      })
      this.updateSelectRuleKey(allowed_idps_type)
    },

    async fetchIdps() {
      const data = await this.Fetch.get('V4/zero.trust.idps')
      delete data._status
      this.idpList = data
    },

    async fetchOptions(form) {
      this.loading = true
      const res = await this.Fetch.get('V4/zero.trust.app.rule.conf.fields', { app_id: form.id })
      delete res._status
      this.rulefields = res
      this.updateSelectRuleKey(this.allowed_idps_type)
      this.loading = false
    },

    async deleteRowSubmit(row) {
      await this.Fetch.post('V4/zero.trust.app.rule.del', {
        rule_id: row.id
      })
    },

    async fetchSubmit() {
      const form = this.form

      try {
        if (!form.allowed_idps || !form.allowed_idps.length) {
          this.$message.warning('请选择认证方式')
          throw new Error()
        }
        await this.Fetch.post('V4/zero.trust.app.save', form)
      } catch (e) {
        throw new Error()
      }
    },

    async fetchRowSubmit(row) {
      const form = {
        rule_name: row.rule_name,
        decision: row.decision,
        rule_conf: row.rule_conf,
        app_uid: this.form.app_uid
      }
      if (row.id === 'ADD') {
        await this.Fetch.post('V4/zero.trust.app.rule.add', form)
      } else {
        await this.Fetch.post('V4/zero.trust.app.rule.save', {
          ...form,
          rule_id: row.id
        })
      }
    },

    async modifySort(data) {
      await this.Fetch.post('V4/zero.trust.app.rule.sort', {
        ...data,
        app_uid: this.form.app_uid
      })
    },

    async fetchData() {
      const data = await this.Fetch.post('V4/zero.trust.app.info', {
        app_uid: this.form.app_uid
      })

      return data
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
