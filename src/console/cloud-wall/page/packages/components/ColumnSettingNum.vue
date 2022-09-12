<template>
  <div>
    <div>七层转发规则：<router-link :to="{ name: 'cloud-wall.router.protectionRules__configLayer7Rule', query: {package_id: row.id}}">{{ row.domain_rule }} 条</router-link></div>
    <div>四层转发规则：<router-link :to="{ name: 'cloud-wall.router.protectionRules__configLayer4Rule', query: {package_id: row.id}}">{{ row.tcp_rule }} 条</router-link></div>
    <div>剩余规则数量：{{ row.package_rules_num - row.domain_rule - row.tcp_rule }}条</div>
  </div>
</template>

<script>
import column from '@/mixins/column'

export default {
  mixins: [column]
}
</script>
