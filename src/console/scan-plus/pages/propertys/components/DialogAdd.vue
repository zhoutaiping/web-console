<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="480px"
    title="添加资产"
    @submit="handleSubmit"
  >
    <yd-alert>
      免费版套餐仅支持可用性监测功能，若需使用其他扫描观测功能，请购买高等级版本套餐。
    </yd-alert>
    <el-form
      ref="Form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="125px"
    >
      <el-form-item
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        label="选择套餐"
      >
        <yd-form-select
          v-model="package_id"
          :selects="selectPackages"
          style="width: 200px"
          @change="changePackageInfo"
        />
        <div>
          <p>到期时间：{{ packageInfo.expire_time }} </p>
          <p>可绑定资产数（共 {{ packageInfo.property_num }} 条，还可绑定 {{ packageInfo.last_property_num }}条）</p>
          <p
            v-if="packageInfo.last_property_num === 0"
            class="color--danger"
          >当前套餐绑定资产数量已上限</p>
        </div>
      </el-form-item>
      <el-form-item label="资产类型">
        <yd-form-radio
          v-model="form.property_type"
          :radios="PROPERTY_TYPE"
          @change="changeType"
        />
      </el-form-item>
      <el-form-item
        :rules="form.property_type === 0 ? formRules.property_object_domain : formRules.property_object_ip"
        prop="property_object"
        label="资产地址"
      >
        <el-input
          v-model="form.property_object"
          :placeholder="form.property_type === 0 ? 'www.demo.com' : '0.0.0.0'"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item
        label="资产名称"
        prop="property_name"
      >
        <el-input
          v-model="form.property_name"
          style="width: 200px"
          placeholder="资产名称"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import RULE from '@/utils/verify'
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      RULE,
      loading: true,
      PROPERTY_TYPE: [
        {
          label: '域名',
          value: 0
        },
        {
          label: 'IP',
          value: 1
        }
      ],
      package_id: '',
      packageInfo: {},
      packageList: [],
      selectPackages: [],
      formDefault: {
        property_type: 0,
        property_object: '',
        property_name: ''
      },
      formRules: {
        property_object_ip: {
          required: true,
          pattern: RULE.ipReg,
          trigger: 'blur',
          message: '资产地址不正确'
        },
        property_object_domain: {
          required: true,
          pattern: RULE.domain,
          trigger: 'blur',
          message: '资产地址不正确'
        },
        property_name: {
          required: true,
          trigger: 'blur',
          message: '请输入资产名称'
        }
      }
    }
  },

  methods: {
    beforeOpen() {
      this.fetchPackageList()
    },

    changeType() {
      this.form.property_object = ''
    },
    // 读取套餐列表
    async fetchPackageList() {
      this.loading = true
      const data = await this.Fetch.get('V4/smgc.all.package.list')
      const packageList = data.list
      const selectPackages = packageList.map(item => {
        return {
          label: item.package_name,
          value: item.id
        }
      })

      const package_id = selectPackages[0].value
      this.package_id = package_id
      this.packageList = packageList
      this.selectPackages = selectPackages
      this.changePackageInfo(package_id)
      this.loading = false
    },
    // 选择套餐
    async changePackageInfo(id) {
      this.packageInfo = this.packageList.find(_ => _.id === id)
    },

    async fetchSubmit() {
      await this.validateForm()
      const form = {
        package_id: this.package_id,
        ...this.form
      }
      try {
        await this.Fetch.post('V4/smgc.property.add', form)
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
