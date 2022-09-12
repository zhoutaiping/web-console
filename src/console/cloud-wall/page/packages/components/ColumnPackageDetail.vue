<style lang="scss">
.ColumnPackageDetail {
  &__core {
    cursor: pointer;
    border-bottom: 1px dashed $--color-primary !important;
    color: $--color-primary;
    font-size: 12px;
    padding: 2px 0px;
  }

  &__popover {
    font-size: 13px;
    .text {
      &--title {
        color: $--color-primary;
      }
    }
  }
}
</style>

<template>
  <div :class="b()">
    <el-popover
      :popper-class="b('popover')"
      placement="top"
      width="200"
      trigger="hover"
    >
      <el-table
        :show-header="false"
        :data="list"
        border
      >
        <el-table-column
          min-width="100"
          prop="title"
        />
        <el-table-column
          min-width="80"
          prop="value"
        />
      </el-table>
      <el-button
        slot="reference"
        :class="b('core')"
        type="text"
      >{{ row.package_type_name }}</el-button>
    </el-popover>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import column from '@/mixins/column'

export default create({
  name: 'ColumnPackageDetail',

  mixins: [column],

  data() {
    return {
      list: []
    }
  },

  watch: {
    row(val) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const row = this.row
      this.list = [
        {
          title: 'DDoS防护峰值',
          value: `${this.row.ddos_protect.value}${this.row.ddos_protect.unit}`
        },
        {
          title: 'CC防护峰值',
          value: row.cc_protect.value_format === '0万' ? row.cc_protect.value + row.cc_protect.unit : row.cc_protect.value_format + row.cc_protect.unit
        }
      ]
    }
  }
})
</script>
