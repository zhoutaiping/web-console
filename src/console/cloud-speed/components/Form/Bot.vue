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
import TableBot from './components/TableBot'

export default {
  name: 'CardDefenseRefer',

  components: {
    InputEdit, TableBot
  },

  mixins: [wafMixins],

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
