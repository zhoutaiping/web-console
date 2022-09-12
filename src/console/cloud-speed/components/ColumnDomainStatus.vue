<style lang="scss">
.ColumnDomainStatus {
  display: inline-block;

  &__popover {
    font-size: 12px;
  }
}
</style>
<template>
  <div :class="b()">
    <!-- 计入状态 -->
    <span style="margin-right: 8px">
      <el-tooltip
        v-if="isJoin"
        content="已接入"
      >
        <i class="el-icon-success color--success" />
      </el-tooltip>
      <el-tooltip
        v-else
        content="未接入"
      >
        <i class="el-icon-error color--danger" />
      </el-tooltip>
    </span>
    <!-- 服务状态 -->
    <el-popover
      :popper-class="b('popover')"
      :disabled="!showPopover"
      width="200"
      trigger="hover"
      placement="top-start"
    >
      该网站不符合性能优化产品接入标准，请咨询技术支持接入
      <span
        slot="reference"
        :class="`color--${titleColor}`"
      >
        {{ title }}
      </span>
    </el-popover>
    <p v-if="Object.is(row.records.length, 0)">
      <a class="color--danger">待设置源站</a>
    </p>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'ColumnDomainStatus',

  props: {
    row: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data() {
    return {
      isJoin: true,
      title: '',
      titleColor: '',
      showPopover: false
    }
  },

  watch: {
    row() {
      this.init()
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      let { check_status, protected_status, use_yundun_dns, protected_mode, use_yundun_cname } = this.row
      check_status = Number(check_status) // 审核状态
      protected_status = Number(protected_status) // 域名节点调度
      protected_mode = Number(protected_mode) // 接入状态
      use_yundun_dns = Number(use_yundun_dns)
      use_yundun_cname = Number(use_yundun_cname)
      // 是否接入
      const isJoin = [2, 4].includes(check_status) && ((protected_mode === 1 && use_yundun_cname === 1) || (protected_mode === 2 && use_yundun_dns === 1))

      let title = ''
      let titleColor = ''
      let showPopover = false

      if (check_status === 0) {
        title = '待认证'
        titleColor = 'warning'
      } else if (check_status === 1) {
        title = '审核中'
        titleColor = 'warning'
      } else if (check_status === 2 || check_status === 4) {
        if (protected_status === 0) {
          title = '未启用'
          titleColor = 'warning'
        } else {
          title = '已启用'
          titleColor = 'success'
        }
      } else if (check_status === 3 || check_status === 5) {
        title = '审核不通过'
        titleColor = 'danger'
        showPopover = true
      } else if (check_status === 6) {
        title = '禁用'
        titleColor = 'warning'
      } else if (check_status === 7) {
        title = '回源'
        titleColor = 'warning'
      }

      this.title = title
      this.titleColor = titleColor
      this.showPopover = showPopover
      this.isJoin = isJoin
    }
  }
})
</script>
