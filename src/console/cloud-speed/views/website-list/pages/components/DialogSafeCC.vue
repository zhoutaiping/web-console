<template>
  <yd-dialog v-loading :class="b()" :title="title" :visible.sync="open" :close-on-click-modal="true" aside aside-type="top">
    <div slot="footer">
      <el-button type="text" @click="handleClose">取消</el-button>
      <el-button :loading="loadingSubmit" type="primary" @click="handleSubmit">保存</el-button>
    </div>
    <div>
      <FormItemAction>
        有效防止CC攻击，业务系统防刷,恶意爬虫采集等，{{ appAssets.companyEN }}全局默认对搜索引擎放行
        <yd-form-select slot="action" v-model="form.options" :selects="addReserved(SELECT.CC_OPTIONS, 'keep')"/>
      </FormItemAction>
      <div v-show="!haveWAF">
        <el-form ref="form" :model="form" style="margin-top: 12px" label-width="120px" label-position="left">
          <el-form-item label="后缀名白名单">
            <yd-form-radio-button v-model="form.suffix._policy" :radios="SELECT.EDIT_TYPE_M2"/>
          </el-form-item>
          <el-form-item label="后缀白名单">
            <el-popover ref="popoverSuffix" placement="bottom" width="580" trigger="click">
              <PopupSuffix v-model="form.suffix.content"/>
            </el-popover>
            <el-input v-popover:popoverSuffix v-model="form.suffix.content" placeholder="jpg|png|gif"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.suffix.remark" placeholder="备注信息（选填）"/>
          </el-form-item>
          <hr>
          <el-form-item label="IP 白名单">
            <yd-form-radio-button v-model="form.ip._policy" :radios="SELECT.EDIT_TYPE_M2"/>
          </el-form-item>
          <el-form-item :rules="formRules.ip.content" prop="ip.content">
            <el-input v-model="form.ip.content" :rows="5" type="textarea" placeholder="请填写 IP 白名单，多个之间请回车换行"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.ip.remark" placeholder="备注信息（选填）"/>
          </el-form-item>
          <hr>
          <el-form-item label="URL 白名单">
            <yd-form-radio-button v-model="form.url._policy" :radios="SELECT.EDIT_TYPE_M2"/>
          </el-form-item>
          <el-form-item :rules="formRules.url.content" prop="url.content">
            <el-input v-model="form.url.content" :rows="5" type="textarea" placeholder="请填写 URL 白名单，多个之间请回车换行"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.url.remark" placeholder="备注信息（选填）"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import diloagBatch from '../../../../mixins/dialog-batch'
import FormItemAction from '@/components/FormItem/FormItemAction'
import PopupSuffix from '@/components/Popup/PopupSuffix'
import { validatorList } from '@/utils/validator'
import RULE from '@/utils/verify'

const FORM = {
  options: 'keep',
  suffix: {
    _policy: 'append',
    content: '',
    remark: ''
  },
  ip: {
    _policy: 'append',
    content: '',
    remark: ''
  },
  url: {
    _policy: 'append',
    content: '',
    remark: ''
  }
}

export default create({
  name: 'dialogSafeCC',

  components: { FormItemAction, PopupSuffix },

  mixins: [diloagBatch],

  data() {
    return {
      title: '防CC/访客鉴别',
      open: false,
      loadingSubmit: false,
      form: deepClone(FORM),
      formRules: {
        ip: {
          content: [
            { validator: validatorList(RULE.ipReg), trigger: 'blur', message: '格式错误' }
          ]
        },
        url: {
          content: [
            { validator: validatorList(RULE.haveHttpOrNotUrl), trigger: 'blur', message: '格式错误' }
          ]
        }
      }
    }
  },

  methods: {
    handleOpen() {
      this.form = deepClone(FORM)
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    formatItem(form, name) {
      const { content, remark } = form
      const list = name === 'suffix' ? [content] : content.split(/[\n\r]/g)

      const data = {
        rules: list.map(content => {
          return {
            type: name,
            mode: 'white',
            content,
            remark
          }
        }),
        _policy: form._policy
      }
      return data
    },

    handleSubmit() {
      const form = deepClone(this.form)
      // if (form.options === '__KEEP__') {
      //   this.handleClose()
      //   return
      // }

      this.$refs.form.validate(valid => {
        if (!valid) return

        let status = 'keep'
        let _policy = 'keep'
        let type = 'keep'

        if (form.options !== 'keep') {
          status = form.options === 'off' ? 'off' : 'on'
          _policy = form.options === 'off' ? 'off' : 'on'
          type = form.options === 'off' ? 'default' : form.options
        }

        const formData = {
          anti_cc: {
            status,
            _policy,
            type
          },
          anti_cc_rules: {}
        }

        if (form.suffix.content && form.suffix.content.length > 0) formData.anti_cc_rules.suffix = this.formatItem(form.suffix, 'suffix')
        if (form.ip.content) formData.anti_cc_rules.ip = this.formatItem(form.ip, 'ip')
        if (form.url.content) formData.anti_cc_rules.url = this.formatItem(form.url, 'url')

        const data = {
          id: '__RAW__',
          name: 'dialogSafeCC',
          form: formData
        }

        this.$emit('submit', data)
      })
    }
  }
})
</script>
