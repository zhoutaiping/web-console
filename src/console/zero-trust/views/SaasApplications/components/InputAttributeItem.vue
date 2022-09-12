<style lang="scss">
.InputAttributeItem{
  &__label{
    font-size: 13px;
    margin-right: 10px;
  }

  &__remove{
    margin-left: 10px;
    font-size: 15px;
    cursor: pointer;
  }
}

</style>

<template>
  <div :class="b()">
    <span :class="b('label')">
      Name
    </span>
    <el-tooltip
      :content="value.name"
      :disabled="!value.name"
      effect="light"
      placement="top-start"
    >
      <el-input
        v-model="value.name"
        :disabled="nameDisabled"
        placeholder="请输入内容"
        style="width: 380px"
      >
        <yd-form-select
          slot="append"
          v-model="value.nameFormat"
          :disabled="nameFormatDisabled"
          :selects="selectNameFormat"
          style="width: 140px"
        />
      </el-input>
    </el-tooltip>
    <span :class="b('label')" style="margin-left: 18px">
      Value
    </span>
    <yd-form-select
      :selects="selectValue"
      v-model="value.value"
      filterable
      allow-create
      style="width: 140px"
    />
    <i
      v-if="visibleRemove"
      :class="b('remove')"
      class="el-icon-remove-outline"
      @click="$emit('remove')"
    />
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'InputAttributeItem',

  props: {
    value: Object,
    selectNameFormat: Array,
    nameDisabled: Boolean,
    nameFormatDisabled: Boolean,
    selectValue: Array,
    visibleRemove: Boolean
  },

  data() {
    return {
      val: {
        name: '',
        nameFormat: '',
        value: ''
      }
    }
  }
})
</script>
