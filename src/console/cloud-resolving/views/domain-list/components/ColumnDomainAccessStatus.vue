<style lang="scss">
.ColumnDomainAccessStatus {
  &__popover {
    font-size: 12px;
  }
  i {
    margin-right: 8px;
  }
}
</style>

<template>
  <div :class="b()">
    <template v-if="row.trust_status === '0'">
      <el-popover
        :popper-class="b('popover')"
        trigger="hover"
      >
        未检测到DNS
        <span slot="reference"><i class="color--danger el-icon-circle-close" />未接入</span>
      </el-popover>
    </template>
    <template v-else-if="row.trust_status === '2'">
      <el-popover
        :popper-class="b('popover')"
        trigger="hover"
      >
        未接入
        <span slot="reference"><i class="color--danger el-icon-circle-close" />未接入</span>
      </el-popover>
    </template>
    <template v-else-if="row.trust_status === '3'">
      <el-popover
        :popper-class="b('popover')"
        trigger="hover"
      >
        未使用指定DNS
        <span slot="reference"><i class="color--danger el-icon-circle-close" />未接入</span>
      </el-popover>
    </template>
    <template v-else>
      <i class="color--success el-icon-circle-check" />已接入
    </template>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnDomainAccessStatus',

  props: {
    row: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
})
</script>
