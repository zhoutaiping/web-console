<template>
  <div />
</template>

<script>
import { addReserved } from '@/utils/form'
import baseMixins from './base'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: [
          {
            value: 0,
            label: '回源',
            disabled: false
          },
          {
            value: 1,
            label: 'Web安全加速网络',
            disabled: false
          },
          {
            value: 2,
            label: 'TCP安全加速网络',
            disabled: false
          }
        ]
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
        protected_status: this.form.status
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
