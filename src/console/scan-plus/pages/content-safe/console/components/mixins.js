export default {
  data() {
    return {
      id: this.$route.params.id,
      form: {}
    }
  },

  methods: {
    async handleUpdate(form = {}) {
      await this.Fetch.post('V4/content.safe.monitor.feature', {
        ...this.form,
        ...form,
        uuid: this.id
      })
      this.$emit('init')
      this.Message('ACTION_SUCCESS')
    }
  }
}
