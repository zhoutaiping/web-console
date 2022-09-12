<template>
  <div>
    <yd-form-radio-button
      v-if="policy === 'rewrite' && back_source_type === 0 && isBatch"
      v-model="form._psource"
      :radios="SELECT.EDIT_TYPE_M2"
    />
    <DmTable
      border
      add-button
      style="margin-top: 12px"
      @click-add-button="handleRowAdd"
    >
      <el-table :data="form.list">
        <el-table-column :label="labelValue">
          <template slot-scope="scope">
            <el-form
              :model="scope.row"
              :ref="`formValue-${scope.$index}`"
            >
              <el-form-item
                v-if="back_source_type === 'keep'"
                :rules="rules.value"
                style="margin-bottom: 0"
                prop="value"
              >
                <el-input
                  v-model="scope.row.value"
                  :placeholder="`如${'www.demo.com'}`"
                />
              </el-form-item>
              <el-form-item
                v-else-if="back_source_type === 0"
                :rules="rules.ip"
                style="margin-bottom: 0"
                prop="value"
              >
                <el-input
                  v-model="scope.row.value"
                  placeholder="支持IPv4、IPv6格式"
                />
              </el-form-item>
              <el-form-item
                v-else
                :rules="rules.url"
                style="margin-bottom: 0"
                prop="value"
              >
                <el-input
                  v-model="scope.row.value"
                  :placeholder="`如${'www.demo.com'}`"
                />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          v-if="portVisible"
          label="端口"
          width="120"
        >
          <template slot-scope="scope">
            <el-form
              :model="scope.row"
              :rules="rules"
              :ref="`formPort-${scope.$index}`"
            >
              <el-form-item
                style="margin-bottom: 0"
                prop="port"
              >
                <el-input
                  v-model="scope.row.port"
                  placeholder="端口"
                />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="线路"
          width="120"
        >
          <template slot-scope="scope">
            <el-tooltip
              :disabled="scope.$index > 0"
              class="item"
              effect="dark"
              content="至少需要一条主线路"
              placement="top"
            >
              <yd-form-select
                :disabled="scope.$index === 0"
                v-model="scope.row.view"
                :selects="SELECT.IP_VIEW"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="back_source_type === 0"
          label="优先级"
          width="150"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.mx"
              :min="1"
              :max="50"
              style="width: 120px"
              controls-position="right"
              placeholder="MX"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="50"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="scope.$index === 0"
              type="text"
              @click="handleRowDelete(scope)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { validator } from '@/utils/form'
import RULE from '@/utils/verify'
import SELECT from '../../../constant/select'

function portVaildate(rule, value, callback) {
  if (!value) callback(new Error('请填写'))
  value = parseInt(value, 10)
  if (value < 1 || value > 65535) {
    callback(new Error('端口有误'))
  }
  callback()
}

const FORM_ROW = {
  value: '',
  port: '',
  view: 'primary',
  mx: 1
}

const FORM = {
  _psource: 'append',
  list: [deepClone(FORM_ROW)]
}

function validatorValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    if (RULE.ipReg.test(value) || RULE.Ipv6Reg.test(value) || RULE.domain.test(value)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  return _validator
}

export default {
  props: {
    back_source_type: [String, Number],
    policy: String,
    loading: Boolean,
    isBatch: Boolean,
    portVisible: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      SELECT,
      form: deepClone(FORM),
      rules: {
        ip: [
          { required: true, trigger: 'blur', message: '请填写IP' },
          { validator: validatorValue() }
        ],
        url: [
          { required: true, trigger: 'blur', message: '请填写' },
          { validator: validator(RULE.domain, '格式有误') }
        ],
        value: [
          { required: true, trigger: 'blur', message: '请填写' },
          { validator: validatorValue() }
        ],
        port: { validator: portVaildate, trigger: 'blur' }
      }
    }
  },

  computed: {
    labelValue() {
      const { back_source_type } = this
      if (back_source_type === 'keep') {
        return '域名/IP'
      } else if (back_source_type === 0) {
        return 'IP'
      } else {
        return '域名'
      }
    }
  },

  methods: {
    setList(list) {
      this.form.list = list
    },

    checkItem(index) {
      try {
        this.$refs[`formValue-${index}`].validate(valid => {
          if (!valid) throw new Error()
        })
        this.$refs[`formPort-${index}`].validate(valid => {
          if (!valid) throw new Error()
        })
      } catch (e) {
        return false
      }
      return true
    },

    handleRowInit() {
      this.form = deepClone(FORM)
      this.form.list = [deepClone(FORM_ROW)]
    },

    handleInit() {
      this.form = [deepClone(FORM_ROW)]
    },

    async handleCheck() {
      const list = this.form.list
      for (let i = 0; i < list.length; i++) {
        const ret = await this.checkItem(i)
        if (!ret) return false
      }
      return true
    },

    handleRowAdd() {
      this.form.list.push(deepClone(FORM_ROW))
    },

    handleRowDelete(scope) {
      const { $index } = scope
      this.form.list.splice($index, 1)
    }
  }
}
</script>
