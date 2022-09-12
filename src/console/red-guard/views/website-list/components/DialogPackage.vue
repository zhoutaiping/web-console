<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    width="500px"
    title="添加网站"
    @submit="handleSubmit"
  >
    <DmAlert>
      网站为性能优化中审核通过的网站。若无您需要防护的网站，请至<a href="/console/cloud-speed">{{ $t('cloud-speed.title') }}</a>中添加
    </DmAlert>
    <el-form
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="选择套餐">
        <yd-form-select
          v-model="form.package_id"
          :selects="packageList"
        />
      </el-form-item>
      <el-form-item label="选择网站">
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
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import SelectMultipleMany from '@/components/Select/SelectMultipleMany'
import moment from 'moment'

export default createDialog({
  components: { SelectMultipleMany },

  data() {
    return {
      form: {},
      formDefault: {
        package_id: '',
        domain_id: []
      },
      packageList: [],
      total: 0
    }
  },

  methods: {
    handleSelectDomain(e) {
      this.form.domain_id = e
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    },

    async fetchSubmit() {
      if (!this.form.domain_id.length) {
        this.$message.warning('请选择网站')
        throw new Error()
      }

      try {
        await this.Fetch.post('/V4/cloudsafe.hwws.package.bind.domain', this.form)
      } catch (e) {
        return
      }
    },

    async fetchData(params) {
      const res = await this.Fetch.get('V4/cloudsafe.hwws.package.canuse.domain.list', {
        ...params,
        domain: params.keyword
      })

      const { total, list = [] } = res
      this.total = Number(total)

      return {
        total,
        list: list.map(_ => {
          return {
            label: _.domain,
            value: _.domain_id
          }
        })
      }
    },

    async fetchPackageList() {
      const { list = [] } = await this.Fetch.get('V4/cloudsafe.hwws.package.list', { per_page: 1000 })

      const packageList = []
      list.forEach((item, index) => {
        const isExprice = Date.now() > moment(item.expire_time, 'YYYY-MM-DD HH:mm:ss').format('x')
        if (isExprice) return
        packageList.push({
          value: item.id,
          label: item.plan_diy_name
        })
      })

      if (packageList.length) {
        this.form.package_id = packageList[0].value
      }

      this.packageList = packageList
    },

    beforeOpen() {
      this.form = {
        package_id: '',
        domain_id: []
      }
      this.$nextTick(() => {
        this.$refs.SelectMultipleMany.initValue()
      })
      this.fetchPackageList()
    }
  }
})
</script>
