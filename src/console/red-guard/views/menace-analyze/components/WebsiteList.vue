<template>
  <TransferItem
    ref="TransferItem"
    :fetch-data="fetchData"
    v-model="value"
    :size="500"
  />
</template>

<script>
import TransferItem from '@/components/Transfer/TransferItem'

export default {
  components: { TransferItem },

  data() {
    return {
      value: [],
      total: 0,
      bindParams: {}
    }
  },

  watch: {
    childrenVisible() {
      this.$refs.TransferItem.init()
    }
  },

  methods: {
    init(params) {
      this.bindParams = params
      this.$refs.TransferItem.init()
    },

    getValue() {
      return {
        value: this.value,
        total: this.total
      }
    },

    async fetchData(params) {
      const res = await this.Fetch.get('V4/cloudsafe.hwws.domain.list', {
        ...params,
        ...this.bindParams,
        domain: params.keyword
      })

      const list = res.list.map(_ => {
        return {
          label: _.domain,
          value: _.domain
        }
      })
      const total = Number(res.total)
      this.total = total

      return {
        list,
        total
      }
    }
  }
}
</script>
