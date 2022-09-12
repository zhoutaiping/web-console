<template>
  <div>
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
          v-if="isBatch"
          label="添加方式"
        >
          <yd-form-radio
            v-model="formBatch._pmode"
            :radios="SELECT.EDIT_TYPE_M2"
          />
        </el-form-item>
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
  </div>
</template>

<script>
import { addReserved } from '@/utils/form'
import baseMixins from './base'
import SELECT from '../../constant/select'
import Label from '../../constant/label'

function validatorList(rule, value, callback) {
  const list = value.split(/[\n\r]/g)
  if (list.length > 100) callback('设置上限为100个')

  list.forEach(item => {
    if (item.length > 25) callback('单个敏感词长度上限为25个字')
  })
}

export default {
  mixins: [baseMixins],

  data() {
    return {
      SELECT,
      config: {
        selectStatus: [
          ...Label.CONTENT_REPLACE_MODE,
          {
            value: 'off',
            label: 'OFF'
          }
        ]
      },
      rules: {
        diyWords: [
          { required: true, message: '请填写', trigger: 'blur' },
          { validator: validatorList }
        ],
        replace_to: [
          { required: true, message: '请填写', trigger: 'blur' }
        ]
      },
      form: {},
      formDefault: {
        status: 'off',
        replace_to: '',
        diyWords: ''
      },
      formBatch: {
        _pmode: 'append'
      }
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    setForm(form = {}) {
      let diyWords
      if (Array.isArray(form.diy_words)) diyWords = form.diy_words.join('\n')
      const status = form.status === 'on' ? form.mode : 'off'

      this.form = {
        ...this.formDefault,
        ...form,
        diyWords,
        status
      }
      this.$emit('updateStatus', status)
    },

    async getForm() {
      let diy_words
      if (this.$refs.Form) {
        this.$refs.Form.validate((valid) => {
          if (!valid) throw new Error()
        })
        diy_words = this.form.diyWords.split(/[\n\r]/g).filter(_ => _)
      }

      const status = this.form.status === 'off' ? 'off' : 'on'
      const mode = this.form.status === 'off' ? 'default' : this.form.status
      let _pmode = ['custom', 'mix'].includes(status) ? this.formBatch._pmode : 'keep'
      if (status !== 'keep') _pmode = 'rewrite'

      return {
        _pmode,
        status,
        mode,
        diy_words,
        _policy: mode,
        replace_to: this.form.replace_to,
        ...this.isBatch ? this.formBatch : {}
      }
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
