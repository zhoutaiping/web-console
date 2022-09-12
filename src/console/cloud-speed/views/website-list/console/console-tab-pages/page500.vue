<template>
  <yd-card
    horizontal
    title="500 页面定制"
  >
    <template slot="tips">定制专属 500 页面，不开启时默认使用源站错误页面</template>
    <yd-form-select
      slot="action"
      v-model="form.type"
      :selects="SELECT.PAGE_500"
      @change="fetchUpdateStatus()"
    />
    <yd-alert>当启用自定义 HTML 模式，可以通过编辑 HTML 代码自定义 500 页面，代码中不能包含 JS</yd-alert>
    <upload-html
      v-if="form.type === 'custom'"
      :html="form.content"
      @updateHtml="fetchUpdateHtml"
    />
  </yd-card>
</template>

<script>
import UploadHtml from '@/components/CustomizationPage/UploadHtml'
import panelMixins from '../panelMixins'
import SELECT from '../../../../constant/select'

export default {
  name: 'Page500',

  components: {
    UploadHtml
  },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'diy_page_500',
      SELECT,
      formDefault: {
        content: '',
        type: ''
      }
    }
  },

  methods: {
    fetchUpdateStatus() {
      const form = this.form
      if (form.type === 'custom' && !form.content) return
      this.fetchUpdate()
    },

    fetchUpdateHtml(content) {
      this.form.content = content
      this.fetchUpdate()
    }
  }
}
</script>
