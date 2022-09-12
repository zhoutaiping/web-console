<template>
  <DmDialog
    ref="Dialog"
    width="750px"
    title="配置"
    @submit="handleSubmit"
  >
    <TransferMany
      ref="TransferMany"
      :size="1000"
      :fetch-to-in="val => fetchActionMove(val, 'bind')"
      :fetch-to-out="val => fetchActionMove(val, 'unbind')"
      :fetch-in-list="val => fetchLoadList(val, 'in')"
      :fetch-out-list="val => fetchLoadList(val, 'out')"
      out-label="未绑定"
      in-label="已绑定"
    />
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TransferMany from '@/components/Transfer/TransferMany'

export default createDialog({
  components: { TransferMany },

  data() {
    return {
      id: ''
    }
  },

  methods: {
    async initOptions(form, options) {
      const { id } = form
      this.id = id
      this.$refs.TransferMany.init()
    },

    async fetchActionMove(domain_id, type) {
      return this.Fetch.post(`V4/cloudsafe.hwws.package.${type}.domain`, {
        package_id: this.id,
        domain_id
      })
    },

    async fetchLoadList(params, type) {
      const url = type === 'in' ? 'V4/cloudsafe.hwws.package.bind.domain.list' : 'V4/cloudsafe.hwws.package.canuse.domain.list'
      const res = await this.Fetch.get(url, {
        package_id: this.id,
        ...params,
        domain: params.keyword
      })

      const list = res.list.map(_ => {
        return {
          label: _.domain,
          value: _.domain_id
        }
      })

      return {
        list,
        total: Number(res.total)
      }
    },

    async handleSubmit(form) {
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
