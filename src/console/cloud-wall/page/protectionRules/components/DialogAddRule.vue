<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="规则"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <el-form-item
        label="选择套餐"
        prop="package_id"
      >
        <yd-form-select
          v-model="form.package_id"
          :disabled="options.batch && options.mode === 'Edit'"
          :selects="selectPackage"
          style="width: 150px; margin-right: 12px"
          default-text="选择套餐"
        />
      </el-form-item>
      <el-form-item label="转发协议">
        <yd-form-radio
          :radios="Label.protocol"
          v-model="form.protocol"
        />
      </el-form-item>
      <el-form-item
        prop="protocol_port"
        label="转发端口"
      >
        <el-input
          v-if="options.batch"
          :disabled="options.mode === 'Edit'"
          v-model="form.protocol_port"
          type="textarea"
          placeholder="多个端口以“，”隔开"
          style="width: 280px"
        />
        <el-input
          v-else
          v-model="form.protocol_port"
          placeholder="端口"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item label="负载均衡模式">
        <yd-form-radio
          :radios="Label.loading"
          v-model="form.loading"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          placeholder="备注"
          type="textarea"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item label="源类型">
        <yd-form-radio-button
          :radios="Label.sourceType"
          v-model="form.source_type"
        />
      </el-form-item>
      <el-form-item label="源IP/源端口">
        <TableSource
          ref="TableSource"
          :port-visible="!options.batch"
          :source-type="form.source_type"
          v-model="sourceList"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import RULE from '@/utils/verify'
import createDialog from '@/utils/createDialog'
import TableSource from './TableSource'

const Label = {
  protocol: [
    {
      label: 'TCP',
      value: 1
    }
    // {
    //   label: 'UDP',
    //   value: 2
    // }
  ],
  loading: [
    {
      label: '轮询',
      value: 1
    },
    {
      label: 'IP哈希',
      value: 2
    }
  ],
  sourceType: [
    {
      label: 'IP',
      value: 1
    },
    {
      label: '域名',
      value: 2
    }
  ]
}

function portValidator(rule, value, callback) {
  value = value.toString().split(',')
  if (value.length > 100) callback(new Error('最多同时添加100个端口'))
  value.forEach(item => {
    if (!RULE.port.test(item)) {
      callback(new Error('格式不正确'))
    }
  })
  callback()
}

export default createDialog({
  components: { TableSource },

  data() {
    return {
      loading: true,
      Label,
      selectPackage: [],
      sourceList: [],
      protocol_port_old: [],
      optionsDefault: {
        batch: false,
        mode: 'Create'
      },
      formDefault: {
        package_id: '',
        protocol: 1,
        protocol_port: '',
        loading: 1,
        remark: '',
        source_type: 1
      },
      rules: {
        package_id: { required: true, message: '请选择套餐', trigger: 'blur' },
        protocol_port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { validator: portValidator, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    initOptions(form) {
      const { records = [] } = form
      this.sourceList = records
      this.protocol_port_old = form.protocol_port
    },

    async fetchPackageList() {
      const { list = [] } = await this.Fetch.get('V4/Tjkd.plus.package.all')
      list.forEach(item => {
        item.disabled = item.flag
      })

      this.selectPackage = list
    },

    afterOpen(form) {
      this.fetchPackageList()
      this.$nextTick(async() => {
        this.$refs.Form.clearValidate()
        this.loading = false
      })
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const sourceList = await this.$refs.TableSource.getList()

      const isPrimary = sourceList.filter(_ => _.view === 'primary')
      if (!isPrimary.length) {
        this.$message.warning('线路必须包含主线路')
        throw new Error()
      }
      const backupMap = {
        primary: 1,
        backup: 2
      }

      const formData = this.form

      const form = {
        package_id: formData.package_id,
        protocol: formData.protocol,
        protocol_port: formData.protocol_port,
        loading: formData.loading,
        remark: formData.remark,
        source_type: formData.source_type,
        source_ip: sourceList.map(_ => _.value),
        source_port: sourceList.map(_ => _.port),
        backup: sourceList.map(_ => backupMap[_.view])
      }

      try {
        if (this.options.batch) {
          form.protocol_port = formData.protocol_port.split(',')
          delete form.source_port
          if (this.options.mode === 'Create') {
            await this.Fetch.post('V4/Tjkd.plus.forward.rule.batch.add', form)
          } else {
            form.protocol_port_old = this.protocol_port_old.split(',')
            await this.Fetch.post('V4/Tjkd.plus.forward.rule.batch.save', form)
          }
        } else {
          if (this.options.mode === 'Create') {
            form.actions = 'add'
            await this.Fetch.post('V4/Tjkd.plus.forward.rule.save', form)
          } else {
            form.actions = 'edit'
            form.protocol_port_old = this.protocol_port_old
            await this.Fetch.post('V4/Tjkd.plus.forward.rule.save', form)
          }
        }
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
