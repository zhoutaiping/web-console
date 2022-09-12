<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="580px"
    title="批量添加资产"
    @submit="handleSubmit"
  >
    <DmAlert>
      免费版套餐仅支持可用性监测功能，若需使用其他扫描观测功能，请购买高等级版本套餐。
    </DmAlert>
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
          到期时间：{{ packageInfo.expire_time }} <br>
          可绑定资产数（共 {{ packageInfo.property_num }} 条，还可绑定 {{ packageInfo.last_property_num }}条） <br>
          <span
            v-if="packageInfo.last_property_num === 0"
            class="color--danger"
          >当前套餐绑定资产数量已上限</span>
        </div>
      </el-form-item>
      <el-form-item label="域名资产">
        <el-row :gutter="12">
          <el-col :span="10">
            <el-input
              :rows="10"
              v-model="form.domainTitles"
              placeholder="资产名称"
              type="textarea"
            />
          </el-col>
          <el-col :span="10">
            <el-input
              :rows="10"
              v-model="form.domainValues"
              placeholder="www.demo.com"
              type="textarea"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="IP 资产">
        <el-row :gutter="12">
          <el-col :span="10">
            <el-input
              :rows="10"
              v-model="form.ipTitles"
              placeholder="资产名称"
              type="textarea"
            />
          </el-col>
          <el-col :span="10">
            <el-input
              :rows="10"
              v-model="form.ipValues"
              placeholder="1.1.1.1"
              type="textarea"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import RULE from '@/utils/verify'
import { isRepeat } from '@/utils/array'
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      RULE,
      loading: true,
      package_id: '',
      packageInfo: {},
      packageList: [],
      selectPackages: [],
      formDefault: {
        domainTitles: '',
        domainValues: '',
        ipTitles: '',
        ipValues: ''
      },
      formRules: {}
    }
  },

  methods: {
    beforeOpen() {
      this.fetchPackageList()
    },

    formatList(listTitle, listValue) {
      if (!listTitle || !listValue) return null

      listTitle = listTitle.split('\n').filter(Boolean)
      listValue = listValue.split('\n').filter(Boolean)

      if (listTitle.length !== listValue.length) {
        this.$message.warning('资产名称与地址数量不一致')
        throw new Error()
      }

      if (isRepeat(listTitle)) {
        this.$message.warning('资产名称有重复')
        throw new Error()
      }
      if (isRepeat(listValue)) {
        this.$message.warning('资产地址有重复')
        throw new Error()
      }

      const data = {}
      listTitle.forEach((item, index) => {
        data[item] = listValue[index]
      })
      return data
    },

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

    async changePackageInfo(id) {
      this.packageInfo = this.packageList.find(_ => _.id === id)
    },

    async fetchSubmit() {
      const domain = await this.formatList(this.form.domainTitles, this.form.domainValues)
      const ip = await this.formatList(this.form.ipTitles, this.form.ipValues)

      if (!domain && !ip) {
        this.$message.warning('未填写资产')
        throw new Error()
      }
      const form = {
        package_id: this.package_id,
        domain,
        ip
      }

      await this.Fetch.post('V4/smgc.property.batadd', form)
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
