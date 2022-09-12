<template>
  <div>
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="单点登录页面自定义"
    >
      <template slot="action">
        <el-button
          type="primary"
          style="margin-right: 12px"
          @click="$refs.DialogCustomLoginPage.handleOpen(data)"
        >配置</el-button>
      </template>
      <template slot="tips">
        <p>单点登录页面样式自定义</p>
      </template>
    </CardItemForm>
    <DialogCustomLoginPage
      ref="DialogCustomLoginPage"
      @init="$emit('update')"
    />
  </div>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import DialogCustomLoginPage from './DialogCustomLoginPage'

export default {
  components: { SelectSwitch, DialogCustomLoginPage },

  props: {
    data: Object
  }
}
</script>
