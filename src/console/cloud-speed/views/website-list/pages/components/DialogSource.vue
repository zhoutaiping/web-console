<template>
  <yd-dialog
    v-loading
    :class="b()"
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    aside
    aside-type="top"
  >
    <div slot="footer">
      <el-button
        type="text"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="loadingSubmit"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
    <DmAlert class="margin-top">
      <p>1. 源站设置策略</p>
      <ul>
        <li>保留原配置：所选域名当前的源站配置不做任何修改</li>
        <li>新增：在当前已存在监听端口的基础上新增其他监听端口配置</li>
        <li>修改-回源设置变更：基于监听端口修改源站配置，当所选网站未添加该端口时无效</li>
        <li>修改-监听端口变更：批量修改已有监听端口信息；（请您知悉：当变更后监听端口为多个时，回源端口将与监听端口保持一致）</li>
      </ul>
      <p>2. 协议跟随：节点取源时所用协议和客户端访问协议保持一致，源站需要同时支持80和443端口， 否则有可能造成节点取源失败</p>
      <p>3. 批量新增时，多个监听端口请用英文输入法下逗号分开，这时回源端口将与监听端口保持一致</p>
      <p>4. 取源协议为协议跟随时，回源端口将与监听端口保持一致</p>
      <p>
        5. 线路配置策略
      </p>
      <ul>
        <li>
          追加：在当前端口已有源站的基础上新增主线路或备线路；
        </li>
        <li>
          覆盖添加：删除当前端口已配置的源站，重新添加源IP；
        </li>
      </ul>
      <p>6. 线路配置优先级：主线路 > 备线路，同一线路类型下，优先级等级越高，则权重越大</p>
    </DmAlert>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="源站设置策略">
        <yd-form-radio
          v-model="policy"
          :radios="addReserved(SELECT.EDIT_TYPE)"
          @change="handlePolicyChange"
        />
      </el-form-item>
      <template v-if="policy !== '__KEEP__'">
        <el-form-item label="监听端口">
          <template v-if="policy === 'append'">
            <el-input
              v-model="form.listen_port"
              style="width: 200px"
              placeholder="监听端口"
            />
          </template>
          <template v-else>
            <div style="margin-bottom: 12px">
              <yd-form-radio
                v-model="form.listen_port_type"
                :radios="selectPortType"
                @change="handlePortTypeChange"
              />
            </div>
            <yd-form-select
              v-if="form.listen_port_type === 'source_change'"
              v-model="form.s_listen_port"
              :selects="listPort"
              default-text="全部"
              style="width: 130px"
              default-value="all"
            />
            <template v-else>
              选择端口：
              <yd-form-select
                v-model="form.s_listen_port"
                :selects="listPort"
                default-text="全部"
                default-value="all"
                style="width: 130px"
              />
              <span style="margin-left: 12px">
                变更后：
              </span>
              <InputMultiple
                v-model="form.c_listen_port"
                :selects="selectListenPort"
                placeholder="监听端口"
                style="width: 130px; display: inline-block;"
              />
            </template>
          </template>
        </el-form-item>
        <template v-if="form.listen_port_type ==='source_change' && policy === 'rewrite'">
          <el-form-item label="协议类型">
            <yd-form-radio
              v-model="form.protocol"
              :radios="addReserved(SELECT.PROTOCOL_TYPE, 'keep')"
            />
          </el-form-item>
          <el-form-item label="取源协议">
            <yd-form-radio
              v-model="form.get_source_protocol"
              :radios="addReserved(SELECT.SOURCE_PROTOCOL, 'keep')"
            />
          </el-form-item>
          <el-form-item label="负载均衡方式">
            <yd-form-radio
              v-model="form.load_balance"
              :radios="addReserved(SELECT.BALANCING_TYPE, 'keep')"
            />
          </el-form-item>
          <el-form-item label="回源设置">
            <yd-form-radio
              v-model="form.back_source_type"
              :radios="addReserved(SELECT.RETURN_SETTING, 'keep')"
            />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="协议类型">
            <yd-form-radio
              v-model="form.protocol"
              :radios="SELECT.PROTOCOL_TYPE"
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
        </template>
        <el-form-item
          v-if="form.back_source_type === 0 || form.back_source_type === 1"
          label="线路设置"
        >
          <TableSource
            ref="table"
            :visible-edit-type="policy === 'rewrite' && form.listen_port_type ==='source_change' && form.back_source_type === 0"
            :back_source_type="form.back_source_type"
            :port-visible="form.get_source_protocol !== 2"
          />
        </el-form-item>
      </template>
    </el-form>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import FormItemAction from '@/components/FormItem/FormItemAction'
import InputMultiple from '@/components/Input/InputMultiple'
import { deepClone } from '@/utils'
import TableSource from './TableSource'
import diloagBatch from '../../../../mixins/dialog-batch'

const FORM = {
  protocol: 0,
  listen_port: '',
  get_source_protocol: 0,
  load_balance: 1,
  back_source_type: 0
}

const FORM_COVER = {
  protocol: 'keep',
  listen_port_type: 'source_change',
  listen_port: '',
  s_listen_port: '',
  c_listen_port: [],
  get_source_protocol: 'keep',
  load_balance: 'keep',
  back_source_type: 'keep',
  _psource: 'append'
}

function portVaildate(rule, value, callback) {
  if (!value) callback(new Error('请填写'))
  value = parseInt(value, 10)
  if (value < 1 || value > 65535) {
    callback(new Error('端口有误'))
  }
  callback()
}

export default create({
  name: 'dialogSource',

  mixins: [diloagBatch],

  components: {
    FormItemAction, TableSource, InputMultiple
  },

  data() {
    return {
      selectPortType: [
        {
          label: '回源设置变更',
          value: 'source_change'
        },
        {
          label: '监听端口变更',
          value: 'listen_change'
        }
      ],
      title: '源站设置',
      open: false,
      policy: '__KEEP__',
      form: deepClone(FORM),
      rules: {
        listen_port: { validator: portVaildate, trigger: 'blur' }
      },
      loadingSubmit: false
    }
  },

  methods: {
    handleOpen() {
      this.form = deepClone(FORM)
      this.policy = '__KEEP__'
      this.open = true
      this.$store.dispatch('fetchBatchListen')
    },

    handleClose() {
      this.open = false
    },

    handlePolicyChange(type) {
      this.form = type === 'append' ? deepClone(FORM) : deepClone(FORM_COVER)
    },

    handlePortTypeChange(listen_port_type) {
      this.form = listen_port_type === 'listen_change' ? deepClone({ ...FORM, listen_port_type }) : deepClone({ ...FORM_COVER, listen_port_type })
    },

    async checkForm() {
      try {
        this.$refs.form.validate(valid => {
          if (!valid) throw new Error()
        })
      } catch (e) {
        return false
      }
      return true
    },
    // 提交
    async handleSubmit() {
      const form = deepClone(this.form)
      const { policy } = this
      if (policy === '__KEEP__') {
        this.handleClose()
        return
      }
      form._policy = policy

      let check = await this.checkForm()
      if (!check) return

      // 表格检查
      if (form.back_source_type === 1 || form.back_source_type === 0) {
        const Table = this.$refs.table
        check = await Table.handleCheck()
        if (!check) return

        const { list, _psource } = Table.form
        if (policy !== '__KEEP__') {
          form._policy = policy
        }
        form.source_ips = list

        if (form._policy === 'rewrite') {
          form._psource = form.back_source_type === 1 ? 'rewrite' : _psource
        }
      } else {
        form.source_ips = []
        form._psource = 'keep'
      }

      const data = {
        id: 'listen_port',
        name: 'dialogSource',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
