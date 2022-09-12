<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="600px"
    title-label="证书"
    @submit="handleSubmit"
  >
    <yd-alert>
      1. 证书格式只支持pem格式，其他格式请转化为特定格式<br>
      2. 如果私钥有密码，请先去掉密码<br>
      3. 证书名称支持 4-50 位的汉字、英文字母、数字、特殊字符<br>
      4. 若编辑的证书与当前证书绑定域名不符，则编辑失败
    </yd-alert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item
        class="is-required"
        label="证书名称"
        prop="ca_name"
      >
        <el-input
          v-model="form.ca_name"
          auto-complete="off"
          placeholder="证书名称"
          style="width: 250px"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item>
        <yd-form-radio-button
          :radios="selectType"
          v-model="type"
          @change="handleChangeType"
        />
      </el-form-item>
      <template v-if="type==='text'">
        <el-form-item
          label="证书公钥"
          prop="ca_cert"
        >
          <el-input
            v-model="form.ca_cert"
            :rows="5"
            type="textarea"
            style="width: 400px"
            placeholder="-----BEGIN CERTIFICATE-----"
          />
        </el-form-item>
        <el-form-item
          label="证书私钥"
          prop="ca_key"
        >
          <el-input
            v-model="form.ca_key"
            :rows="5"
            type="textarea"
            style="width: 400px"
            placeholder="-----BEGIN RSA PRIVATE KEY-----"
          />
        </el-form-item>
      </template>
      <template v-if="type==='file'">
        <el-form-item
          label="证书文件"
          prop="ca_crt_file_name"
        >
          <el-input
            v-model="form.ca_crt_file_name"
            disabled
            auto-complete="off"
            placeholder="上传公钥"
            style="width: 250px; margin-right: 8px"
          />
          <label
            class="el-button el-button--small"
            for="ca_crt"
          >上传</label>
          <br>
          <a
            rel="noopener noreferrer"
            href="https://yundun-statics.yundun.com/Fncz4KtbAZstlmSWCIliLvzBqtmf"
            target="_blank"
          >如何转化为pem格式？</a>
          <input
            id="ca_crt"
            style="display: none"
            type="file"
            name="ca_crt"
            @change="handleItemChange('ca_crt')"
          >
        </el-form-item>
        <el-form-item
          label="证书私钥"
          prop="ca_key_file_name"
        >
          <el-input
            v-model="form.ca_key_file_name"
            disabled
            auto-complete="off"
            placeholder="上传私钥"
            style="width: 250px; margin-right: 8px"
          />
          <label
            class="el-button el-button--small"
            for="ca_key"
          >
            上传
          </label>
          <input
            id="ca_key"
            style="display: none"
            type="file"
            name="ca_key"
            @change="handleItemChange('ca_key')"
          >
        </el-form-item>
      </template>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { deepClone } from '@/utils'

function validateName(rule, value, callback) {
  if (!value) {
    callback(new Error('请填写证书名称'))
  } else if (value.length < 4) {
    callback(new Error('证书名称至少需要4个字符'))
  } else if (value.length > 50) {
    callback(new Error('证书名称最长不超过50个字符'))
  } else {
    callback()
  }
}

export default createDialog({
  data() {
    return {
      selectType: [
        {
          label: '手动输入',
          value: 'text'
        },
        {
          label: '上传文件',
          value: 'file'
        }
      ],
      type: 'text',
      formDefault: {
        ca_name: '',
        ca_crt_file_name: '',
        ca_key_file_name: '',
        ca_cert: '',
        ca_key: ''
      },
      rules: {
        ca_name: [{
          validator: validateName,
          trigger: 'blur'
        }],
        ca_crt_file_name: [{
          required: true,
          message: '请选择证书文件',
          trigger: 'blur'
        }],
        ca_key_file_name: [{
          required: true,
          message: '请选择证书私钥',
          trigger: 'blur'
        }],
        ca_cert: [{
          required: true,
          message: '输入证书公钥',
          trigger: 'blur'
        }],
        ca_key: [{
          required: true,
          message: '请输入证书私钥',
          trigger: 'blur'
        }]
      }
    }
  },

  methods: {
    initOptions(form) {
      this.mode = form.id ? 'Edit' : 'Create'

      this.$nextTick(() => {
        document.getElementById('ca_crt').value = ''
        document.getElementById('ca_key').value = ''
      })
    },

    handleChangeType(type) {
      if (type === 'file') {
        this.$nextTick(() => {
          document.getElementById('ca_crt').value = ''
          document.getElementById('ca_key').value = ''
        })
      }
    },

    handleItemChange(id, value) {
      const dom = document.getElementById(id)
      const fileName = dom.files[0].name
      if (id === 'ca_crt') {
        this.form.ca_crt_file_name = fileName
      } else {
        this.form.ca_key_file_name = fileName
      }
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const input = document.querySelectorAll('input[type="file"]')
      const type = this.type
      const form = deepClone(this.form)

      let data
      if (type === 'text') {
        data = {
          id: form.id,
          ca_name: form.ca_name,
          ca_cert: form.ca_cert,
          ca_key: form.ca_key
        }
      } else {
        data = new FormData()
        const length = input.length
        for (let i = 0; i < length; i++) {
          const name = input[i].name
          const file = input[i].files[0]
          data.append(name, file)
        }
        for (const i in form) {
          data.append(i, form[i])
        }
      }

      try {
        if (this.mode === 'Create') {
          await this.Fetch.post(type === 'text' ? 'V4/Web.ca.text.save' : 'V4/Web.ca.self.add', data)
        } else {
          await this.Fetch.post(type === 'text' ? 'V4/Web.ca.text.save' : 'V4/Web.ca.info.edit', data)
        }
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
