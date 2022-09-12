<template>
  <div>
    <DmAlert>
      <template v-if="isBatch">
        <!--  -->
      </template>
      <template v-else>
        1. 节点取源时所用协议和客户端访问协议保持一致，源站需要同时支持 80 和 443 端口，否则有可能造成节点取源失败<br>
        2. 批量新增源站时，多个监听端口请用英文输入法下逗号分开，这时回源端口将与监听端口保持一致<br>
        3. 取源协议为协议跟随时，回源端口将与监听端口保持一致<br>
        4. 线路配置优先级：主线路 > 备线路，同一线路类型下，优先级等级越高，则权重越大
      </template>
    </DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-form-item
        v-if="isBatch"
        label="源站设置策略"
      >
        <yd-form-radio
          v-model="formBatch._psource"
          :radios="addReserved(SELECT.EDIT_TYPE, 'keep')"
          @change="handlePolicyChange"
        />
      </el-form-item>
      <template v-if="formBatch._psource !== 'keep' || !isBatch">
        <el-form-item label="协议类型">
          <yd-form-radio
            v-model="form.protocol"
            :radios="addReserved(SELECT.PROTOCOL_TYPE, 'keep', isBatch && formBatch._psource === 'rewrite')"
          />
        </el-form-item>
        <el-form-item
          label="监听端口"
          prop="listen_port"
        >
          <el-input
            v-model="form.listen_port"
            style="width: 200px"
            placeholder="监听端口"
          />
        </el-form-item>
        <el-form-item label="取源协议">
          <yd-form-radio
            v-model="form.get_source_protocol"
            :radios="addReserved(SELECT.SOURCE_PROTOCOL, 'keep', isBatch && formBatch._psource === 'rewrite')"
          />
        </el-form-item>
        <el-form-item label="负载均衡方式">
          <yd-form-radio
            v-model="form.load_balance"
            :radios="addReserved(SELECT.BALANCING_TYPE, 'keep', isBatch && formBatch._psource === 'rewrite')"
          />
        </el-form-item>
        <el-form-item label="回源设置">
          <yd-form-radio
            v-model="form.back_source_type"
            :radios="addReserved(SELECT.RETURN_SETTING, 'keep', isBatch && formBatch._psource === 'rewrite')"
          />
        </el-form-item>
      </template>
      <el-form-item
        v-if="form.back_source_type === 0 || form.back_source_type === 1"
        label="线路设置"
      >
        <TableSource
          ref="TableSource"
          :is-batch="isBatch"
          :port-visible="form.get_source_protocol !== 2"
          :back_source_type="form.back_source_type"
          policy="rewrite"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import FormItemAction from '@/components/FormItem/FormItemAction'
import TableSource from './components/TableSource'
import baseMixins from './base'
import SELECT from '../../constant/select'

function portVaildate(rule, value, callback) {
  if (!value) callback(new Error('请填写'))
  value = parseInt(value, 10)
  if (value < 1 || value > 65535) {
    callback(new Error('端口有误'))
  }
  callback()
}

export default {
  components: {
    FormItemAction, TableSource
  },

  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: SELECT.SWITCH_M2
      },
      rules: {
        listen_port: { validator: portVaildate, trigger: 'blur' }
      },
      formDefault: {
        protocol: 0,
        listen_port: '',
        get_source_protocol: 0,
        load_balance: 1,
        back_source_type: 0
      },
      formDefaultBatch: {
        protocol: 'keep',
        listen_port: '',
        get_source_protocol: 'keep',
        load_balance: 'keep',
        back_source_type: 'keep'
      },
      formBatch: {
        _psource: 'keep'
      },
      selectPort: []
    }
  },

  methods: {
    handlePolicyChange(type) {
      this.form = type === 'append' ? deepClone(this.formDefault) : deepClone(this.formDefaultBatch)
    },

    setForm(form = {}) {
      this.form = {
        ...this.isBatch ? this.formDefaultBatch : this.formDefault,
        ...form
      }
      if (form.source_ips && form.source_ips.length) {
        this.$refs.TableSource.setList(form.source_ips)
      }
    },
    // 提交
    async getForm() {
      this.$refs.Form.validate((valid) => {
        if (!valid) throw new Error()
      })

      const form = deepClone(this.form)

      if (form.back_source_type === 1 || form.back_source_type === 0) {
        const Table = this.$refs.TableSource
        await Table.handleCheck()
        const { list = [] } = Table.form
        list.forEach(item => {
          item.priority = item.mx
        })
        form.source_ips = list
      } else {
        form.source_ips = []
      }

      return {
        ...form,
        ...this.isBatch ? this.formBatch : {}
      }
    },

    async initConfig(options) {
      if (this.isBatch) {
        let res
        if (options.group_id) {
          res = await this.Fetch.post('V4/web.domain.group.domain.list', { group_id: options.group_id })
        } else {
          res = await this.Fetch.post('V4/Web.Domain.batch.domain.info', { domain_ids: options.domain_ids })
        }
        const { ports = [] } = res
        this.selectPort = Object.values(ports).map(_ => {
          return {
            label: _,
            value: _
          }
        })
      }

      this.$emit('initConfig', {
        selectStatus: []
      })
    }
  }
}
</script>
