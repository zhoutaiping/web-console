<template>
  <div :class="b()">
    <PopoverInput
      v-model="row.property_name"
      placement="bottomLeft"
      placeholder="资产名称"
      @submit="handleSubmit"
    />
    {{ row.property_object || '-' }}
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import PopoverInput from '@/components/Popover/PopoverInput'

export default create({
  name: 'ColumnPropertyName',

  components: { PopoverInput },

  props: {
    row: Object
  },

  methods: {
    async handleSubmit(property_name) {
      const data = {
        property_id: this.row.id,
        property_name
      }
      try {
        await this.Fetch.post('V4/smgc.property.name.change', data)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
    }
  }
})
</script>
