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
        selectStatus: SELECT.PROTECTED_MODE
      },
      formDefault: {
        status: 'off'
      }
    }
  },

  methods: {
    setForm() {
      this.form = {
        ...this.formDefault
      }
    },

    getForm() {
      return {
        protected_mode: this.form.status,
        _policy: 2
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
