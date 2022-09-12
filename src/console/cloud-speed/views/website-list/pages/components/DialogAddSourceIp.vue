<template>
  <yd-dialog
    v-loading
    :class="b()"
    :title="isEdit ? '编辑源站' : '新增源站'"
    :visible.sync="open"
    :close-on-click-modal="true"
    aside
    aside-type="top"
  >
    <yd-alert style="margin-top:16px; margin-bottom: 16px">
      协议跟随：节点取源时所用协议和客户端访问协议保持一致，源站需要同时支持80和443端口，否则有可能造成节点取源失败
    </yd-alert>
    <el-form
      label-position="top"
      class="el-form--medium"
    >
      <el-form-item label="协议类型">
        <yd-form-radio
          v-model="form.protocol"
          :radios="SELECT.PROTOCOL_TYPE"
          @change="handleProtocolChange"
        />
      </el-form-item>
      <el-form-item label="监听端口">
        <yd-form-select
          v-model="form.listen_port"
          :selects="SELECT.PORT_80443"
          disabled
        />
      </el-form-item>
      <el-form-item label="取源协议">
        <yd-form-radio
          v-model="form.get_source_protocol"
          :radios="SELECT.SOURCE_PROTOCOL"
        />
      </el-form-item>
      <el-form-item label="负载均衡方式">
        <yd-form-radio
          v-model="form.load_balance"
          :radios="SELECT.BALANCING_TYPE"
        />
      </el-form-item>
      <el-form-item label="回源设置">
        <yd-form-radio
          v-model="form.back_source_type"
          :radios="SELECT.RETURN_SETTING"
        />
      </el-form-item>

      <el-form-item label="线路设置">
        <yd-table
          :add-btn="form.back_source_type === 0"
          :open-min-height="false"
          @add-row="handleItemAdd"
        >
          <el-table
            :data="form.source_ips"
            style="width: 100%"
          >
            <el-table-column :label="form.back_source_type === 0 ? 'IP' : '域名'">
              <template slot-scope="scope">
                <el-form
                  :model="scope.row"
                  :ref="`formValue-${scope.$index}`"
                >
                  <el-form-item
                    v-if="form.back_source_type === 0"
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
                      placeholder="如 www.demo.com"
                    />
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
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
              v-if="form.back_source_type === 0"
              label="线路"
              width="120"
            >
              <template slot-scope="scope">
                <yd-form-select
                  v-model="scope.row.view"
                  :selects="SELECT.IP_VIEW"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="form.back_source_type === 0"
              label="优先级"
              width="85"
            >
              <template slot-scope="scope">
                <yd-form-select
                  v-model="scope.row.priority"
                  :selects="SELECT.PRIORITY_RATE"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              label="操作"
              width="85"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="scope.$index === 0"
                  type="text"
                  @click="handleItemDelete(scope.$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </yd-table>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="text"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="submitLoading"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import SELECT from '../../../../constant/select'
import RULE from '@/utils/verify'
import { validator } from '@/utils/form'

const FORM_ITEM = {
  value: '',
  port: '',
  view: 'primary',
  priority: 1
}

const FORM_DEFAULT = {
  protocol: 0,
  listen_port: 80,
  source_ips: [deepClone(FORM_ITEM)],
  get_source_protocol: 0,
  load_balance: 1,
  back_source_type: 0
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

export default create({
  name: 'dialogAddSourceIp',

  data() {
    return {
      title: '新增源站',
      open: false,
      isEdit: false,
      SELECT,
      form: deepClone(FORM_DEFAULT),
      submitLoading: false,
      rules: {
        ip: [
          { required: true, trigger: 'blur', message: '请填写IP' },
          { validator: validatorValue() }
        ],
        url: [
          { required: true, trigger: 'blur', message: '请填写' },
          { validator: validator(RULE.domain, '格式有误') }
        ],
        port: [
          { required: true, trigger: 'blur', message: '请填写' },
          { validator: validator(RULE.port, '格式有误') }
        ]
      }
    }
  },

  methods: {
    handleProtocolChange(val) {
      this.form.listen_port = val === 0 ? 80 : 443
    },

    handleOpen(form) {
      this.resetTable()
      this.form = form ? deepClone(form) : deepClone(FORM_DEFAULT)
      this.isEdit = !!form
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    handleItemDelete(index) {
      const list = this.form.source_ips
      list.splice(index, 1)
    },

    handleItemAdd() {
      const list = this.form.source_ips
      list.push(deepClone(FORM_ITEM))
    },

    resetTable() {
      const list = this.form.source_ips
      for (let i = 0; i < list.length; i++) {
        this.resetItem(i)
      }
    },

    resetItem(index) {
      this.$refs[`formValue-${index}`] && this.$refs[`formValue-${index}`].resetFields()
      this.$refs[`formPort-${index}`] && this.$refs[`formPort-${index}`].resetFields()
    },

    checkItem(index) {
      try {
        // 验证匹配目标
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
    // 检查是否包含主线路
    checkListMain() {
      const list = this.form.source_ips
      return list.map(_ => _.view).includes('primary')
    },

    async handleSubmit() {
      const form = deepClone(this.form)

      const list = form.source_ips
      for (let i = 0; i < list.length; i++) {
        const ret = await this.checkItem(i)
        if (!ret) return
      }

      const type = form.back_source_type === 0 ? 'A' : 'CNAME'
      list.forEach(item => {
        item.type = type
      })

      if (list.length > 0) {
        if (!this.checkListMain()) {
          this.$message.warning('必须包含一条主线路')
          return
        }
      }

      this.$emit('submit', form)
    }
  }
})
</script>
