<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="false"
    title="WAF拦截页面定制"
  >
    <template slot="tips">
      <p>定制专属WAF拦截页面，不开启是默认使用{{ $t('red-guard.title') }}提供的拦截页面</p>
    </template>
    <yd-form-select
      slot="action"
      :selects="options"
      v-model="form.type"
      placeholder="请选择"
      @change="handleUpdateStatus"
    />
    <DmAlert>
      当启用自定义HTML模式，可以通过编辑HTML代码自定义拦截页面，代码中不能包含JS
    </DmAlert>
    <UploadHtml
      v-if="form.type === 'custom'"
      :html="form.content"
      @updateHtml="handleUpdateHtml"
    />
  </CardItemForm>
</template>

<script>
import UploadHtml from '@/components/CustomizationPage/UploadHtml'
import consoleItem from '../../../../../mixins/consoleItem'

export default {
  name: 'WafIntercept',

  components: {
    UploadHtml
  },

  mixins: [consoleItem],

  data() {
    return {
      SETTING_ID: 'waf_block_diy_page',
      formDefault: {
        content: '',
        type: 'default'
      },
      options: [
        {
          value: 'default',
          label: '默认__companyEN__错误页面'
        },
        {
          value: 'custom',
          label: '自定义HTML'
        }
      ]
    }
  },

  methods: {
    init() {
      const { packageLevel } = this.pageData
      if (packageLevel === 1) {
        this.options = [
          {
            value: 'default',
            label: '默认__companyEN__错误页面'
          },
          {
            value: 'custom',
            label: '自定义HTML',
            disabled: true
          }
        ]
      }
    },

    handleUpdateStatus(val) {
      const form = this.form
      form.status = val === 'default' ? 'off' : 'on'
      form.type = val === 'off' ? 'off' : val
      this.handleUpdate()
    },

    handleUpdateHtml(content) {
      this.form.content = content
      this.handleUpdate()
    },

    async handleUpdate() {
      await this.confirmAction()
      this.fetchUpdate()
    }
  }
}
</script>
