<template>
  <span>
    <yd-form-select
      v-model="val"
      :selects="selectConnector"
      :default-value="0"
      :default-text="hiddenDefault ? '' : '不使用'"
      style="width: 160px; display: inline-block; margin-right: 12px"
      @change="handleChange"
    />
    <template v-if="currentItem && currentItem.dns && visibleForm">
      <span>
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.resolve_by_inner_dns"
        >启用内部DNS：{{ currentItem.dns }}</el-checkbox>
      </span>
    </template>
  </span>
</template>

<script>

export default {
  props: {
    value: [String, Number],
    visibleForm: Boolean,
    resolveDns: Boolean,
    valueType: {
      type: String,
      default: 'connector_id'
    },
    hiddenDefault: Boolean
  },

  data() {
    return {
      form: {
        resolve_by_inner_dns: 1
      },
      val: this.value,
      selectConnector: []
    }
  },

  computed: {
    currentItem() {
      return this.selectConnector.find(_ => _.value === this.val)
    }
  },

  watch: {
    value(value) {
      this.val = value
    },
    valueType() {
      this.fetchConnector()
    }
  },

  created() {
    this.fetchConnector()
  },

  methods: {
    handleChange(val) {
      const item = this.selectConnector.find(_ => _.value === val)
      this.form.resolve_by_inner_dns = item?.dns ? 1 : 0 // && item.dns.length
      this.$emit('input', val)
    },

    setForm(form) {
      Object.assign(this.form, form)
    },

    getForm() {
      return this.form
    },

    async fetchConnector() {
      const res = await this.Fetch.get('V4/zero.trust.connector.all')
      this.selectConnector = res.list.map(_ => {
        return {
          label: _.connector_name,
          value: _[this.valueType],
          dns: _.dns
        }
      })
    }
  }
}
</script>
