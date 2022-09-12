<template>
  <yd-dialog v-loading :class="b()" :title="title" :visible.sync="open" :close-on-click-modal="true" aside aside-type="top">
    <div>
      <FormItemAction>
        <p>黑名单将被禁止访问此网站</p>
        <p>支持 CIDR 格式，IP 段可以用 - 隔开，如 1.1.1.1-1.1.1.255</p>
        <p>黑名单条数限制 200 条</p>
        <yd-form-select slot="action" v-model="form.status" :selects="addReserved(SELECT.SWITCH_M2, 'keep')"/>
      </FormItemAction>
      <el-form style="margin-top: 12px">
        <el-form-item>
          <yd-form-radio-button v-model="form.policy" :radios="SELECT.EDIT_TYPE_M2"/>
        </el-form-item>
      </el-form>
      <yd-table :open-min-height="false" add-btn @add-row="handleRowAdd">
        <el-table :data="list">
          <el-table-column label="类型" width="150">
            <template slot-scope="scope">
              <yd-form-select v-model="scope.row.type" :selects="SELECT.BLACK_LIST_TYPE"/>
            </template>
          </el-table-column>
          <el-table-column label="匹配内容">
            <template slot-scope="scope">
              <el-form :model="scope.row" :ref="`form-content-${scope.$index}`">
                <el-form-item v-if="scope.row.type === 'ip'" :rules="rules.ip" style="margin-bottom: 0" prop="content">
                  <el-input v-model="scope.row.content" placeholder="0.0.0.0"/>
                </el-form-item>
                <el-form-item v-else :rules="rules.url" style="margin-bottom: 0" prop="content">
                  <el-input v-model="scope.row.content" placeholder="以/开头"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" width="85">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRowDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </yd-table>
    </div>
    <div slot="footer">
      <el-button type="text" @click="handleClose">取消</el-button>
      <el-button :loading="loadingSubmit" type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import diloagBatch from '../../../../mixins/dialog-batch'
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import Table from '@/service/table'
import FormItemAction from '@/components/FormItem/FormItemAction'
import { validator } from '@/utils/form'
import RULE from '@/utils/verify'

const FORM_ROW = {
  type: 'ip',
  content: ''
}

const FORM = {
  status: 'keep',
  policy: 'append'
}

export default create({
  name: 'dialogSafeBlack',

  components: {
    FormItemAction
  },

  mixins: [diloagBatch],

  data() {
    return {
      Table,
      title: '访问控制 - 黑名单',
      open: false,
      loadingSubmit: false,
      list: [],
      form: deepClone(FORM),
      rules: {
        ip: [
          { required: true, trigger: 'blur', message: '请填写IP' },
          { validator: validator(RULE.ipReg, '格式有误') }
        ],
        url: [
          { required: true, trigger: 'blur', message: '请填写URL' },
          { validator: validator(RULE.slashBegin, '格式有误') }
        ]
      }
    }
  },

  methods: {
    handleOpen() {
      this.form = deepClone(FORM)
      this.list = []
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    handleRowDelete(scope) {
      const { $index } = scope
      this.list.splice($index, 1)
    },

    handleRowAdd() {
      this.list.push(deepClone(FORM_ROW))
    },

    async handleSubmit() {
      const form = deepClone(this.form)
      // if (form.status === 'keep') {
      //   this.handleClose()
      //   return
      // }
      form._policy = form.status

      const formData = {
        visit_limit_blacklist: {
          status: form.status,
          _policy: form.status
        }
      }

      // if (form.status === 'on') {
      const check = await Table.validate(this.list, ['content'], this.$refs)
      if (!check) return

      if (this.list.length > 0) {
        formData.visit_limit_blacklist_rules = {
          _policy: form.policy,
          rules: this.list
        }
      }
      // }

      const data = {
        id: '__RAW__',
        name: 'dialogSafeBlack',
        form: formData
      }
      this.$emit('submit', data)
    }
  }
})
</script>
