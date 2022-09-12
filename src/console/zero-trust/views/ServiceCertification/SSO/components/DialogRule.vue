<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :loading="loading"
    aside
    width="800px"
    title="编辑规则"
    @submit="handleSubmit"
  >
    <TableRuleItem
      :select-rule-key="selectRuleKey"
      :data="form"
    />
    <el-divider />
    <el-form>
      <el-form-item label="会话过期时长">
        <yd-form-select
          :selects="selectSessionDuration"
          v-model="form.session_duration"
        />
      </el-form-item>
    </el-form>
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
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TableRuleItem from '../../../HostApplications/components/TableRuleItem'

export default createDialog({
  components: { TableRuleItem },

  data() {
    return {
      loading: true,
      selectRuleKey: [],
      formDefault: {
        rule_conf: [{ logic: 'include', data: [] }],
        session_duration: 300,
        same_site: 'Lax',
        http_only: false,
        binding_cookie: false
      },
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
      selectSessionDuration: [
        {
          label: '5分钟',
          value: 300
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
      ]
    }
  },

  methods: {
    handleAddRuleByLogic(logic, list) {
      list.push({
        logic,
        data: []
      })
    },

    async fetchSubmit() {
      const form = {
        app_uid: this.form.app_uid,
        rule_name: this.form.rule_name,
        decision: this.form.decision,
        rule_conf: this.form.rule_conf
      }
      if (this.form.rule_id) {
        await this.Fetch.post('V4/zero.trust.app.rule.save', {
          ...form,
          rule_id: this.form.rule_id
        })
      } else {
        await this.Fetch.post('V4/zero.trust.app.rule.add', form)
      }

      await this.Fetch.post('V4/zero.trust.portal.settings.save', {
        id: this.form.app_uid,
        same_site: this.form.same_site,
        http_only: this.form.http_only,
        binding_cookie: this.form.binding_cookie,
        session_duration: this.form.session_duration
      })
    },

    initOptions(form, options) {
      this.fetchSelectRuleKey(form)
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSelectRuleKey(form) {
      this.loading = true
      const res = await this.Fetch.get('V4/zero.trust.portal.rule.conf.fields')
      this.form.app_uid = res.app_uid
      this.form.rule_name = res.rule_name
      this.form.decision = res.decision
      this.form.session_duration = res.session_duration
      this.form.same_site = res.same_site
      this.form.http_only = res.http_only
      this.form.binding_cookie = res.binding_cookie

      // const selectRuleKey = []
      // Object.keys(res.fields).forEach(key => {
      //   selectRuleKey.push(...res.fields[key])
      // })
      // Object.keys(res.fields).forEach(key => {
      // selectRuleKey.push(...res.fields)
      // })
      this.selectRuleKey = res.fields // selectRuleKey
      this.fetchRuleList(res.app_uid)
    },

    async fetchRuleList(app_uid) {
      const res = await this.Fetch.get('V4/zero.trust.app.rule.list', { app_uid })

      if (res && res[0] && res[0].rule_conf) {
        this.form.rule_id = res[0].id
        this.form.rule_conf = res[0].rule_conf
      }
      this.loading = false
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
