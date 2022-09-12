<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="domainPlanInfo.meal_flag !== 'YD-WEBAQJS-TY'"
    :loading="false"
    title="Webshell"
  >
    <template slot="tips">
      <p>智能算法模型，深度检测系统中存在的网站后门</p>
    </template>
    <yd-form-select
      slot="action"
      v-model="op"
      :selects="OPTIONS"
      disabled
    />
  </CardItemForm>
</template>

<script>
import create from '@/utils/create-basic'
import consoleItem from '../../../../../mixins/consoleItem'

const OPTIONS = [
  {
    label: 'ON',
    value: 'on'
  }
]

export default create({
  name: 'CardWebshell',
  mixins: [consoleItem],
  data() {
    return {
      op: 'on',
      OPTIONS
    }
  }
})
</script>
