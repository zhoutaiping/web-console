<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="false"
    title="内容替换"
  >
    <template slot="tips">
      <p>过滤和替换敏感信息、反动言论和淫秽内容。</p>
    </template>
    <yd-form-select
      slot="action"
      :value="status"
      :selects="options"
      @change="handleUpdateStatus"
    />
    <DmAlert>
      <p>1. 默认模式：使用 {{ appAssets.companyEN }} 专人定期更新的敏感词库</p>
      <p>2. 自定义模式：用户需要设置自定义敏感词，系统仅对自定义敏感词进行检测</p>
      <p>3. 混合模式：敏感词库取 {{ appAssets.companyEN }} 默认词库与用户自定义敏感词并集</p>
      <p>4. 敏感词默认替换为“**”</p>
      <p>5. 自定义敏感词的设置上限为100个，单个敏感词长度上限为25个字</p>
    </DmAlert>
    <el-form label-width="120px">
      <el-form-item label="自定义敏感词">
        <InputTextAreaMultiple
          v-model="form.diy_words"
          style="width: 500px"
          placeholder="请输入需要添加的敏感词，多个敏感词使用回车分隔"
          @change="handleUpdate"
        />
      </el-form-item>
      <el-form-item label="敏感词替换为">
        <el-popover
          ref="popoverError"
          :value="errorTip"
          popper-class="popover-error"
          placement="top"
          width="200"
          trigger="manual"
          content="请输入正确内容!"
        />
        <el-input
          v-popover:popoverError
          :class="{'is-error':errorTip}"
          v-model="form.replace_to"
          style="width: 500px"
          class="url-input"
          placeholder="请输入内容"
          @blur="handleUpdate"
        />
      </el-form-item>
    </el-form>
  </CardItemForm>
</template>

<script>
import InputTextAreaMultiple from '@/components/Input/InputTextAreaMultiple'
import consoleItem from '../../../../../mixins/consoleItem'

export default {
  name: 'ContentReplace',

  components: {
    InputTextAreaMultiple
  },

  mixins: [consoleItem],

  data() {
    return {
      SETTING_ID: 'content_replace',
      errorTip: false,
      formDefault: {
        modoe: 'default',
        replace_to: '**',
        diy_words: []
      },
      options: [
        {
          value: 'off',
          label: 'OFF'
        },
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'custom',
          label: '自定义'
        },
        {
          value: 'mix',
          label: '混合模式'
        }
      ]
    }
  },

  computed: {
    status() {
      const { status, mode } = this.form
      return status === 'on' ? mode : 'off'
    }
  },

  methods: {
    formatResponse(data) {
      return data
    },

    async handleUpdateStatus(val) {
      const form = this.form
      form.status = val === 'off' ? 'off' : 'on'
      form.mode = val === 'off' ? 'default' : val
      this.handleUpdate()
    },

    async handleUpdate() {
      await this.confirmAction()
      this.errorTip = false
      this.fetchUpdate()
    }
  }
}
</script>
