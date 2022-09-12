<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="750px"
    title-label="分组"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-width="100px"
      label-position="left"
    >
      <el-form-item
        label="分组名称"
        prop="group_name"
      >
        <el-input
          v-model="form.group_name"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          style="width: 280px"
        />
      </el-form-item>
      <TransferMany
        v-if="mode === 'Edit'"
        ref="TransferMany"
        :size="1000"
        :fetch-custom-to-in="val => fetchCustomMove(val)"
        :fetch-to-in="val => fetchActionMove(val, 'add')"
        :fetch-to-out="val => fetchActionMove(val, 'del')"
        :fetch-in-list="val => fetchLoadList(val, 'in')"
        :fetch-out-list="val => fetchLoadList(val, 'out')"
      />
    </el-form>
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
      this.mode = id ? 'Edit' : 'Create'
      this.id = id
      this.$nextTick(() => {
        if (this.mode === 'Edit') this.$refs.TransferMany.init()
      })
    },

    fetchCustomMove(val) {
      const domains = val.split('\n')
      return this.Fetch.post('V4/cloud.dns.domain.group.domain.save', {
        group_id: this.id,
        action: 'add',
        domains
      })
    },

    async fetchActionMove(domain_ids, action) {
      return this.Fetch.post('V4/cloud.dns.domain.group.domain.save', {
        group_id: this.id,
        domain_ids,
        action
      })
    },

    async fetchLoadList(params, type) {
      const url = type === 'in' ? 'V4/cloud.dns.domain.group.domain.list' : 'V4/cloud.dns.domain.group.undistributed.domain.list'
      const res = await this.Fetch.post(url, {
        group_id: this.id,
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

    async fetchSubmit() {
      const form = {
        group_name: this.form.group_name,
        remark: this.form.remark
      }

      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/cloud.dns.domain.group.add', form)
        } else {
          form.group_id = this.id
          await this.Fetch.post(`V4/cloud.dns.domain.group.save`, form)
        }
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
