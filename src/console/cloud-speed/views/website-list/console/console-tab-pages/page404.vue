<template>
  <yd-card
    horizontal
    title="公益 404"
  >
    <yd-form-select
      slot="action"
      :selects="selectOption"
      v-model="form.type"
      @change="fetchUpdate()"
    />
    <template slot="tips">启用公益 404 页面，帮助孩子回家</template>
    <yd-alert>
      启用源站错误页面，当出错时直接返回源站错误页面<br> 当启用自定义 HTML 模式，可以通过编辑 HTML 代码来自定义 404 页面，代码中不能包含 JS
    </yd-alert>
    <upload-html
      v-if="form.type === 'custom'"
      :html="form.content"
      @updateHtml="fetchUpdateHtml"
    />
    <div v-if="form.type === 'app404'">
      <div class="show404">
        <img
          alt="404"
          src="../../assets/images/404.png"
        >
      </div>
    </div>
  </yd-card>
</template>

<script>
import UploadHtml from '@/components/CustomizationPage/UploadHtml'
import panelMixins from '../panelMixins'

export default {
  name: 'Page404',

  components: {
    UploadHtml
  },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'diy_page_404',
      formDefault: {
        type: 'default',
        content: ''
      },
      selectOption: [
        {
          value: 'origin',
          label: '默认源站错误页面'
        },
        {
          value: 'custom',
          label: '自定义 HTML'
        },
        {
          value: 'app404',
          label: '公益 404'
        }
      ]
    }
  },

  methods: {
    fetchUpdateHtml(content) {
      this.form.content = content
      this.fetchUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.show404 {
  padding-top: 28%;
  position: relative;
  img {
    width: 100%;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
}
</style>
