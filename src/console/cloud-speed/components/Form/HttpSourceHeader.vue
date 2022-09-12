<template>
  <div>
    <div v-show="form.status === 'on'">
      <yd-form-radio-button
        v-if="isBatch"
        :radios="SELECT.EDIT_TYPE_M2"
        v-model="formBatch._policy"
        style="margin-bottom: 12px"
      />
      <TableSourceHeader ref="TableSourceHeader"/>
    </div>
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import TableSourceHeader from '@/components/Table/TableSourceHeader'
import baseMixins from './base'
import SELECT from '../../constant/select'

export default {
  components: { TableSourceHeader },

  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: SELECT.SWITCH_M2
      },
      formDefault: {
        status: 'off'
      },
      formBatch: {
        _policy: 'append'
      }
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    setForm(form = {}) {
      const { customized_req_headers = {}, customized_req_headers_rules = [] } = form
      this.$nextTick(() => {
        this.$refs.TableSourceHeader.setList(customized_req_headers_rules)
      })

      this.form = {
        ...this.formDefault,
        ...customized_req_headers
      }
    },

    getForm() {
      const form = this.form
      const customized_req_headers_rules = this.$refs.TableSourceHeader.getList()

      const formData = {
        customized_req_headers: {
          ...form,
          _policy: form.status
        }
      }

      if (this.isBatch) {
        formData.customized_req_headers_rules = {
          rules: customized_req_headers_rules,
          _policy: this.formBatch._policy
        }
      } else {
        formData.customized_req_headers_rules = customized_req_headers_rules
      }

      return formData
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
