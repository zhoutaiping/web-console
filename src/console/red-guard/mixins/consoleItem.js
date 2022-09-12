import domainMixins from '@/mixins/domain'
import domainSetting from '@/mixins/domainSetting'
import wafMixins from './waf'

export default {
  mixins: [wafMixins, domainMixins, domainSetting],

  props: {
    isInit: Boolean,
    isSupport: Boolean,
    packageLevel: Number
  },

  data() {
    return {
      loading: true
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

  methods: {
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
          this.domainFetchInfo('hwws')
          return resolve(true)
        }).catch(() => {
          this.init()
          return reject()
        })
      })
    },

    checkInit() {
      if (this.isInit) this.init()
      if (!this.isSupport) this.loaindg = false
    },

    init() {}
  }
}
