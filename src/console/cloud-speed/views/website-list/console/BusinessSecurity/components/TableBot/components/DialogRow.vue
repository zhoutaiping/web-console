<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title="编辑处置方式"
    @submit="handleSubmit"
  >
    <!-- {{ mode }} -->
    <!-- {{ form }} -->
    <FormAction
      ref="FormAction"
      type="bot"
    />
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import FormAction from '@/console/red-guard/components/TableWAF/components/FormAction'
import wafMixins from '@/console/red-guard/mixins/waf'

export default createDialog({
  components: { FormAction },

  mixins: [wafMixins],

  data() {
    return {
      mode: '',
      templateForm: {
        rules: [
          {

          }
        ]
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.$refs.FormAction.setForm({
        action: form.action,
        action_data: form.action_data
      })
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      const form = this.form
      const formAction = await this.$refs.FormAction.getForm()

      const data = {
        group_id: this.wafGroupIds.bot,
        domain_id: form.domain_id || this.$route.params.id,
        type: 'plus',
        ...formAction
      }
      if (this.mode === 'Create') {
        data.rules = [{ 'rule_type': 'ip_type', 'logic': 'equals', 'data': [`${form.bot_key}`] }]
      } else {
        data.id = form.id
        data.rules = form.rules
      }

      try {
        await this.Fetch.post(`V4/firewall.policy.save`, data)
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
