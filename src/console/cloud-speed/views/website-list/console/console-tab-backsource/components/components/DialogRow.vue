<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    aside
    title-label="源站"
    width="720px"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 节点取源时所用协议和客户端访问协议保持一致，源站需要同时支持 80 和 443 端口，否则有可能造成节点取源失败<br>
      2. 批量新增源站时，多个监听端口请用英文输入法下逗号分开，这时回源端口将与监听端口保持一致<br>
      3. 取源协议为协议跟随时，回源端口将与监听端口保持一致<br>
      4. 线路配置优先级：主线路 > 备线路，同一线路类型下，优先级等级越高，则权重越大
    </DmAlert>
    <el-form label-position="top">
      <el-form-item label="协议类型">
        <yd-form-radio
          v-model="form.protocol"
          :radios="moduleLabel['cloud-speed'].PROTOCOL_TYPE"
          @change="handleProtocolChange"
        />
      </el-form-item>
      <el-form-item label="监听端口">
        <InputMultiple
          v-if="options.batch"
          v-model="form.listen_port"
          placeholder="监听端口"
          style="width: 200px"
        />
        <el-input
          v-else
          v-model="form.listen_port"
          placeholder="监听端口"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="取源协议">
        <yd-form-radio
          v-model="form.get_source_protocol"
          :radios="moduleLabel['cloud-speed'].SOURCE_PROTOCOL"
        />
      </el-form-item>
      <el-form-item label="负载均衡方式">
        <yd-form-radio
          v-model="form.load_balance"
          :radios="moduleLabel['cloud-speed'].BALANCING_TYPE"
        />
      </el-form-item>
      <el-form-item label="回源设置">
        <yd-form-radio
          v-model="form.back_source_type"
          :radios="moduleLabel['cloud-speed'].RETURN_SETTING"
        />
      </el-form-item>
      <el-form-item label="线路设置">
        <TableSource
          ref="TableSource"
          :back_source_type="form.back_source_type"
          :port-visible="!options.batch && form.get_source_protocol !== 2"
          v-model="form.source_ips"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import consoleDialog from '@/mixins/consoleDialog'
import InputMultiple from '@/components/Input/InputMultiple'
import { deepClone } from '@/utils'
import TableSource from './TableSource'

export default {
  name: 'DialogAddSourceIp',

  components: { InputMultiple, TableSource },

  mixins: [consoleDialog],

  data() {
    return {
      optionsDefault: {
        batch: false
      },
      formDefault: {
        domain_id: this.$route.params.id,
        protocol: 0,
        listen_port: 80,
        source_ips: [
          {
            value: '',
            port: '',
            view: 'primary',
            priority: 1
          }
        ],
        get_source_protocol: 0,
        load_balance: 1,
        back_source_type: 0
      }
    }
  },

  methods: {
    handleProtocolChange(val) {
      if (this.mode === 'Create') {
        this.form.listen_port = val === 0 ? 80 : 443
      }
    },

    beforeOpen(form) {
      if (form.id) {
        form.source_ips = form.records_list
      }
    },

    initOptions(form) {
      if (form.id) {
        this.mode = 'Edit'
      } else {
        this.mode = 'Create'
      }
    },

    async fetchSubmit() {
      this.form.source_ips = await this.$refs.TableSource.getList()
      try {
        if (this.mode === 'Create') {
          const form = deepClone(this.form)
          if (this.options.batch) {
            form.listen_port = form.listen_port.join(',')
            // 去除 port
            form.source_ips.forEach(_ => {
              delete _.port
            })
          }
          await this.Fetch.post('V4/Web.Domain.listenPort.add', form)
        } else {
          await this.Fetch.put('V4/Web.Domain.listenPort.edit', this.form)
        }
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.handleClose()
      this.$emit('init')
    }
  }
}
</script>
