<template>
  <yd-card
    horizontal
    title="恶意链接监控"
  >
    <template slot="tips">
      <p>实时观测整个网站中所包含的异常链接，如黑链，无响应链接等异常链接</p>
    </template>
    <yd-alert>
      <p>可将友链等可信链接加入到链接白名单中，系统不会对其进行恶意链接监控</p>
      <p>如：http://www.demo.com</p>
    </yd-alert>
    <yd-form-select
      slot="action"
      :selects="Label.status"
      v-model="form.darkChain"
      @change="handleChangeIgnoreDarkChainList"
    />
    <el-form
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="恶意链接白名单">
        <el-input
          v-model="form.ignoreDarkChainList"
          :rows="4"
          :max="320"
          placeholder="http://www.demo.com"
          style="width: 400px"
          type="textarea"
          @blur="handleChangeIgnoreDarkChainList"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import mixins from './mixins'

export default {
  mixins: [mixins],

  data() {
    return {
      form: {},
      Label: {
        status: [
          {
            label: 'OFF',
            value: false
          },
          {
            label: 'ON',
            value: true
          }
        ]
      }
    }
  },

  methods: {
    init(data) {
      const form = {
        detection_id: data.detection_id,
        darkChain: data.darkChain
      }
      if (data.ignoreDarkChainList) {
        form.ignoreDarkChainList = data.ignoreDarkChainList.join('\n')
      }

      this.form = form
    },

    handleChangeIgnoreDarkChainList() {
      this.handleUpdate({
        ignoreDarkChainList: this.form.ignoreDarkChainList.split(/[\n\r]/g)
      })
    }
  }
}
</script>
