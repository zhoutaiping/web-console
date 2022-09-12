<template>
  <div :class="b()">
    {{ row.instance_id || '-' }}<br>
    <PopoverInput
      v-model="row.plan_diy_name"
      placement="bottomLeft"
      placeholder="套餐名称"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import PopoverInput from '@/components/Popover/PopoverInput'

export default create({
  name: 'ColumnPackageName',

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
        await this.Fetch.put('V4/cloudsafe.hwws.package.update', data)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
    }
  }
})
</script>
