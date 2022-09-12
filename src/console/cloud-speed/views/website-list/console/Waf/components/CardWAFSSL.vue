<template>
  <CardItemForm
    v-show="form.mode === 'custom'"
    :is-init="isInit"
    :is-support="true"
    :loading="false"
    title="精准访问控制（Https）">
    <template slot="tips">
      针对 Https 的攻击提供精准化防护控制台，可以根据攻击情况定制专有防护策略
    </template>
    <SelectSwitch
      slot="action"
      :value="form.mode"
      :on-visible="false"
      :selects="options"
      off-value="off"
      @change="handleUpdateStatus"
    />
    <TableWAF
      v-if="!wafLoadingSettings"
      :disabled-action-by-query="false"
      type="ssl"
    />
  </CardItemForm>
</template>

<script>
import TableWAF from '@/console/red-guard/components/TableWAF'
import wafMixins from '@/console/red-guard/mixins/waf'
import InputMultiple from '@/components/Input/InputMultiple'
import SelectSwitch from '@/components/Select/SelectSwitch'
import consoleItem from '../../../../../mixins/consoleItem'

export default {
  components: { TableWAF, InputMultiple, SelectSwitch },

  mixins: [wafMixins, consoleItem],

  data() {
    return {
      SETTING_ID: 'ssl_acl',
      options: [
        {
          label: '默认',
          value: 'default'
        },
        {
          label: '自定义',
          value: 'custom'
        }
      ],
      formDefault: {
        mode: 'default'
      }
    }
  },

  created() {
    this.wafFetchSettings({ type: 'ssl' })
  },

  methods: {
    handleUpdateStatus(val) {
      this.form.mode = val
      this.fetchUpdate()
    }
  }
}
</script>
