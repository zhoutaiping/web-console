<template>
  <DmDialog
    ref="Dialog"
    :show-submit="false"
    width="750px"
    title="套餐配置"
    cance-text="确定"
    @close="handleSubmit"
  >
    <el-form
      :model="form"
      label-width="100px"
      label-position="left"
    >
      <TransferMany
        ref="TransferMany"
        :size="1000"
        :is_custom="false"
        :fetch-custom-to-in="val => fetchCustomMove(val)"
        :fetch-to-in="val => fetchActionMove(val, 'add')"
        :fetch-to-out="val => fetchActionMove(val, 'del')"
        :fetch-in-list="val => fetchLoadList(val, 'in')"
        :fetch-out-list="val => fetchLoadList(val, 'out')"
      />
      <!-- <el-transfer v-model="value" :data="data" :titles="['未绑定域名','绑定域名',]"/> -->
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TransferMany from '@/components/Transfer/TransferMany'
export default createDialog({
  components: { TransferMany },
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      plan_id: '',
      data: generateData(),
      value: [1, 4]
    }
  },

  methods: {
    async initOptions(form, options) {
      const { id } = form
      this.plan_id = id
      this.$nextTick(() => {
        this.$refs.TransferMany.init()
      })
    },

    fetchCustomMove(val) {
      const domains = val.split('\n')
      return this.Fetch.post('V4/cloud.dns.domain.bind.package', {
        plan_id: this.plan_id,
        domain_ids: domains
      })
    },

    async fetchActionMove(domain_ids, action) {
      let api = ''
      if (action === 'add') {
        api = 'V4/cloud.dns.domain.bind.package'
      } else if (action === 'del') {
        api = 'V4/cloud.dns.domain.unbind.package'
      }

      return this.Fetch.post(api, {
        plan_id: this.plan_id,
        domain_ids
      })
    },

    async fetchLoadList(params, type) {
      const url = type === 'in' ? 'V4/cloud.dns.package.domain.list' : 'V4/cloud.dns.package.undistributed.domain.list'
      const res = await this.Fetch.post(url, {
        plan_id: this.plan_id,
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
