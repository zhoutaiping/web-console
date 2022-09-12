<template>
  <yd-card>
    <template slot="tips">
      <p>过滤和替换敏感信息、反动言论和淫秽内容。</p>
    </template>
    <yd-form-select
      slot="action"
      v-model="form.status"
      :selects="SECTION_OPTOINS"
    />
    <DmAlert>
      <p>1. 默认模式：使用YUNDUN专人定期更新的敏感词库</p>
      <p>2. 自定义模式：用户需要设置自定义敏感词，系统仅对自定义敏感词进行检测</p>
      <p>3. 混合模式：敏感词库取YUNDUN默认词库与用户自定义敏感词并集</p>
      <p>4. 敏感词默认替换为“**”</p>
      <p>5. 自定义敏感词的设置上限为100个，单个敏感词长度上限为25个字</p>
    </DmAlert>
    <template v-if="['custom', 'mix'].includes(form.status)">
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="自定义敏感词"
          prop="diyWords"
        >
          <el-input
            v-model="form.diyWords"
            :rows="10"
            type="textarea"
            placeholder="请输入需要添加的敏感词，多个敏感词使用回车分隔"
            upper-limit="100"
          />
        </el-form-item>
        <el-form-item
          label="敏感词替换为"
          prop="replace_to"
        >
          <el-input
            v-model="form.replace_to"
            style="width: 320px"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
    </template>
  </yd-card>
</template>

<script>

function validatorList(rule, value, callback) {
  const list = value.split(/[\n\r]/g)
  if (list.length > 100) callback('设置上限为100个')

  list.forEach(item => {
    if (item.length > 25) callback('单个敏感词长度上限为25个字')
  })
}

export default {
  data() {
    return {
      SECTION_OPTOINS: [
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
      ],
      rules: {
        diyWords: [
          { required: true, message: '请填写', trigger: 'blur' },
          { validator: validatorList }
        ],
        replace_to: [
          { required: true, message: '请填写', trigger: 'blur' }
        ]
      },
      form: {
        status: 'off',
        replace_to: '',
        diyWords: ''
        // diy_words: []
        // mode: 'custom'
      }
    }
  },

  methods: {
    setForm(form) {
      const status = (form.status === 'off' || !form.status) ? 'off' : form.mode
      const diyWords = form.diy_words.join('\n')
      this.form = {
        ...form,
        status,
        diyWords
      }
    },

    getForm() {
      if (this.$refs.Form) {
        this.$refs.Form.validate((valid) => {
          if (!valid) throw new Error()
        })
      }
      const status = this.form.status === 'off' ? 'off' : 'on'
      const mode = this.form.status === 'off' ? 'default' : this.form.status
      const diy_words = this.form.diyWords.split(/[\n\r]/g).filter(_ => _)
      const form = {
        status,
        mode,
        diy_words,
        replace_to: this.form.replace_to
      }
      return form
    }
  }
}
</script>
