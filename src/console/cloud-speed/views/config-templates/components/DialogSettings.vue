<style lang="scss">
.DialogSettings {
  .yd-card {
    padding: 16px 0px;
  }
}
</style>

<template>
  <DmDialog
    ref="Dialog"
    :title="configItem[type].title"
    aside
    width="900px"
    class="DialogSettings"
    @submit="handleSubmit"
  >
    <component
      v-if="type"
      ref="Form"
      :is="type"
    />
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { deepClone } from '@/utils'
import CloudWAF from './components/CloudWAF'
import DefenseCC from './components/DefenseCC'
import WafIntercept from './components/WafIntercept'
import WebHoney from './components/WebHoney'
import ContentReplace from './components/ContentReplace'
import DefenseRefer from './components/DefenseRefer'
import ZoneLimit from './components/ZoneLimit'
import WebSnapshot from './components/WebSnapshot'
import WAF from './components/WAF'
// import configItem from '../../../constants/config-item'

export default createDialog({
  components: { CloudWAF, DefenseCC, WafIntercept, WebHoney, ContentReplace, DefenseRefer, ZoneLimit, WebSnapshot, WAF },

  data() {
    return {
      // configItem,
      type: 'CloudWAF'
    }
  },

  methods: {
    beforeOpen(form) {
      this.type = form._type
    },

    afterOpen(form) {
      let data = form[configItem[this.type].apiKey] || {}
      if (this.type === 'WebHoney') {
        data = {
          web_honeypot: form.web_honeypot,
          web_honeypot_rules: form.web_honeypot_rules
        }
      }

      this.$nextTick(() => {
        this.$refs.Form.setForm(deepClone(data))
      })
    },

    async handleSubmit() {
      let form
      try {
        form = await this.$refs.Form.getForm()
      } catch (e) {
        this.$refs.Dialog.resetSubmitLoading()
        return
      }
      this.$emit('submit', configItem[this.type].apiKey, form)
      this.handleClose()
    }
  }
})
</script>
