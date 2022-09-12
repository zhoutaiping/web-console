<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="800px"
    title-label="模板"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      style="padding: 12px"
      label-position="left"
      label-width="100px"
    >
      <el-form-item
        label="模板名称"
        prop="template_name"
      >
        <el-input
          v-model="form.template_name"
          style="width: 400px"
          placeholder="模板名称"
        />
      </el-form-item>

      <el-form-item
        label="域名"
        prop="http_host"
      >
        <DomianList
          ref="DomianList"
          v-model="form.http_host"
          style="width: 400px"
          @setHttpHost="setHttpHost"
        />
      </el-form-item>
      <el-form-item
        label="日志类型"
        prop="data_source"
      >
        <yd-form-select
          v-model="form.data_source"
          :selects="selectSource"
          style="width: 400px"
          @change="handleChangeDataSource"
        />
      </el-form-item>
      <template v-if="form.data_source && fieldsMap[form.data_source]">
        <el-form-item
          label="下载字段"
          prop="download_fields"
        >
          <SelectTransfer
            v-model="form.download_fields"
            :data="formatLabel(fieldsMap[form.data_source].download_fields)"
          />
        </el-form-item>
        <el-form-item
          label="限制条件"
          prop="search_terms"
        >
          <TableTerms
            v-model="form.search_terms"
            :selects="formatLabel(fieldsMap[form.data_source].search_terms)"
            style="width: 600px"
          />
        </el-form-item>
      </template>
      <el-form-item
        label="模板分组"
        prop="group_name"
      >
        <el-autocomplete
          v-model="form.group_name"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { formatLabel } from '@/utils/form'
import SelectTransfer from '@/components/Select/SelectTransfer'
import TableTerms from './TableTerms'
import DomianList from './DomianList'
import { deepClone } from '../../../../../utils'

export default createDialog({
  components: { SelectTransfer, TableTerms, DomianList },

  data() {
    return {
      formDefault: {
        template_name: '',
        data_source: '',
        download_fields: [],
        search_terms: {},
        http_host: [],
        group_id: '',
        status: 1,
        domain_select_type: 0
      },
      formRules: {
        template_name: { required: true, message: '请输入模板名称' },
        data_source: { required: true, message: '请选择日志类型' },
        download_fields: { required: true, message: '请选择' },
        search_terms: [],
        http_host: { required: true, message: '请选择域名' },
        group_name: { required: true, message: '请输入' }
      },
      fieldsMap: [],
      selectGroup: [],
      selectGroupMap: {},
      selectSource: []
    }
  },

  methods: {
    handleChangeDataSource() {
      this.form.download_fields = []
      this.form.search_terms = {}
    },

    formatLabelKey(list) {
      return list.map(_ => {
        return {
          label: _,
          key: _
        }
      })
    },

    formatLabel,

    querySearch(queryString, cb) {
      var selectGroup = this.selectGroup
      cb(queryString ? selectGroup.filter(_ => _.value.includes(queryString)) : selectGroup)
    },
    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.$refs.Form.resetFields()
      if (form.id) {
        this.form = Object.assign(deepClone(this.formDefault), form)
      } else {
        this.form = Object.assign({}, deepClone(this.formDefault))
      }
      this.fetchFields()
      this.fetchGroups()
      this.$refs.DomianList && this.$refs.DomianList.init(this.form.http_host)
    },

    async fetchFields() {
      try {
        const res = await this.Fetch.get('V4/soc.log.download.fields', {})
        delete res._status
        const selectSource = []
        Object.keys(res).forEach(key => {
          const item = res[key]
          selectSource.push({
            value: key,
            label: item.name
          })
        })
        this.selectSource = selectSource
        this.fieldsMap = res
      } catch (error) {
        return
      }
    },

    async fetchGroups() {
      try {
        const res = await this.Fetch.get('V4/soc.log.download.template.group.all', {})
        delete res._status
        this.selectGroup = res.map(_ => {
          this.selectGroupMap[_.group_name] = _.group_id
          return {
            value: _.group_name
          }
        })
      } catch (error) {
        return
      }
    },
    setHttpHost(data) {
      const { domain_select_type } = data
      this.form.domain_select_type = domain_select_type
      this.$refs.Form.validateField('http_host')
    },
    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      if (this.form.http_host.length === 0) {
        this.$message.warning('域名不能为空！')
        throw new Error()
      }
      const form = {
        ...this.form
      }

      if (this.selectGroupMap[form.group_name]) {
        form.group_id = this.selectGroupMap[form.group_name]
        delete form.group_name
      }
      // if (Object.keys(form.search_terms).length === 0) {
      //   this.$message.warning('请新增限制条件!')
      //   throw new Error()
      // }
      form.search_terms['http_host'] = form.http_host || []
      delete form.http_host

      try {
        if (this.mode === 'Create') {
          await this.Fetch.post('V4/soc.log.download.template.add', form)
        } else {
          await this.Fetch.post('V4/soc.log.download.template.save', form)
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
