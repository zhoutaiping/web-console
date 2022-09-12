<template>
  <div>
    <DmDialog
      ref="Dialog"
      :fetch-submit="fetchSubmit"
      :title="config.title"
      aside
      width="800px"
      @submit="handleSubmit"
    >
      <FormItemAction>
        {{ config.desc | envView }}
        <yd-form-select
          v-if="config.selectStatus && config.selectStatus.length"
          slot="action"
          v-model="form._policy"
          :selects="config.selectStatus"
          @change="handleChangeStatus"
        />
      </FormItemAction>
      <component
        ref="Form"
        :is="name"
        style="margin-top: 12px"
        is-batch
        @initConfig="initConfig"
      />
    </DmDialog>
    <DialogConfirm
      ref="dialogConfirm"
      @confirm="handleConfirmSubmit"
      @cancel="formConfirm = null"
    />
  </div>
</template>

<script>
import createDialog from '@/utils/createDialog'
import FormItemAction from '@/components/FormItem/FormItemAction'
import CloudWaf from './Form/CloudWaf/index'
import ContentReplace from './Form/ContentReplace'
import DefenseRefer from './Form/DefenseRefer'
import ZoneLimit from './Form/ZoneLimit'
import WebSnapshot from './Form/WebSnapshot'
import WebHoney from './Form/WebHoney'
import WafIntercept from './Form/WafIntercept'
import DefenseCC from './Form/DefenseCC'
import Bot from './Form/Bot'
import WAF from './Form/WAF'
import SourceSafe from './Form/SourceSafe'
import Source from './Form/Source'
import Slice from './Form/Common'
import WebP from './Form/Common'
import Browser from './Form/Common'
import WebSocket from './Form/Common'
import Mobile from './Form/Mobile'
import Https from './Form/Https'
import Page404 from './Form/Page404'
import Page500 from './Form/Page500'
import Page502 from './Form/Page500'
import HttpHeader from './Form/HttpHeader'
import HttpSourceHeader from './Form/HttpSourceHeader'
import CdnCache from './Form/CdnCache'
import DomainNode from './Form/DomainNode'
import ProtectedMode from './Form/ProtectedMode'
import BackSourceSni from './Form/BackSourceSni'
import DialogConfirm from './DialogConfirm'
import BackSourceHost from './Form/BackSourceHost'
export default createDialog({
  components: {
    FormItemAction,
    CloudWaf,
    ContentReplace,
    DefenseRefer,
    ZoneLimit,
    WebSnapshot,
    WebHoney,
    WafIntercept,
    DefenseCC,
    Bot,
    WAF,
    SourceSafe,
    Source,
    Slice,
    WebP,
    Browser,
    WebSocket,
    Mobile,
    Https,
    Page404,
    Page500,
    Page502,
    HttpHeader,
    HttpSourceHeader,
    CdnCache,
    DomainNode,
    ProtectedMode,
    BackSourceSni,
    BackSourceHost,
    DialogConfirm
  },

  data() {
    return {
      name: '',
      key: '',
      config: {
        title: '',
        desc: '',
        selectStatus: []
      },
      formDefault: {
        _policy: 'keep'
      },
      formBatch: {},
      formConfirm: null
    }
  },

  methods: {
    initConfig(config) {
      this.config.selectStatus = config.selectStatus
    },

    initOptions(form, options) {
      this.config.title = options.title
      this.config.desc = options.desc

      this.key = options.key
      this.name = options.name

      const formBatch = {
        domain_ids: options.domain_ids || [],
        group_id: options.group_id
      }
      this.formBatch = formBatch

      this.$nextTick(() => {
        this.$refs.Form.setForm()
        this.$refs.Form.initConfig({
          ...formBatch,
          domains: options.domains
        })
      })
    },

    handleChangeStatus(value) {
      this.$refs.Form.setStatus && this.$refs.Form.setStatus(value)
    },

    async getForm() {
      if (this.formConfirm) return this.formConfirm
      const form = await this.$refs.Form.getForm()
      const key = this.key

      if (key === 'listen_port') {
        if (form._psource === 'keep') return
      } else {
        if (this.form._policy === 'keep') return
      }

      let updateForm = {
        [key]: {
          ...this.form,
          ...form,
          status: form.status
        }
      }
      if (['web_honeypot', 'safe_snap', 'domain_proxy_conf', 'cdn_advance_cache', 'resp_headers', 'customized_req_headers', 'https'].includes(key)) {
        updateForm = form
      }

      return {
        ...this.formBatch,
        ...updateForm,
        confirm: 0
      }
    },

    async handleConfirmSubmit() {
      try {
        await this.fetchSubmit()
      } catch (e) {
        return
      }
      this.handleSubmit()
    },

    async fetchSubmit() {
      const submitForm = await this.getForm()

      if (!submitForm) {
        this.handleClose()
        return
      }
      if (submitForm.domain_ids.length === 0 && !submitForm.group_id) {
        this.$message.warning('请选择域名或分组')
        throw Error()
      }
      try {
        await this.Fetch.post('V4/Web.Domain.batch.set.update', submitForm)
      } catch (e) {
        if (e.status.code && e.status.code === 100200) {
          this.formConfirm = {
            ...submitForm,
            confirm: 1
          }
          this.$refs.dialogConfirm.handleOpen()
        }
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.handleClose()
    }
  }
})
</script>
