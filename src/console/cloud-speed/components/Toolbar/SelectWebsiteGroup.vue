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
      <el-tabs
        v-model="type"
        stretch
        size="small"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          label="按域名"
          name="domain"
        >
          <WebsiteList
            ref="WebsiteList"
            :children-visible="childrenVisible"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="!isChild"
          label="按分组"
          name="group"
        >
          <GroupList ref="GroupList" />
        </el-tab-pane>
      </el-tabs>
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
            <template v-if="showType === 'domain'">
              已选择 {{ selectedTotal }} / {{ total }} 个网站
            </template>
            <template v-if="showType === 'group'">
              已选择 {{ selectedTotal }} / {{ total }} 个分组
            </template>
          </template>
          <i class="el-icon-arrow-down" />
        </el-button>
      </template>
    </el-popover>
  </span>
</template>

<script>
import create from '@/utils/create-basic'
import SelectMultipleMany from '@/components/Select/SelectMultipleMany'
import WebsiteList from './WebsiteList'
import GroupList from './GroupList'
import { getUserstore } from '@/utils/auth'
export default create({
  name: 'SelectWebsiteGroup',

  components: { SelectMultipleMany, WebsiteList, GroupList },

  props: {
    childrenVisible: Boolean
  },

  data() {
    const { userType } = getUserstore()
    return {
      isChild: userType === 'child',
      visible: false,
      total: 0,
      selectedTotal: 0,
      type: 'domain',
      showType: 'domain'
    }
  },

  methods: {
    init() {
      this.$refs.WebsiteList.init()
    },

    handleSubmit() {
      const params = {
        sub_domain: [],
        sub_domains_and_node_ips: [],
        group_id: []
      }

      let selectedTotal = []
      let total = 0

      if (this.type === 'domain') {
        const value = this.$refs.WebsiteList.getValue()
        params.sub_domain = value.sub_domain
        params.sub_domains_and_node_ips = value.sub_domains_and_node_ips
        selectedTotal = value.sub_domain.length
        total = value.rootTotal
      } else {
        const value = this.$refs.GroupList.getValue()
        params.group_id = value.list
        selectedTotal = value.list.length
        total = value.total
      }

      this.showType = this.type
      this.selectedTotal = selectedTotal
      this.total = total
      this.$emit('submit', params)
      this.visible = false
    },

    handleTabClick(type) {
      this.value = []
      if (type === 'domain') {
        this.$refs.WebsiteList.init()
      } else {
        this.$refs.GroupList.init()
      }
    }
  }
})
</script>
