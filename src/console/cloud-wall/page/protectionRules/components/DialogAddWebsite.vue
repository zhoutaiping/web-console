<template>
  <DialogForm
    ref="Dialog"
    v-model="form"
    :rules="rules"
    width="500px"
    title="添加网站"
    @submit="handleSubmit"
  >
    <el-form-item label="选择套餐">
      <yd-form-select
        v-model="form.package_id"
        :selects="packageList"
      />
    </el-form-item>
    <el-form-item label="选择域名">
      <SelectMultipleMany
        ref="SelectMultipleMany"
        :fetch-data="fetchData"
        v-model="form.domain_id"
        :size="500"
        :total="total"
        width="280px"
        @submit="handleSelectDomain"
      />
    </el-form-item>
  </DialogForm>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { selectObjFormat } from '@/utils/form'
import SelectMultipleMany from '@/components/Select/SelectMultipleMany'

export default createDialog({
  components: { SelectMultipleMany },

  data() {
    return {
      form: {},
      formDefault: {
        package_id: '',
        domain_id: []
      },
      rules: {},
      packageList: [],
      domainList: [],
      total: 0
    }
  },

  methods: {
    handleSelectDomain(e) {
      this.form.domain_id = e
    },

    handleSubmit() {
      this.$emit('submit', this.form)
    },

    async fetchData(params) {
      const res = await this.Fetch.get('V4/Tjkd.plus.domain.usable', {
        ...params,
        domain: params.keyword
      })

      const { total, list = [] } = res
      this.total = total

      return {
        total,
        list: list.map(_ => {
          return {
            label: _.domain,
            value: _.id
          }
        })
      }
    },

    async getDomainListUsable() {
      const data = await this.Fetch.get('V4/Tjkd.plus.domain.usable')
      delete data._status
      this.domainList = selectObjFormat(data)
    },

    async getPackageListSelect() {
      const data = await this.Fetch.get('V4/Tjkd.plus.package.all')
      this.packageList = data.list
    },

    beforeOpen() {
      this.form = {
        package_id: '',
        domain_id: []
      }
      this.$nextTick(() => {
        this.$refs.SelectMultipleMany.initValue()
      })
      this.getPackageListSelect()
      this.getDomainListUsable()
    }
  }
})
</script>
