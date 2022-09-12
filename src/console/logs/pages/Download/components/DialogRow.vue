<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="750px"
    title-label="任务"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 关联模板时只支持关联已启用的模板<br>
      2. 关联模板后日志类型、下载字段、限制条件将无法编辑，如需更改请至对应模板中编辑
    </DmAlert>
    <el-form
      :model="form"
      label-position="left"
      label-width="100px"
    >
      <el-form-item
        label="任务名称"
        prop="task_name"
      >
        <el-input
          v-model="form.task_name"
          placeholder="任务名称"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox
          :true-label="1"
          :false-label="0"
          v-model="form.is_use_template"
          @change="handleChangeUseTemplate"
        >关联模板
        </el-checkbox>
      </el-form-item>
      <el-form-item
        v-if="form.is_use_template"
        label="选择模板"
      >
        <yd-form-select
          v-model="form.group_id"
          :selects="selectGroup"
          style="width: 140px; margin-right: 8px"
        />
        <yd-form-select
          v-if="form.group_id"
          v-model="form.template_id"
          :selects="selectTemplate.filter(_ => _.group_id === form.group_id)"
          style="width: 200px"
          @change="handleChangeTemplate"
        />
      </el-form-item>
      <el-form-item
        v-if="!form.is_use_template"
        label="域名"
        prop="http_host"
      >
        <DomianList
          ref="DomianList"
          v-model="form.http_host"
          style="width: 400px"
        />
      </el-form-item>
      <template v-if="!form.is_use_template || form.template_id">
        <el-form-item
          label="日志类型"
          prop="data_source"
        >
          <yd-form-select
            :disabled="!!form.template_id"
            v-model="form.data_source"
            :selects="selectSource"
            style="width: 400px"
            @change="handleChangeDataSource"
          />
        </el-form-item>
        <template v-if="(form.data_source && fieldsMap[form.data_source])">
          <el-form-item
            label="下载字段"
            prop="download_fields"
          >
            <ColumnListMore
              v-if="form.template_id"
              v-model="form.download_fields"
            />
            <SelectTransfer
              v-else
              v-model="form.download_fields"
              :data="formatLabel(fieldsMap[form.data_source].download_fields)"
            />
          </el-form-item>
          <el-form-item
            label="限制条件"
            prop="search_terms"
          >
            <template v-if="form.template_id">
              {{ form.search_terms }}
            </template>
            <TableTerms
              v-else
              ref="TableTerms"
              v-model="form.search_terms"
              :selects="formatLabel(fieldsMap[form.data_source].search_terms)"
              style="width: 580px"
            />
          </el-form-item>
        </template>
      </template>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="form.timerange"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="文件类型">
        <yd-form-radio
          v-model="form.file_type"
          :radios="selectFileType"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { formatLabel } from '@/utils/form'
import SelectTransfer from '@/components/Select/SelectTransfer'
import ColumnListMore from '@/components/Column/ColumnListMore'
import moment from 'moment'
import TableTerms from '../../Template/components/TableTerms'
import DomianList from '../../Template/components/DomianList'
export default createDialog({
  components: { TableTerms, SelectTransfer, ColumnListMore, DomianList },

  data() {
    return {
      formDefault: {
        task_name: '',
        is_use_template: 0,
        template_id: '',
        data_source: '',
        download_fields: [],
        search_terms: {},
        http_host: [],
        file_type: 'csv',
        group_id: '',
        timerange: []
      },
      selectGroup: [],
      selectTemplate: [],
      selectSource: [],
      fieldsMap: {},
      selectFileType: [
        // {
        //   label: 'XLS',
        //   value: 'xls'
        // },
        {
          label: 'CSV',
          value: 'csv'
        },
        {
          label: 'JSON',
          value: 'json'
        }
      ],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectData = minDate.getTime()
          if (maxDate) {
            this.selectData = ''
          }
        },
        disabledDate: (time) => {
          const dateX = moment(`${moment().format('YYYY-MM-DD')} 23:59:59`, 'YYYY-MM-DD HH:mm:ss').format('x')
          return time.getTime() > (dateX) || time.getTime() < (Date.now() - 86400000 * 180)
        }
      }
    }
  },

  methods: {
    handleChangeUseTemplate(val) {
      this.form.group_id = ''
      this.form.template_id = ''
      this.form.data_source = ''
    },

    handleChangeTemplate(value) {
      const item = this.selectTemplate.find(_ => _.value === value)
      if (item) Object.assign(this.form, item.form)
    },

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

    initOptions(form, options) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.fetchTemplates()
      this.fetchFields()
      this.$refs.DomianList && this.$refs.DomianList.init([])
    },
    async fetchFields() {
      const res = await this.Fetch.get('V4/soc.log.download.fields')
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
    },

    async fetchTemplates() {
      const res = await this.Fetch.get('V4/soc.log.download.template.all')
      delete res._status

      const selectGroup = []
      const selectTemplate = []
      Object.keys(res).forEach(key => {
        const item = res[key]
        selectGroup.push({
          value: item.group_id,
          label: item.group_name
        })
        selectTemplate.push(...item.templates.map(_ => {
          return {
            value: _.template_id,
            label: _.template_name,
            group_id: item.group_id,
            form: {
              search_terms: _.search_terms,
              download_fields: _.download_fields,
              data_source: _.data_source
            }
          }
        }))
      })

      this.selectGroup = selectGroup
      this.selectTemplate = selectTemplate

      if (this.mode === 'Edit' && this.form.template_id) this.handleChangeTemplate(this.form.template_id)
    },

    async fetchSubmit() {
      let form = {
        ...this.form
      }
      if (!form.is_use_template && form.http_host.length === 0) {
        this.$message.warning('域名不能为空！')
        throw new Error()
      }
      // if (Object.keys(form.search_terms).length === 0) {
      //   this.$message.warning('限制条件不能为空!')
      //   throw new Error()
      // }
      if (!form.is_use_template) {
        form.search_terms.http_host = form.http_host
      }
      delete form.http_host

      const [start_time, end_time] = form.timerange
      form = {
        ...form,
        start_time,
        end_time
      }
      try {
        await this.Fetch.post('V4/soc.log.download.task.add', form)
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
