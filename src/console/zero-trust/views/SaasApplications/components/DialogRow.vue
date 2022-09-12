<style lang="scss">
.ItemIcon {
  cursor: pointer;
  margin-right: 20px;
}
.SaasApplications__DialogRow {
  .el-form {
    padding: 10px;
  }

  .el-divider__text {
    font-weight: 600;
    padding-left: 0px;
    padding-right: 45px;

    &.is-left {
      left: 0px;
      transform: translateY(-50%);
    }
  }
}
</style>

<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    :loading="loading"
    :title="mode === 'Create' ? '新增SaaS应用' : `编辑SaaS应用（${form.app_name}）`"
    class="SaasApplications__DialogRow"
    width="750px"
    aside
    @submit="handleSubmit"
  >
    <el-form
      ref="FormBasic"
      :model="form"
      :rules="formRules"
      label-position="left"
      label-width="100px"
    >
      <el-divider content-position="left">基本信息</el-divider>
      <el-form-item
        label="应用名称"
        prop="app_name"
      >
        <el-input
          v-model="form.app_name"
          placeholder="应用名称"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item label="模板类型">
        <el-input
          v-model="form.template_type_name"
          style="width: 280px"
          disabled
        />
      </el-form-item>
      <el-form-item label="应用类型">
        <el-input
          v-model="form.saas_app_type"
          style="width: 280px"
          disabled
        />
      </el-form-item>
      <el-form-item label="应用图标">
        <InputUploadIcon
          v-model="form.app_logo"
          :default-value="logos[form.saas_app_type]"
          file-key="zero_trust_app_logo"
        />
      </el-form-item>
      <el-form-item
        label="会话过期时长"
        prop="session_duration"
      >
        <yd-form-select
          :selects="selectSessionDuration"
          v-model="form.session_duration"
        />
      </el-form-item>
    </el-form>
    <el-form
      v-if="formSettings"
      ref="FormDetail"
      :model="form"
      :rules="formRules"
      label-position="left"
      label-width="200px"
    >
      <template v-for="groupItem in formSettings.groupFields">
        <el-divider
          v-if="groupItem.list.length"
          :key="groupItem.groupTitle"
          content-position="left"
        >{{ groupItem.groupTitle }}</el-divider>
        <template
          v-for="(itemFiled, index) in groupItem.list"
          v-if="!formItemHidden.includes(itemFiled.field)"
        >
          <template v-if="itemFiled.type === 'attribute'">
            <div :key="index">
              <el-divider content-position="left">Attribute</el-divider>
              <InputAttribute
                :select-name-format="itemFiled.selectNameFormat"
                :name-format-disabled="itemFiled.nameFormatDisabled"
                :select-value="itemFiled.selectValue"
                :name-disabled="itemFiled.nameDisabled"
                v-model="form[itemFiled.field]"
                :allow-add="itemFiled.allowAdd"
              />
            </div>
          </template>
          <el-form-item
            v-else
            :key="index + itemFiled.field"
            :label="itemFiled.type === 'checkbox' ? '' : itemFiled.label"
            :prop="itemFiled.field"
            :rules="itemFiled.rules"
          >
            <FormItemPoly
              v-model="form[itemFiled.field]"
              :options="itemFiled"
              @change="val => handleChangeFormItem(val, itemFiled.field)"
            />
          </el-form-item>
        </template>
      </template>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import InputUploadIcon from '@/components/Input/InputUploadIcon'
import FormItemPoly from '@/components/FormItem/FormItemPoly'
import InputAttribute from './InputAttribute'
import { isDef } from '@/utils'

function formatformSettings(list) {
  const formDefault = {}
  const fields = []
  const methods = []
  let visibleMore = false
  list.forEach(item => {
    if (typeof item === 'string') {
      fields.push({
        placeholder: item,
        label: item,
        field: item
      })
    } else {
      if (item.hidden === true) visibleMore = true

      if (['digestMethod', 'algorithmMethod'].includes(item.field)) {
        methods.push({
          ...item,
          placeholder: item.placeholder || item.field,
          label: item.label || item.field
        })
      } else {
        fields.push({
          ...item,
          placeholder: item.placeholder || item.field,
          label: item.label || item.field
        })
      }
      if (item.defaultValue) {
        formDefault[item.field] = item.defaultValue
      } else {
        if (item.field === 'attribute') {
          formDefault[item.field] = [
            {
              name: '',
              nameFormat: '',
              value: ''
            }
          ]
        } else {
          formDefault[item.field] = ''
        }
      }
    }
  })

  return {
    formDefault,
    fields,
    visibleMore,
    methods
  }
}

const FORM_DEFAULT = {
  app_type: 2,
  app_name: '',
  app_logo: '',
  template_type_name: '',
  saas_app_type: '',
  sso_login_url: '',
  entity_id: '',
  destination_url: '',
  recipient_url: '',
  use_recipient_destination_url: true,
  session_duration: 900,
  attribute: [],
  name_id_format: '',
  template_id: ''
}

export default createDialog({
  components: { InputUploadIcon, FormItemPoly, InputAttribute },

  data() {
    return {
      loading: true,
      selectType: [],
      selectTemplateType: [],
      selectAppType: [],
      formRules: {
        app_name: {
          required: true,
          message: '请填写应用名称',
          trigger: 'blur'
        }
      },
      selectSessionDuration: [
        {
          label: '本次会话有效',
          value: 0
        },
        {
          label: '15分钟',
          value: 900
        },
        {
          label: '30分钟',
          value: 1800
        },
        {
          label: '1小时',
          value: 3600
        },
        {
          label: '6小时',
          value: 3600 * 6
        },
        {
          label: '24小时',
          value: 3600 * 24
        },
        {
          label: '48小时',
          value: 3600 * 48
        },
        {
          label: '72小时',
          value: 3600 * 72
        },
        {
          label: '1周',
          value: 3600 * 24 * 7
        },
        {
          label: '2周',
          value: 3600 * 24 * 14
        },
        {
          label: '3周',
          value: 3600 * 24 * 21
        },
        {
          label: '1月',
          value: 3600 * 24 * 30
        }
      ],
      logos: {},
      formSettings: [],
      formSettingsMap: {},
      formDefault: {
        ...FORM_DEFAULT
      },
      formItemHidden: []
    }
  },

  methods: {
    handleChangeFormItem(val, field) {
      if (field === 'use_recipient_destination_url') {
        this.formItemHidden = val ? ['recipient_url', 'destination_url'] : []
      }
    },

    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.$refs.FormBasic && this.$refs.FormBasic.clearValidate()
      this.$refs.FormDetail && this.$refs.FormDetail.clearValidate()
      this.fetchTemplateInfo()
    },

    async fetchTemplateInfo() {
      this.loading = true
      const data = await this.Fetch.get('V4/zero.trust.saas.conf.info', {
        template_id: this.form.template_id
      })

      this.logos[data.app_type] = data.app_logo
      this.formSettings = formatformSettings(data.fields)
      this.formSettings.groupFields = [
        {
          groupTitle: '元数据信息',
          list: this.formSettings.fields
        },
        {
          groupTitle: '加密方式',
          list: this.formSettings.methods
        }
      ]

      if (this.mode === 'Create') {
        Object.keys(this.formSettings.formDefault).forEach(key => {
          const value = isDef(this.formSettings.formDefault[key]) ? this.formSettings.formDefault[key] : ''
          this.$set(this.form, key, value)
        })
        this.$set(this.form, 'session_duration', data.session_duration)
      }
      this.formatFormItem()
      this.loading = false
    },

    formatFormItem() {
      Object.keys(this.form).forEach(key => {
        const value = this.form[key]
        this.handleChangeFormItem(value, key)
      })
    },

    async fetchSubmit() {
      this.$refs.FormBasic.validate(valid => {
        if (!valid) throw new Error()
      })

      this.$refs.FormDetail.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = { ... this.form }

      if (form.saas_app_type === 'aliyun_user') {
        delete form.attribute
      }

      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/zero.trust.app.add', form)
        } else {
          await this.Fetch.post('V4/zero.trust.app.save', form)
        }
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      if (this.mode === 'Create') {
        this.$confirm('您的应用还未配置任何规则，默认情况下YUNDUN-Access会阻止所有人访问该应用，是否立即添加规则？', '提示', {
          confirmButtonText: '添加规则',
          cancelButtonText: '无规则保存',
          type: 'warning'
        }).then(() => {
          this.$emit('open-settings')
        })
      }

      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
