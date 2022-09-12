<template>
  <div>
    <yd-card>
      <router-link :to="{name: 'cloud-speed.router.websiteList__waf', query: $route.query}">
        <el-button><i class="el-icon-back" /> 返回规则集列表</el-button>
      </router-link>
      <DmAlert class="margin-top">
        <p>当前规则集：<strong class="color--primary">{{ data.name | labelView(wafSelects.ruleFrom, 'label', data.name ) }}</strong>，当前规则集共有 <strong class="color--primary">{{ data.count || '-' }}</strong> 条网站防护策略，规则集状态：<strong class="color--primary">{{ Number(data.status) | labelView(wafSelects.status) }}</strong></p>
        <p>策略优先级按照排列顺序由上向下，暂停规则后，本规则不生效。最新增加的规则默认排序最靠前。</p>
        <template v-if="['bot', 'zL', 'aR'].includes(data.from)">
          <p>当前规则集为快捷导入，如需配置请到
            <template v-if="data.from === 'bot'">
              <router-link to="../businessSecurity">业务安全 -> Bot行为管理处配置</router-link>
            </template>
            <template v-else-if="data.from === 'zL'">
              <router-link to="../businessSecurity">业务安全 -> 区域屏蔽</router-link>
            </template>
            <template v-else-if="data.from === 'aR'">
              <router-link to="../businessSecurity">业务安全 -> 防盗链</router-link>
            </template>
          </p>
        </template>
      </DmAlert>
      <TableWAF
        v-if="!wafLoadingSettings"
        :card-params="bindParams"
        :confirm-modify="confirmAction"
        style="margin-top: 12px"
        api-index="V4/firewall.policy.get_groupId"
        @init="fetchInfo"
      />
    </yd-card>
  </div>
</template>

<script>
import TableWAF from '@/console/red-guard/components/TableWAF'
import wafMixins from '@/console/red-guard/mixins/waf'
import { arraySum } from '@/utils/array'
import InputMultiple from '@/components/Input/InputMultiple'
import consoleItem from '../../../../mixins/consoleItem'

export default {
  components: { TableWAF, InputMultiple },

  mixins: [wafMixins, consoleItem],

  data() {
    return {
      bindParams: {
        group_id: this.$route.params.groupId
      },
      data: {
        name: '-'
      }
    }
  },

  created() {
    this.fetchInfo()
  },

  methods: {
    async fetchInfo() {
      const domainid = this.$route.params.id

      const res = await this.Fetch.get('V4/firewall.policyGroup.get_domainid', {
        id: this.$route.params.groupId,
        domainid
      })

      const data = res.list[0]
      data.count = arraySum(Object.values(data.policy_num))
      this.data = data
    }
  }
}
</script>
