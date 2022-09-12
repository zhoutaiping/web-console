<template>
  <el-cascader
    v-model="value"
    :options="selects"
    :props="{ expandTrigger: 'hover' }"
    style="width: 100%"
    @change="handleChange"
  >
    <template slot-scope="{ node, data }">
      <el-tooltip
        :disabled="!data.tips"
        :content="data.tips"
        effect="dark"
        placement="right"
      >
        <span>{{ data.label }}</span>
        <!-- <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span> -->
      </el-tooltip>
    </template>
  </el-cascader>
</template>

<script>
export default {

  props: {
    value: [String, Array],
    selects: Array
  },

  data() {
    return {
      valueView: []
    }
  },

  methods: {
    handleChange(value) {
      value = value[value.length - 1]
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
