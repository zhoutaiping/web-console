<template>
  <div />
</template>

<script>
import { addReserved } from '@/utils/form'
import baseMixins from './base'
import SELECT from '../../constant/select'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: SELECT.SWITCH_M2
      },
      formDefault: {
        status: 'off'
      }
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    setForm(form = {}) {
      this.form = {
        ...this.formDefault,
        ...form
      }
    },

    getForm() {
      return {
        ...this.form
      }
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
