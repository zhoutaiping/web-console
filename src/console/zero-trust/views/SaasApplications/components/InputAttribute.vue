<template>
  <div>
    <div
      v-for="(item, index) in value"
      :key="index"
    >
      <InputAttributeItem
        :select-name-format="selectNameFormat"
        :select-value="selectValue"
        :name-format-disabled="item.create ? false : nameFormatDisabled"
        :value="item"
        :name-disabled="item.create ? false : nameDisabled"
        :visible-remove="allowAdd"
        style="margin-bottom: 10px"
        @remove="handleRemove(index)" />
    </div>
    <el-button
      v-if="allowAdd"
      type="primary"
      plain
      @click="handleAdd">+ 添加</el-button>
  </div>
</template>

<script>
import InputAttributeItem from './InputAttributeItem'

const ITEM_DEFAULT = {
  name: '',
  nameFormat: '',
  create: true,
  value: ''
}

export default {
  components: { InputAttributeItem },

  props: {
    value: Array,
    selectNameFormat: Array,
    nameFormatDisabled: Boolean,
    nameDisabled: Boolean,
    selectValue: Array,
    allowAdd: { type: Boolean, default: true }
  },

  methods: {
    handleAdd() {
      this.value.push({ ...ITEM_DEFAULT })
      this.$emit('input', this.value)
    },

    handleRemove(index) {
      this.value.splice(index, 1)
    }
  }
}
</script>
