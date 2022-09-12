<style lang="scss">
.SelectType {
  .el-select-dropdown__item.is-disabled {
    a {
      color: #ccc !important;
    }
  }
}
.RuleToolTip {
  border-color: $--color-text-secondary !important;
  border-radius: 0px;
  color: $--color-text-regular;
}

.yd-dialog--policy {
  .yd-icon-info {
    vertical-align: top;
    line-height: 12px;
    margin-bottom: 5px;
    float: left;
  }
}

.tooltip--tips {
  .tooltip__title {
    margin-bottom: 10px;
  }
  .item {
    margin-bottom: 5px;
  }
  .highlight {
    color: #fff;
    background: rgb(253, 129, 56);
    padding: 1px 3px;
  }
}
</style>

<template>
  <yd-dialog
    v-loading
    :visible.sync="open"
    :close-on-click-modal="true"
    :title="id ? '编辑策略' : '新增策略'"
    class="yd-dialog--policy"
    aside
    width="1050px"
    aside-type="top"
  >
    <yd-scroll>
      <yd-alert
        border-bottom
        style="margin-top: 20px; margi-bottom: 20px"
      >
        <div>
          1. 匹配类型中 IP 和区域为
          <strong>互斥</strong> 关系，同一条规则不能同时启用 <br> 2. 同一条规则中多个匹配条件为
          <strong>“与”</strong> 逻辑，即必须多个条件同时满足才算匹配中规则<br> 3. 匹配目标具有多个时，用
          <strong>“|”</strong> 隔开<br> 4. 同一条规则最多
          <strong>5个</strong> 匹配条件组合
        </div>
      </yd-alert>
      <yd-form
        ref="form"
        :options="form"
        :rules="form.$rules"
        label-position="top"
      >
        <el-form-item>
          <div>
            <span class="el-form-item__label">匹配条件</span>
          </div>
          <!-- 策略选择 -->
          <DmTable
            :add-button-disabled="disabledAdd"
            add-button
            border
            @click-add-button="handleRuleItemAdd"
          >
            <template slot="btnAdd">
              <el-tooltip
                :disabled="!containMustBeLast"
                content="TCP响应报文大小仅可作为条件组合的最后一个匹配类型"
                placement="top"
              >
                <span>
                  <yd-icon name="el-icon-plus" /> 新增
                </span>
              </el-tooltip>
            </template>
            <el-table
              :data="formRules"
              empty-text=" "
            >
              <el-table-column
                width="260px"
                label="匹配类型"
              >
                <template slot-scope="scope">
                  <yd-form
                    :model="scope.row.target"
                    :rules="scope.row.target.$rules"
                    :ref="'add-rules-type-' + scope.row.type"
                    mode="in-table"
                  >
                    <el-form-item class="yd-form-item--flex">
                      <el-select
                        v-model="scope.row.type"
                        :disabled="scope.$index !== formRules.length - 1"
                        placeholder="请选择"
                        popper-class="SelectType"
                        @change="handleTypeChange(scope.row)"
                      >
                        <el-option
                          v-for="item in MATCHING_TCP_TYPE"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          :disabled="!item.show && scope.row.type !== item.value"
                        >
                          <el-tooltip
                            :content="tipsMap[item.value]"
                            :visible-arrow="false"
                            :disabled="!tipsMap[item.value]"
                            effect="light "
                            placement="right"
                            popper-class="RuleToolTip"
                          >
                            <a
                              :disabled="item.disabled"
                              type="text"
                              style="color: #606266; text-align: left; display: block"
                            >{{ item.label }}</a>
                          </el-tooltip>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </yd-form>
                </template>
              </el-table-column>
              <el-table-column
                width="150px"
                label="逻辑"
              >
                <template slot-scope="scope">
                  <yd-form-select
                    v-model="scope.row.logic"
                    :selects="MATCHING_TCP_LOGIC[scope.row.type]"
                  />
                </template>
              </el-table-column>
              <el-table-column label="匹配目标">
                <template slot-scope="scope">
                  <yd-form
                    :options="scope.row.target"
                    :ref="'add-rules-' + scope.row.type"
                    mode="in-table"
                    @submit.native.prevent
                  >
                    <!-- IP -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.IP && MATCHING_TCP_TYPE_VAR.IP"
                      prop="ip"
                    >
                      <!-- IP LIST -->
                      <template v-if="['in', 'not_in'].includes(scope.row.logic)">
                        <yd-form-select
                          v-model="scope.row.target.ip"
                          :selects="selectIpList"
                          aria-placeholder="选择的IP列表"
                          multiple
                          collapse-tags
                          style="width: 280px; margin-right: 12px"
                        />
                        <router-link
                          :to="{
                            name: 'user-center.router.ipList'
                        }">
                          前往配置
                        </router-link>
                      </template>
                      <template v-else-if="['in_recent', 'not_in_recent'].includes(scope.row.logic)">
                        <el-input disabled />
                      </template>
                      <yd-input-multiple
                        v-else
                        v-model="scope.row.target.ip"
                        :rules="FORM.FORM_TARGET_RULES.ip"
                        placeholder="请输入单个 IP 或 IP / 掩码如 (1.1.1.1/24)"
                        placeholder-item="1.1.1.1|2.2.2.0/24"
                      >
                        <span slot="tips">（多个 IP 推荐使用 CIDR 格式 1.1.1.1/24）</span>
                      </yd-input-multiple>
                    </el-form-item>
                    <!-- 区域 -->
                    <el-form-item v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.Region && MATCHING_TCP_TYPE_VAR.Region">
                      <InputArea v-model="scope.row.target.region" />
                    </el-form-item>
                    <!-- IP请求频率 -->
                    <el-form-item v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.IP_rate_limit && MATCHING_TCP_TYPE_VAR.IP_rate_limit">
                      <el-row :gutter="12">
                        <el-col :span="12">
                          <el-form-item
                            :rules="FORM_TCP_TARGET_RULE.ip_rate_limit.interval"
                            class="hide-error"
                            prop="ip_rate_limit.interval"
                          >
                            <el-input
                              v-model="scope.row.target.ip_rate_limit.interval"
                              placeholder="1 - 20"
                            >
                              <template slot="append">秒</template>
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item
                            :rules="FORM_TCP_TARGET_RULE.ip_rate_limit.reqs"
                            class="hide-error"
                            prop="ip_rate_limit.reqs"
                          >
                            <el-input
                              v-model="scope.row.target.ip_rate_limit.reqs"
                              placeholder="1 - 1000"
                            >
                              <template slot="append">次</template>
                            </el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <!-- IP类型 -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.IP_type && MATCHING_TCP_TYPE_VAR.IP_type"
                      prop="tcp_ip_type"
                    >

                      <yd-form-select
                        :selects="SELECT_TCP_DATA.IP_TYPE"
                        v-model="scope.row.target.tcp_ip_type"
                        multiple
                        collapse-tags
                        style="width: 100%"
                      />
                    </el-form-item>
                    <!-- TCP服务端口 -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.TCPServicePort && MATCHING_TCP_TYPE_VAR.TCPServicePort"
                      prop="tcp_service_port"
                    >
                      <yd-form-select
                        v-model="scope.row.target.tcp_service_port"
                        :selects="listPort"
                        multiple
                        collapse-tags
                      />
                    </el-form-item>
                    <!-- TCP新建连接数 -->
                    <el-form-item v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.TCPNewConnections && MATCHING_TCP_TYPE_VAR.TCPNewConnections">
                      <el-row :gutter="12">
                        <el-col :span="12">
                          <el-form-item
                            :rules="FORM_TCP_TARGET_RULE.tcp_new_connect.interval"
                            prop="tcp_new_connect.interval"
                            class="hide-error"
                          >
                            <el-input
                              v-model="scope.row.target.tcp_new_connect.interval"
                              placeholder="时间间隔"
                            >
                              <template slot="append">秒</template>
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item
                            :rules="FORM_TCP_TARGET_RULE.tcp_new_connect.reqs"
                            prop="tcp_new_connect.reqs"
                          >
                            <el-input
                              v-model="scope.row.target.tcp_new_connect.reqs"
                              placeholder="连接数"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <!-- TCP总连接数 -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.TCPTotalConnections && MATCHING_TCP_TYPE_VAR.TCPTotalConnections"
                      :rules="FORM_TCP_TARGET_RULE.tcp_total_connect.total"
                      prop="tcp_total_connect.total"
                    >
                      <el-input
                        v-model="scope.row.target.tcp_total_connect.total"
                        placeholder="TCP总连接数"
                      />
                    </el-form-item>
                    <!-- TCP报文头 -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.TCPPacketHead && MATCHING_TCP_TYPE_VAR.TCPPacketHead"
                      :rules="scope.row.logic.includes('string') ? RULES.tcp_packet_string_head : RULES.tcp_packet_head"
                      prop="tcp_packet_head"
                    >
                      <yd-input-multiple
                        :rules="scope.row.logic.includes('string') ? RULES.tcp_packet_string_head : RULES.tcp_packet_head"
                        v-model="scope.row.target.tcp_packet_head"
                        :placeholder="scope.row.logic.includes('string') ? '如abcd' : '报文的十六进制表示，如00 0E FC 00'"
                      />
                    </el-form-item>
                    <!-- TCP报文大小 -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.TCPPacketSize && MATCHING_TCP_TYPE_VAR.TCPPacketSize"
                      :rules="FORM_TCP_TARGET_RULE.tcp_packet_size.size"
                      class="hide-error"
                      prop="tcp_packet_size.size"
                    >
                      <el-input
                        v-model="scope.row.target.tcp_packet_size.size"
                        placeholder="TCP报文大小（单位：字节）"
                      >
                        <template slot="append">字节</template>
                      </el-input>
                    </el-form-item>
                    <!-- TCP响应报文大小 -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.TCPResponsePacketSize && MATCHING_TCP_TYPE_VAR.TCPResponsePacketSize"
                      :rules="FORM_TCP_TARGET_RULE.tcp_response_packet_size.size"
                      class="hide-error"
                      prop="tcp_response_packet_size.size"
                    >
                      <el-input
                        v-model="scope.row.target.tcp_response_packet_size.size"
                        placeholder="TCP响应报文大小（单位：字节）"
                      >
                        <template slot="append">字节</template>
                      </el-input>
                    </el-form-item>
                    <!-- TCP连接类型 -->
                    <el-form-item
                      v-if="scope.row.type === MATCHING_TCP_TYPE_VAR.TCPConnectionType && MATCHING_TCP_TYPE_VAR.TCPConnectionType"
                      prop="tcp_connection_type"
                    >
                      <el-checkbox-group v-model="scope.row.target.tcp_connection_type">
                        <el-checkbox
                          v-for="item in CLOUD_WALL.TCP_CONNECTION_TYPE"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                        >{{ item.label }}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </yd-form>
                </template>
              </el-table-column>
              <el-table-column
                width="60"
                align="right"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    :disabled="scope.$index === 0 && formRules.length === 1"
                    type="text"
                    @click="handleItemDlete(scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <template slot="add-row-text">
              （还可添加 {{ MAX_RULE - formRules.length }} 条）
            </template>
          </DmTable>
        </el-form-item>
        <el-form-item label="处置方式">
          <yd-form-radio
            v-model="form.action"
            :radios="HANDLE_TCP_TYPE"
          />
        </el-form-item>
        <!-- 封禁 -->
        <el-form-item v-if="form.action === CLOUD_WALL.HANDLE_TYPE_VAR.BLOCK">
          <el-form-item
            v-if="form.time_unit === 'second'"
            :rules="FORM.FORM_POLICY_RULE.intval"
            prop="interval"
            style="display: inline-block; width: 150px;"
          >
            <el-input
              v-model="form.interval"
              placeholder="1 - 3600"
            />
          </el-form-item>
          <el-form-item
            v-if="form.time_unit === 'minute'"
            :rules="FORM.FORM_POLICY_RULE.intvalMinute"
            prop="interval"
            style="display: inline-block; width: 150px;"
          >
            <el-input
              v-model="form.interval"
              placeholder="1 - 60"
            />
          </el-form-item>
          <el-form-item
            v-if="form.time_unit === 'hour'"
            :rules="FORM.FORM_POLICY_RULE.intvalHour"
            prop="interval"
            style="display: inline-block; width: 150px;"
          >
            <el-input
              v-model="form.interval"
              placeholder="1 - 24"
            />
          </el-form-item>
          <el-form-item
            v-if="form.time_unit === 'day'"
            :rules="FORM.FORM_POLICY_RULE.intvalDay"
            prop="interval"
            style="display: inline-block; width: 150px;"
          >
            <el-input
              v-model="form.interval"
              placeholder="1 - 7"
            />
          </el-form-item>
          <el-select
            v-model="form.time_unit"
            style="width:100px; margin-left: 10px"
            placeholder="请选择"
            @change="form.interval = ''"
          >
            <el-option
              v-for="item in CLOUD_WALL.TIME_TYPE"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </yd-form>
    </yd-scroll>
    <div slot="footer">
      <div class="pull-left">
        <el-button
          type="text"
          @click="handleClose"
        >取消</el-button>
        <el-button
          :loading="form.$processing"
          type="primary"
          @click="handleSave(id)"
        >保存</el-button>
      </div>
    </div>
  </yd-dialog>
</template>

<script>
import { mapState } from 'vuex'
import Form from '@/service/form'
import { selectExclude } from '@/utils/form'
import * as CLOUD_WALL from '@/constants/cloud-wall'
import * as FORM from '../../../constants/form'
import { FORM_TCP_TARGET_RULE } from '../../../constants/rule'
import { deepClone } from '@/utils'
import { arrTest } from '@/utils/array'
import RULE from '@/utils/verify'
import YdPopupCheck from '@/components/Popup/PopupCheck'
import InputArea from '@/components/Input/InputArea'
import YdFormItemArea from '@/components/FormItem/FormItemArea'
import YdFormItemAreaCheck from '@/components/FormItem/FormItemAreaCheck'
import FormItemHandle from '../../../components/Form/FormItemHandle'
import { checkFormRule } from '../../../common/utils'

function tcpHeadValidate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  for (let i = 0; i < value.length; i++) {
    const item = value[i]
    const list = item.split(' ').filter(_ => _)
    if (!arrTest(list, RULE.hex)) {
      callback(new Error('填写不正确'))
    }
  }

  callback()
}

function tcpHeadStringValidate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }
  callback()
}

export default {
  components: {
    YdPopupCheck,
    InputArea,
    YdFormItemArea,
    YdFormItemAreaCheck,
    FormItemHandle
  },

  data() {
    return {
      id: null,
      MAX_RULE: 5,
      finish: false,
      CLOUD_WALL,
      FORM,
      open: false,
      form: new Form(FORM.FORM_TCP_POLICY, FORM.FORM_POLICY_RULE),
      formRules: [],
      FORM_TCP_TARGET_RULE,
      listPort: [],
      HANDLE_TCP_TYPE: [],
      selectIpList: [],
      RULES: {
        tcp_packet_head: { validator: tcpHeadValidate, trigger: 'blur' },
        tcp_packet_string_head: { validator: tcpHeadStringValidate, trigger: 'blur' }
      },
      tipsMap: {
        ip: '访问云安全节点的客户端IP，即$remote_addr',
        region: '访问云安全节点的请求方所在区域，支持大洲、大区、国家、省份设置',
        tcp_ip_type: '访问云安全节点的客户端IP的属性，如搜索引擎、合作伙伴、IDC、僵尸网络等',
        tcp_packet_head: 'TCP首包内容，支持二进制或字符串匹配',
        tcp_service_port: '请求的云安全节点的服务器端口，如80，443',
        ip_rate_limit: '客户端发出请求的频率',
        tcp_connection_type: '空连接、慢连接',
        tcp_packet_size: 'TCP会话接收到第一个报文的大小',
        tcp_response_packet_size: '服务端在本次TCP会话上响应的总字节数'
      }
    }
  },

  computed: {
    ...mapState({
      LOGIC_LABEL: state => state.wall.LOGIC_LABEL,
      MATCHING_TCP_TYPE: state => state.wall.MATCHING_TCP_TYPE,
      MATCHING_TCP_TYPE_VAR: state => state.wall.MATCHING_TCP_TYPE_VAR,
      MATCHING_TCP_LOGIC: state => state.wall.MATCHING_TCP_LOGIC,
      SELECT_TCP_DATA: state => state.wall.SELECT_TCP_DATA
    }),

    containMustBeLast() {
      const list = this.formRules
      if (list.length) {
        const lastItem = list[list.length - 1]
        if (lastItem.type === 'tcp_response_packet_size') return true
        return false
      }
      return false
    },

    disabledAdd() {
      const list = this.formRules
      return (list.length && list.length === 5) || this.containMustBeLast
    }
  },

  created() {
    this.fetchIpList()
  },

  methods: {
    async fetchIpList() {
      const res = await this.Fetch.get('V4/user.ip.list', { page: 1, per_page: 999, is_item: 1 })
      const { list = [] } = res
      this.selectIpList = list.map(_ => {
        return {
          label: _.name,
          value: _.file_key
        }
      })
    },

    actionFilter() {
      const typeList = this.formRules.map(_ => _.type)
      const isContain = typeList.includes('tcp_response_packet_size')
      const selects = deepClone(this.CLOUD_WALL.HANDLE_TCP_TYPE)
      const filter = ['block', 'watch']

      if (!filter.includes(this.form.action)) this.form.action = filter[0]
      this.HANDLE_TCP_TYPE = isContain ? selects.filter(_ => filter.includes(_.value)) : selects
    },

    // 类型选择改变触发检查
    handleTypeChange(item) {
      if (!this.finish) return

      const { type } = item
      if (!type) return
      item.target.reset()
      item.logic = this.MATCHING_TCP_LOGIC[type][0].value
      checkFormRule(this)
      this.actionFilter()
    },
    handleRegionChange(form, value) {
      form.regionTag = FORM.formatRegionToTag(value)
    },
    // 添加策略项目
    async handleRuleItemAdd() {
      const { formRules } = this
      // 检查最后一项
      if (formRules.length > 0) {
        const check = await this.handleRuleItemCheck(formRules[formRules.length - 1])
        if (!check) return
      }

      formRules.push({
        type: '',
        logic: '',
        target: new Form(FORM.FORM_TCP_TARGET, FORM_TCP_TARGET_RULE)
      })
      checkFormRule(this)
    },
    // 保存策略
    async handleSave(id) {
      const { action, level, interval, time_unit, remark } = this.form

      this.$refs.form.validate(async valid => {
        if (!valid) return
        // 数组转为对象布尔
        const action_data = {
          level,
          interval: parseInt(interval, 10),
          time_unit
        }
        Object.assign(action_data)

        // 规则提取
        const rules = await this.handleRulesCheck()
        if (!rules) return

        const data = {
          id: parseInt(id, 10),
          package_id: this.$route.params.id,
          from: '',
          remark,
          type: 'tcp',
          rules,
          action,
          action_data
        }
        // 发送保存策略
        try {
          this.form.submit()
          await this.Fetch.post('V4/firewall.policy.save', data)
        } catch (e) {
          this.form.finish()
          return
        }
        this.$message.success(id ? '编辑成功' : '添加成功')

        this.form.finish()
        if (!id) this.$emit('init-status')
        this.$emit('on-success')
        this.handleClose()
      })
    },
    // 删除策略项目
    handleItemDlete(index) {
      this.formRules.splice(index, 1)
      checkFormRule(this)
    },
    // 规则项目检查
    handleRuleItemCheck(form) {
      const { type } = form
      if (!type) {
        this.$message.warning('请选择匹配类型')
        return false
      }

      try {
        // 验证匹配目标
        this.$refs[`add-rules-type-${type}`].validate(valid => {
          if (!valid) throw new Error()
        })
        this.$refs[`add-rules-${type}`].validate(valid => {
          if (!valid) throw new Error()
        })
      } catch (e) {
        return false
      }

      return true
    },
    // 规则列表检查并转换格式
    async handleRulesCheck() {
      const { formRules } = this
      const rules = []

      for (let i = 0; i < formRules.length; i++) {
        const item = formRules[i]
        const ret = await this.handleRuleItemCheck(item)
        if (!ret) return
      }

      formRules.forEach(item => {
        const { logic, type } = item

        const ruleItem = {
          logic,
          rule_type: type.toLowerCase(),
          data: item.target[type]
        }
        rules.push(ruleItem)
      })
      return rules
    },
    // 打开编辑框
    handleRuleEdit(form) {
      this.id = form.id
      // 转换为本地格式
      const { action, action_data, rules, remark } = form
      const formPolicy = { action, remark }

      if (action === CLOUD_WALL.HANDLE_TYPE_VAR.GENERAL_CC && action_data) {
        formPolicy.level = action_data.level
      } else if (action === CLOUD_WALL.HANDLE_TYPE_VAR.BLOCK && action_data) {
        formPolicy.interval = action_data.interval
        formPolicy.time_unit = action_data.time_unit
      } else if (action === CLOUD_WALL.HANDLE_TYPE_VAR.RELEASE && action_data) {
        const arr = []
        for (const k in action_data) {
          if (action_data[k] === '1' || action_data[k] === 1) {
            arr.push(k)
          }
        }
        formPolicy.release = arr
      }

      Object.assign(this.form, formPolicy)

      const formRules = []
      rules.forEach(item => {
        const { logic, rule_type, data } = item
        const target = new Form(FORM.FORM_TCP_TARGET, FORM_TCP_TARGET_RULE)
        target[rule_type] = data

        formRules.push({
          logic,
          type: rule_type,
          target
        })

        // if (rule_type === this.MATCHING_TCP_TYPE_VAR.Region) {
        //   target.regionTag = FORM.formatRegionToTag(data)
        // }
      })
      this.formRules = formRules
    },

    handleOpen(form, scope) {
      this.finish = false
      const { listPort } = scope
      this.listPort = listPort.map(item => {
        return {
          value: item, label: item
        }
      })
      this.formRules = []
      this.form.reset()

      if (form) {
        form = deepClone(form)
        this.handleRuleEdit(form)
      } else {
        this.id = null
        this.handleRuleItemAdd()
      }
      selectExclude(this.MATCHING_TCP_TYPE)
      checkFormRule(this)
      this.open = true
      this.$nextTick(() => {
        this.finish = true
        this.actionFilter()
      })
    },

    handleClose() {
      this.open = false
    }
  }
}
</script>
