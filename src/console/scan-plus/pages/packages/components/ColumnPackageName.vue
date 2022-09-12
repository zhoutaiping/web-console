<template>
  <div>
    {{ row.instance_id || '-' }}<br>
    <PopoverInput
      v-model="row.package_name"
      placement="bottomLeft"
      placeholder="套餐名称"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import PopoverInput from '@/components/Popover/PopoverInput'

export default {
  components: { PopoverInput },

  props: {
    row: Object
  },

  methods: {
    async handleSubmit(val) {
      const data = {
        package_id: this.row.id,
        package_name: val
      }
      try {
        await this.Fetch.post('V4/smgc.package.change.name', data)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
    }
  }
}
</script>
