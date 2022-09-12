<template>
  <div>
    <template v-if="form.status === 'on'">
      <yd-form-radio-button
        v-if="isBatch"
        :radios="SELECT.EDIT_TYPE_M2"
        v-model="formBatch._policy"
        style="margin-bottom: 12px"
      />
      <DmTable
        add-button
        border
        @click-add-button="handleAdd"
      >
        <el-table :data="list">
          <el-table-column
            width="300"
            label="类型"
          >
            <template slot-scope="scope">
              <yd-form-select
                v-model="scope.row.typeRaw"
                :selects="SELECT.HEADER_LIST"
                :style="{ width: scope.row.typeRaw === 'custom' ? '100px' : '100%'}"
                @change="value => handleChangeTypeRaw(value, scope.row)"
              />
              <el-input
                v-if="scope.row.typeRaw === 'custom'"
                v-model="scope.row.type"
                style="width: 170px; display: inline-block; margin-left: 8px"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="匹配内容（多个之间以 ',' 隔开）"
            prop="content"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.content"
                :placeholder="scope.row.type | labelView(SELECT.HEADER_LIST, 'tips', '')"
              />
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="备注"
            prop="remark"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                placeholder="备注"
              />
            </template>
          </el-table-column>
          <el-table-column
            width="60"
            align="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowDelete(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </template>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { addReserved } from '@/utils/form'
import baseMixins from './base'
import SELECT from '../../constant/select'

const FORM_ROW = {
  type: '',
  content: '',
  remark: ''
}

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: SELECT.SWITCH_M2
      },
      formDefault: {
        status: 'off'
      },
      formBatch: {
        _policy: 'append'
      },
      list: []
    }
  },

  methods: {
    handleChangeTypeRaw(value, row) {
      row.type = value === 'custom' ? '' : value
    },

    setStatus(value) {
      this.form.status = value
    },

    handleRowDelete(scope) {
      const { $index } = scope
      const list = this.list
      list.splice($index, 1)
    },

    setForm(form = {}) {
      const { resp_headers = {}, resp_headers_rules = [] } = form
      resp_headers_rules.forEach(item => {
        item.typeRaw = SELECT.HEADER_LIST.map(_ => _.value).includes(item.type) ? item.type : 'custom'
      })
      this.form = {
        ...this.formDefault,
        ...resp_headers
      }
      this.list = resp_headers_rules
    },

    getForm() {
      const form = this.form
      const list = this.list
      const rules = []

      list.forEach(item => {
        const { type, content, remark } = item
        rules.push({
          type,
          content,
          remark
        })
      })

      const formData = {
        resp_headers: {
          ...form,
          _policy: form.status
        }
      }

      if (this.isBatch) {
        formData.resp_headers_rules = {
          rules,
          _policy: this.formBatch._policy
        }
      } else {
        formData.resp_headers_rules = rules
      }

      return formData
    },

    handleAdd() {
      this.list.push(deepClone(FORM_ROW))
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
