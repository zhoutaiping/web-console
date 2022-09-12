<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="500px"
    title="添加至分组"
    @submit="handleSubmit"
  >
    <TableGroup v-model="form.group_id" />
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TableGroup from './TableGroup'

export default createDialog({
  components: { TableGroup },

  data() {
    return {
      formDefault: {
        group_id: '',
        member_id: this.$route.params.member_id,
        relation_id: []
      }
    }
  },

  methods: {
    async fetchSubmit() {
      const form = {
        ...this.form,
        relation_id: this.form.relation_id.join(',')
      }
      try {
        await this.Fetch.post('V4/CloudDns.Member.AddGroupRelation', form)
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
