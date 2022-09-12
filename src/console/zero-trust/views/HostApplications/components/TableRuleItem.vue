<template>
  <div>
    <div
      v-for="(item, index) in selectLogic"
      v-if="data.rule_conf.filter(_ => _.logic === item.value).length"
      :key="index"
    >
      <el-divider content-position="left">{{ item.label }}</el-divider>
      <TableRuleGroup
        ref="TableRuleGroup"
        :decision="data.decision"
        :select-access-group="selectAccessGroup"
        :group-title="item.label"
        :select-rule-key="selectRuleKey"
        :show-logic="item.value"
        :select-api-token="selectApiToken"
        :data="data.rule_conf"
        @add="handleAddRuleByLogic(item.value, data.rule_conf)"
      />
    </div>
    <div style="margin-top: 20px">
      <el-button
        v-for="(item, index) in selectLogic"
        :key="index"
        @click="handleAddRuleByLogic(item.value, data.rule_conf)"
      >+ {{ item.label }}</el-button>
    </div>
  </div>
</template>

<script>
import TableRuleGroup from './TableRuleGroup'

export default {
  components: { TableRuleGroup },

  props: {
    selectRuleKey: Array,
    data: {
      type: Object,
      default() {
        return {
          rule_conf: [{ logic: 'include', data: [] }]
        }
      }
    }
  },

  data() {
    return {
      selectAccessGroup: [],
      selectApiToken: [],
      selectLogic: [
        {
          label: '包括',
          value: 'include'
        },
        {
          label: '必须',
          value: 'require'
        },
        {
          label: '除外',
          value: 'exclude'
        }
      ]
    }
  },

  created() {
    this.fetchAccessGroup()
    this.fetchApiToken()
  },

  methods: {
    async fetchAccessGroup() {
      const data = await this.Fetch.get('V4/zero.trust.app.access.group.all.list')
      delete data._status
      this.selectAccessGroup = data.map(_ => {
        return {
          label: _.group_name,
          value: _.group_uuid
        }
      })
    },

    async fetchApiToken() {
      const data = await this.Fetch.get('V4/zero.trust.api.token.all')
      delete data._status
      this.selectApiToken = data.map(_ => {
        return {
          label: _.token_name,
          value: _.client_id
        }
      })
    },

    handleAddRuleByLogic(logic, list) {
      list.push({
        logic,
        data: []
      })
    }
  }
}
</script>
