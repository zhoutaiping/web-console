<style lang="less">
.SelectWebsiteGroup {
  &__popper {
    padding: 0px;
    .footer {
      text-align: center;
      padding: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }
  }
}
</style>

<template>
  <span>
    <el-popover
      :popper-class="b('popper')"
      v-model="visible"
      placement="bottom-start"
      width="300"
      @after-enter="init"
    >
      <WebsiteList ref="WebsiteList" />
      <div class="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确定</el-button>
      </div>
      <template slot="reference">
        <el-button>
          <template v-if="selectedTotal === 0">
            全部网站
          </template>
          <template v-else>
            已选择 {{ selectedTotal }} / {{ total }} 个网站
          </template>
        <i class="el-icon-arrow-down" /></el-button>
      </template>
    </el-popover>
  </span>
</template>

<script>
import create from '@/utils/create-basic'
import SelectMultipleMany from '@/components/Select/SelectMultipleMany'
import WebsiteList from './WebsiteList'

export default create({
  name: 'SelectWebsiteGroup',

  components: { SelectMultipleMany, WebsiteList },

  props: {
    childrenVisible: Boolean
  },

  data() {
    return {
      visible: false,
      total: 0,
      selectedTotal: 0
    }
  },

  methods: {
    init(params) {
      this.$refs.WebsiteList.init(params)
    },

    handleSubmit() {
      const params = {
        sub_domain: []
      }
      const { value: sub_domain, total } = this.$refs.WebsiteList.getValue()
      params.sub_domain = sub_domain

      this.selectedTotal = sub_domain.length
      this.total = total
      this.$emit('submit', params)
      this.visible = false
    }
  }
})
</script>
