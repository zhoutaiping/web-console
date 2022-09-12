// import domainSetting from '@/mixins/domainSetting'
import domainMixins from '@/mixins/domain'

export default {
  mixins: [domainMixins],

  data() {
    return {
      form: {},
      formDefault: {}
    }
  },

  watch: {
    domainSettings: {
      deep: true,
      handler(val) {
        const data = this.domainSettings[this.SETTING_ID] || {}
        this.form = this.formatSettings({
          ...this.formDefault,
          ...data
        })
      }
    }
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

    formatSettings(data) {
      return data
    },

    formatRequest(data) {
      return data
    },

    async fetchUpdate(form = {}, id) {
      await this.confirmAction()
      const data = {
        ...this.form,
        ...form
      }
      const send = this.formatRequest(data)
      try {
        await this.domainSaveSettings({ [id || this.SETTING_ID]: send })
      } catch (e) {
        this.domainFetchSettings(this.SETTING_ID)
        return
      }
      this.domainFetchSettings(this.SETTING_ID)
      this.Message('ACTION_SUCCESS')
    }
  }
}
