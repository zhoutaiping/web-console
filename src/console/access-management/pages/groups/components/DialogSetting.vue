<style lang="scss" scoped>
.item-box {
  margin-bottom: 5px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="850px"
    title="权限配置"
    aside
    @close="$emit('init')"
    @submit="handleSubmit"
  >
    <DmAlert>
      子账号添加的对象默认自动绑定到该子账号下，子账号所在组织和所有上级组织默认获取新增对象的操作权限
    </DmAlert>
    <el-form>
      <el-divider class="item-box" />
      <el-form-item class="item-box">
        <TransferMany
          ref="TransferMany"
          :disabled="resource_all === 1"
          :out-label="'组外对象'"
          :in-label="'组内对象'"
          :size="1000"
          :fetch-custom-to-in="val => fetchCustomMove(val)"
          :fetch-to-in="val => fetchActionMove(val, 'add')"
          :fetch-to-out="val => fetchActionMove(val, 'del')"
          :fetch-in-list="val => fetchLoadList(val, 'in')"
          :fetch-out-list="val => fetchLoadList(val, 'out')"
          :is_custom="is_custom"
          class="margin-top"
        />
      </el-form-item>
    </el-form>

  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import accessMixins from '../../../mixins/access'
import TransferMany from '@/components/Transfer/TransferMany'
export default createDialog({
  components: { TransferMany },
  mixins: [accessMixins],
  data() {
    return {
      mode: '',
      subuser_group_id: '',
      list: [],
      formDefault: {},
      loading: true,
      type: '',
      resource_all: 0,
      resource_subuser_new: 0,
      form: {},
      is_custom: false
    }
  },

  methods: {
    initOptions(form) {
      this.subuser_group_id = form.subuser_group_id
      this.type = form.flag || ''
      this.is_custom = form.flag === 'cdn_domain' || false
      this.resource_all = 0
      this.resource_subuser_new = 0
      this.form = {
        subuser_group_id: form.subuser_group_id,
        resource_policy: {
          [form.flag]: {
            resource_all: 0,
            resource_subuser_new: 0
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.TransferMany.init()
        this.getPolicy()
      })
    },
    async getPolicy() {
      try {
        const data = await this.Fetch.get('/V4/subacl.user.group.get.resource.policy', {
          subuser_group_id: this.subuser_group_id
        })
        this.form.resource_policy[this.type] = data.resource_policy[this.type] || {
          resource_all: 0,
          resource_subuser_new: 0
        }
        this.resource_all = data.resource_policy[this.type].resource_all || 0
        this.resource_subuser_new = data.resource_policy[this.type].resource_subuser_new || 0
      } catch (error) {
        return
      }
    },

    fetchCustomMove(val) {
      const domains = val.split('\n')
      return this.Fetch.post('/V4/subacl.user.group.resource.bind', {
        subuser_group_id: this.subuser_group_id,
        resource_type: this.type,
        resource_ids: [],
        domains: domains
      })
    },

    async fetchActionMove(resource_ids, action) {
      let api = ''
      if (action === 'add') {
        api = '/V4/subacl.user.group.resource.bind'
      } else if (action === 'del') {
        api = '/V4/subacl.user.group.resource.unbind'
      }

      if (this.type === 'ca' && action === 'add') {
        await this.Fetch.post(api, {
          subuser_group_id: this.subuser_group_id,
          resource_type: this.type,
          resource_ids: resource_ids
        })
      } else {
        return this.Fetch.post(api, {
          subuser_group_id: this.subuser_group_id,
          resource_type: this.type,
          resource_ids: resource_ids
        })
      }
    },

    async fetchLoadList(params, type) {
      const url = '/V4/subacl.user.group.resource'
      const res = await this.Fetch.get(url, {
        subuser_group_id: this.subuser_group_id,
        resource_type: this.type,
        ...params,
        bind_type: type === 'in' ? 'bind' : 'unbind',
        keyword: params.keyword
      })
      const label_map = {
        'cdn_domain': 'domain',
        'ca': 'ca_name',
        'property': 'property_name',
        'service_report': 'report_name',
        'service_report_plan': 'report_name'
      }
      const list = res.list.map(_ => {
        return {
          label: _[label_map[this.type]],
          value: _.id
        }
      })

      return {
        list,
        total: Number(res.total)
      }
    },
    async fetchSubmit() {
      try {
        await this.Fetch.post('/V4/subacl.user.group.update.resource.policy', {
          ...this.form
        })
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
