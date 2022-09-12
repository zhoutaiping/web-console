<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="550px"
    title="自定义组织域名"
    @submit="handleSubmit"
  >
    <DmAlert>
      注意：更改该域名可能会导致现有的应用程序身份验证流中断，请确保在更改该域名后所有的IDP配置中的回调URL、SaaS应用中的证书信息，均更新为新的登录页域名。
    </DmAlert>
    <el-form
      :model="form"
      label-position="top"
      label-width="130px"
    >
      <el-form-item
        label="组织域名"
        prop="name"
      >
        <template v-if="form.domain_type === 0">
          <el-input
            v-model="form.prefix"
            placeholder="请输入内容"
            style="width: 340px"
          >
            <template slot="append">.{{ form.suffix }}</template>
          </el-input>
        </template>
        <template v-else>
          <yd-form-select
            :selects="selectDomain"
            v-model="form.own_domain"
            style="width: 300px"
            placeholder="请选择域名"
          />
        </template>
        <template v-if="form.ownable === 1">
          <a
            style="margin-left: 10px"
            @click="handleChangeType"
          >
            <template v-if="form.domain_type">
              默认后缀
            </template>
            <template v-else>
              关联自有域名
            </template>
          </a>
          <TipsTooltip>仅支持关联已备案、具备SSL证书、审核通过的子域名，具体请前往 <router-link :to="{name: 'cloud-speed.router.businessList'}">域名列表</router-link> 进行管理。<br>选中后请确保域名始终解析到分配CNAME，且备案和证书有效，否则将影响认证服务。</TipsTooltip>
        </template>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      selectDomain: [],
      formDefault: {
      }
    }
  },

  methods: {
    initOptions(form, options) {
      // this.form.custom_domain = form.auth_domain.replace(`.${form.default_pri_domain}`, '')
      this.mode = form.id ? 'Edit' : 'Create'
      this.fetchDomain()
    },

    handleChangeType() {
      this.form.domain_type = this.form.domain_type === 0 ? 1 : 0
    },

    async fetchSubmit() {
      const form = this.form
      try {
        await this.Fetch.post('V4/zero.trust.member.sso.save.authdomain', {
          ownable: form.ownable,
          domain_type: form.domain_type,
          suffix: form.suffix,
          prefix: form.prefix,
          own_domain: form.own_domain
        })
      } catch (e) {
        throw new Error()
      }
    },

    async fetchDomain() {
      const res = await this.Fetch.get('V4/zero.trust.own.domain.list', {
      })
      this.selectDomain = res.map(_ => {
        return {
          label: _,
          value: _
        }
      })
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
