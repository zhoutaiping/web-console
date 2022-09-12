<template>
  <yd-card
    horizontal
    title="自定义 HTTP 回源请求头"
  >
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
    <template slot="tips">支持您自定义节点至源站的 HTTP 请求头中的 header 信息</template>
    <TableSourceHeader
      :fetch-list="fetchList"
      :fetch-save="fetchSave"
      :fetch-delete="fetchDelete"
    />
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import panelMixins from '../panelMixins'
import TableSourceHeader from '@/components/Table/TableSourceHeader'

export default {
  components: { SelectSwitch, TableSourceHeader },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'customized_req_headers',
      loading: true,
      formDefault: {
        status: 'off'
      }
    }
  },

  methods: {
    async fetchList() {
      const data = await this.Fetch.get('V4/web.domain.set.get.rule', {
        domain_id: this.domainId,
        group: this.SETTING_ID
      })
      const { list = [] } = data[this.SETTING_ID]
      return list
    },

    async fetchSave(row) {
      await this.confirmAction()
      const { type, content, remark, id } = row
      await this.Fetch.post('V4/web.domain.set.save.rule', {
        domain_id: this.domainId,
        group: {
          [this.SETTING_ID]: {
            type,
            content,
            remark,
            id
          }
        }
      })
    },

    async fetchDelete(row) {
      await this.confirmAction()
      const { id } = row
      await this.Fetch.delete('V4/web.domain.set.del.rule', {
        domain_id: this.domainId,
        group: {
          [this.SETTING_ID]: {
            id
          }
        }
      })
    }
  }
}
</script>
