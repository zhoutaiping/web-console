<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    width="730px"
    title="绑定至业务"
    @submit="handleSubmit"
  >
    <DmAlert class="margin-top">
      <p>1. 业务绑定模板后，业务配置将不可回滚，请确认您的配置模板和绑定的业务无误</p>
      <p>2. 业务绑定模板后，您若在网站列表-控制台修改防护配置将自动解绑配置模板</p>
    </DmAlert>
    <TransferMany
      ref="TransferMany"
      :size="1000"
      :fetch-custom-to-in="val => handleBind(val, 'custom')"
      :fetch-to-in="handleBind"
      :fetch-to-out="handleUnbind"
      :fetch-in-list="val => fetchInList(val)"
      :fetch-out-list="val => fetchLoadOutList(val)"
      out-label="未绑定"
      in-label="已绑定"
    />
  </DmDialog>
</template>

<script>
import RULE from '@/utils/verify'
import createDialog from '@/utils/createDialog'
import SelectTransfer from '@/components/Select/SelectTransfer'
import TransferMany from '@/components/Transfer/TransferMany'
import selectMixins from '@/mixins/select'
import { deepClone } from '@/utils'

function validateBatch(rule, value, callback) {
  if (!value) callback(new Error('请填写'))
  value = value.split(/[\n\r]/g).filter(_ => _)

  value.forEach(item => {
    if (!RULE.domain.test(item)) {
      callback(new Error('格式错误'))
    }
  })
  callback()
}

export default createDialog({
  components: { SelectTransfer, TransferMany },

  mixins: [selectMixins],

  data() {
    return {
      id: '',
      oldList: [],
      list: [],
      formData: {
        batch: ''
      },
      rules: {
        batch: [
          { validator: validateBatch, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    async fetchInList(params) {
      const res = await this.Fetch.get('V4/web.domain.list.short', {
        ...params,
        domain: params.keyword,
        tpl_id: this.id
      })
      const { list = [] } = res
      return {
        list: list.map(_ => {
          return {
            label: _.domain,
            value: _.id
          }
        }),
        total: Number(res.total)
      }
    },

    async fetchLoadOutList(params) {
      const res = await this.Fetch.get('V4/web.domain.list.short', {
        ...params,
        domain: params.keyword,
        type: 'tpl'
      })

      const list = res.list.map(_ => {
        return {
          label: _.domain,
          value: _.id
        }
      })

      return {
        list,
        total: Number(res.total)
      }
    },

    beforeOpen(form) {
      this.list = deepClone(form.domainsList)
      this.oldList = deepClone(form.domainsList)
      this.id = form.id
      this.formData.batch = ''
    },

    afterOpen() {
      this.$nextTick(() => {
        this.$refs.TransferMany.init()
      })
    },

    handleBatchAdd() {
      const domainsList = this.selectWallDomains.map(_ => _.label)

      this.$refs.Form.validate(valid => {
        if (!valid) return
        const list = this.formData.batch.split(/[\n\r]/g).filter(_ => _)
        list.forEach(item => {
          if (domainsList.includes(item)) this.list.push(item)
        })
        this.formData.batch = ''
      })
    },

    async handleBind(values, type) {
      const form = {
        cdntpl_id: this.id,
        type: 'domain'
      }

      if (type === 'custom') {
        form.domains = values.split('\n')
      } else {
        form.values = values
      }

      try {
        await this.Fetch.post('V4/cdntpl.domain.bind', form)
      } catch (e) {
        throw new Error()
      }
    },

    async handleUnbind(values) {
      const form = {
        cdntpl_id: this.id,
        type: 'domain',
        values
      }
      try {
        await this.Fetch.post('V4/cdntpl.domain.unbind', form)
      } catch (e) {
        throw new Error()
      }
    },

    async fetchSubmit() {
      const bindList = []
      const unbindList = []
      const commonList = []
      this.list.forEach(item => {
        if (this.oldList.includes(item)) {
          commonList.push(item)
        } else {
          bindList.push(item)
        }
      })

      if (commonList.length < this.oldList.length) {
        this.oldList.forEach(item => {
          if (!this.list.includes(item)) unbindList.push(item)
        })
      }

      try {
        if (bindList.length > 0) await this.handleBind(bindList.map(_ => this.selectWallDomainsIdMap[_]))
        if (unbindList.length > 0) await this.handleUnbind(unbindList.map(_ => this.selectWallDomainsIdMap[_]))
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.handleClose()
      this.$emit('init')
    }
  }
})
</script>
