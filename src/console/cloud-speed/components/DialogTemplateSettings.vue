<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :title="config.title"
    aside
    width="800px"
  >
    <FormItemAction>
      {{ config.desc | envView }}
      <yd-form-select
        v-if="config.selectStatus && config.selectStatus.length"
        slot="action"
        v-model="form.status"
        :selects="config.selectStatus"
        @change="handleChangeStatus"
      />
    </FormItemAction>
    <component
      ref="Form"
      :is="name"
      @initConfig="initConfig"
      @updateStatus="updateStatus"
    />
  </DmDialog>
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
import BackSourceSni from './Form/BackSourceSni'

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
    BackSourceSni
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
        status: 'off'
      }
    }
  },

  methods: {
    updateStatus(value) {
      this.form.status = value
    },

    initConfig(config) {
      const { selectStatus = [], statusDefault, statusEnv } = config

      this.config.selectStatus = selectStatus
      if (statusDefault && this.form.status === 'off') {
        this.$nextTick(() => {
          this.form.status = statusDefault
          this.handleChangeStatus(statusDefault)
        })
      }

      if (statusEnv && this.form[statusEnv]) {
        const status = this.form[statusEnv]
        this.$nextTick(() => {
          this.form.status = status
          this.handleChangeStatus(status)
        })
      }
    },

    initOptions(form = {}, options = {}) {
      this.config.title = options.title
      this.config.desc = options.desc
      this.key = options.key
      this.name = options.name

      if (options.key === 'cdn_advance_cache' && form.cdn_advance_cache) {
        this.form.status = form.cdn_advance_cache.status || 'off'
      }
      if (options.key === 'web_honeypot' && form.web_honeypot) {
        this.form.status = form.web_honeypot.status || 'off'
      }
      if (options.key === 'resp_headers' && form.resp_headers) {
        this.form.status = form.resp_headers.status || 'off'
      }
      if (options.key === 'customized_req_headers' && form.customized_req_headers) {
        this.form.status = form.customized_req_headers.status || 'off'
      }
      if (options.key === 'back_source_sni' && form.back_source_sni) {
        this.form.status = form.back_source_sni || 'off'
      }
      if (options.key === 'anti_cc' && form.type) {
        this.form.status = this.form.status === 'on' ? this.form.type : 'off'
      }
      this.$nextTick(() => {
        this.$refs.Form.setForm(form)
        this.$refs.Form.initConfig()
      })
    },

    handleChangeStatus(value) {
      this.$refs.Form.setStatus && this.$refs.Form.setStatus(value)
    },

    async fetchSubmit() {
      const form = await this.$refs.Form.getForm()
      this.$emit('submit', this.key, form)
      this.handleClose()
    }
  }
})
</script>
