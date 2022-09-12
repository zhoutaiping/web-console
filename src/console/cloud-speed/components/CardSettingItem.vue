<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="loading"
    :package-level="packageLevel"
    :title="config.title"
  >
    <template slot="tips">
      {{ config.desc }}
    </template>
    <component
      ref="Form"
      :is="name"
    />
  </CardItemForm>
</template>

<script>
import CloudWaf from './Form/CloudWaf'

export default {
  components: {
    CloudWaf
  },

  props: {
    config: Object,
    name: String,
    isInit: Boolean,
    isSupport: Boolean,
    packageLevel: Number
  },

  data() {
    return {
      loading: false,
      key: ''
    }
  },

  watch: {
    isInit(val) {
      this.checkInit()
    }
  },

  created() {
    this.checkInit()
  },

  mounted() {
    this.$nextTick(() => {
      this.initConfig()
    })
  },

  methods: {
    initConfig() {},

    async confirmAction() {
      if (!this.domainInfo.cdntpl_id) return
      return new Promise((resolve, reject) => {
        this.$confirm('此操作将解绑配置模板', '提示', {
          type: 'warning'
        }).then(async() => {
          const form = {
            cdntpl_id: this.domainInfo.cdntpl_id,
            type: 'domain',
            values: [this.domainInfo.id]
          }
          await this.Fetch.post('V4/cdntpl.domain.unbind', form)
          this.$nextTick(() => {
            this.domainFetchInfo('hwws')
          })
          return resolve(true)
        }).catch(() => {
          this.init()
          return reject()
        })
      })
    },

    init() {

    },

    checkInit() {
      if (this.isInit) this.init()
      if (!this.isSupport) this.loaindg = false
    }
  }
}
</script>
