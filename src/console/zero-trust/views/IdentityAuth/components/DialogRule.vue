<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :loading="loading"
    aside
    width="800px"
    title="分组配置"
    @submit="handleSubmit"
  >
    <TableRuleItem
      :select-rule-key="selectRuleKey"
      :data="form"
    />
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TableRuleItem from '../../HostApplications/components/TableRuleItem'

export default createDialog({
  components: { TableRuleItem },

  data() {
    return {
      loading: true,
      selectRuleKey: [],
      formDefault: {
        rule_conf: [{ logic: 'include', data: [] }]
      }
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
        rule_name: this.form.group_name,
        decision: this.form.decision,
        rule_conf: this.form.rule_conf,
        group_uuid: this.form.group_uuid
      }

      if (this.form.rule_id) {
        await this.Fetch.post('V4/zero.trust.app.access.group.rule.save', {
          ...form,
          rule_id: this.form.rule_id
        })
      } else {
        await this.Fetch.post('V4/zero.trust.app.access.group.rule.add', form)
      }
    },

    initOptions(form, options) {
      this.fetchSelectRuleKey(form)
      this.mode = form.id ? 'Edit' : 'Create'
    },

    async fetchSelectRuleKey(form) {
      this.loading = true
      const data = await this.Fetch.get('V4/zero.trust.app.access.group.rule.conf.fields')
      this.selectRuleKey = data
      this.fetchRuleList()
    },

    async fetchRuleList() {
      const res = await this.Fetch.post('V4/zero.trust.app.access.group.info', {
        group_id: this.form.id
      })

      const { rule_list = [] } = res
      if (rule_list.length) {
        this.form.rule_id = rule_list[0].id
        this.form.rule_conf = rule_list[0].rule_conf
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
