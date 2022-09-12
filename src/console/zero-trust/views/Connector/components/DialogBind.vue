<template>
  <DmDialog
    ref="Dialog"
    :action-visible="false"
    width="800px"
    title="绑定应用"
    @close="$emit('init')"
  >
    <el-form
      :model="form"
      label-width="100px"
      label-position="left"
    >
      <TransferTable
        ref="TransferTable"
        :fetch-to-in="val => fetchActionMove(val, 'bind')"
        :fetch-to-out="val => fetchActionMove(val, 'unbind')"
        :fetch-in-list="val => fetchLoadList(val, 'in')"
        :fetch-out-list="val => fetchLoadList(val, 'out')"
        style="width: 750px"
        in-label="已绑定应用"
        out-label="未绑定应用"
      >
        <template slot="table-column">
          <el-table-column
            prop="app_name"
            label="应用名称"
            min-width="55"
          />
          <el-table-column
            :filters="selectType"
            :filter-method="filterHandler"
            :filter-multiple="false"
            prop="app_type_name"
            label="应用类型"
            min-width="55"
          />
        </template>
      </TransferTable>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TransferTable from '@/components/TransferTable/TransferTable'

export default createDialog({
  components: { TransferTable },

  data() {
    return {
      id: '',
      selectType: [
        {
          text: '自建应用',
          value: 0
        },
        {
          text: '协议应用',
          value: 1
        }
      ]
    }
  },

  methods: {
    filterHandler(value, row) {
      return row['app_type'] === value
    },

    async initOptions(form, options) {
      const { connector_id } = form
      this.id = connector_id

      console.log(connector_id)
      this.$nextTick(() => {
        this.$refs.TransferTable.init()
      })
    },

    async fetchActionMove(list, action) {
      return this.Fetch.post('V4/zero.trust.connector.app.save', {
        connector_id: this.id,
        app_ids: list.map(_ => _.app_id),
        action
      })
    },

    async fetchLoadList(params, type) {
      const url = type === 'in' ? 'V4/zero.trust.connector.app.bind.list' : 'V4/zero.trust.connector.app.unbind.list'
      const res = await this.Fetch.post(url, {
        connector_id: this.id
      })

      return res
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
