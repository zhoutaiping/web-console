<template>
  <el-form :class="'mode-' + mode" :label-position="labelPosition" :label-width="labelWidth" :style="{'max-width': width}" class="yd-form">
    <slot/>
  </el-form>
</template>

<script>
export default {
  props: {
    width: String,
    labelPosition: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    mode: String
  }
}
</script>
<style lang="scss">
.yd-form {
  font-size: 12px;
  .input-phone {
    width: 200px;
    margin-top: 2px;
  }

  &.mode-dialog-qa {
    .el-input {
      width: 300px !important;
    }
  }

  &.mode-dialog-qa-rest {
    text-align: center;
    margin: 20px auto;
  }
}
</style>
