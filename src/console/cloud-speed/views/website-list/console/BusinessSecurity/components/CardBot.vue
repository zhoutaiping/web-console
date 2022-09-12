<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="loading"
    title="Bot行为管理"
  >
    <yd-form-select
      slot="action"
      :selects="policyGroupOptions"
      v-model="policyGroupStatus"
      @change="handleChangePolicyGroupStatus"
    />
    <template slot="tips">
      <p>使用ATD智能引擎及威胁情报库，甄别分类友好及恶意机器人程序，可按需使用 精准访问控制引擎 采取针对性的流量管理策略</p>
    </template>
    <DmAlert>
      1. 处置动作为返回假数据时需输入数据提供服务器<br>
      2. 由 <router-link to="./waf">精准访问控制引擎</router-link> 驱动，开启防御后具体防御策略配置请至 <router-link to="./waf">精准访问控制引擎</router-link> 查看
    </DmAlert>
    <template v-if="wafGroupIds.bot">
      已知Bots管理
      <TableBot
        ref="TableBot"
        style="margin-top: 12px"
      />
    </template>
  </CardItemForm>
</template>

<script>
import wafMixins from '@/console/red-guard/mixins/waf'
import InputEdit from '@/components/InputEdit/InputEdit'
import consoleItem from '../../../../../mixins/consoleItem'
import consolePolicyGroup from '@/mixins/consolePolicyGroup'
import TableBot from './TableBot'

export default {
  name: 'CardDefenseRefer',

  components: {
    InputEdit, TableBot
  },

  mixins: [consoleItem, consolePolicyGroup, wafMixins],

  data() {
    return {
      validType: 'domain',
      policyGroupType: 'bot'
    }
  },

  methods: {
    async init() {
      await this.fetchPolicyGroup()
      this.loading = false
    }
  }
}
</script>
