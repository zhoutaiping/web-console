<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="750px"
    aside
    title-label="用户"
    @submit="handleSubmit"
  >

    <!--  -->

  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { fetchTree, formatFullValues } from '../utils'

function formatExportGroups(list) {
  return list.map(item => {
    return item.length ? item[item.length - 1] : item[0]
  })
}

export default createDialog({
  data() {
    return {
      id: '',
      treeData: [],
      formDefault: {
        email: '',
        enabled: true,
        groups: null,
        mobile: '',
        name: '',
        remarks: ''
      }

    }
  },

  methods: {
    async initOptions(form, options) {
      const { id } = form
      this.mode = id ? 'Edit' : 'Create'
      this.id = id

      const { list, defaultValue } = await fetchTree()
      if (this.mode === 'Create') {
        if (form.groups === 'root') {
          this.form.groups = [[defaultValue]]
        } else {
          this.form.groups = formatFullValues([form.groups], list)
        }
      } else {
        this.form.groups = formatFullValues(form.groups, list)
      }
      this.treeData = list
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
