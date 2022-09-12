<template>
  <DmDialog
    ref="Dialog"
    title="添加网站"
    @submit="handleSubmit"
  >
    <yd-alert>
      添加域名后请至控制台填写回源地址
    </yd-alert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="cform"
      label-width="80px"
      label-position="right"
    >
      <el-form-item
        v-if="showBuyForm"
        label="计费方式"
      >
        <yd-form-radio
          :radios="SELECT.CDN_ACCOUNTING_RULES"
          v-model="cform.buy_cdn.accounting_rules"
        />
      </el-form-item>
      <el-form-item
        label="网站"
        prop="domain"
      >
        <el-input
          v-model="cform.domain"
          placeholder="www.demo.com"
        />
      </el-form-item>
      <el-form-item
        label="网站名称"
        prop="domain_name"
      >
        <el-input
          v-model="cform.domain_name"
          placeholder="网站名称"
        />
      </el-form-item>
      <el-form-item
        v-if="appAssets.companyEN === 'Westone'"
        label="起止时间"
      >
        <el-date-picker
          v-model="daterange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import consoleDialog from '@/mixins/consoleDialog'
import RULE from '@/utils/verify'
import { validator } from '@/utils/form'
import SELECT from '../../../constant/select'

export default {
  mixins: [consoleDialog],

  data() {
    return {
      daterange: [],
      SELECT,
      showBuyForm: false,
      rules: {
        domain: { required: true, validator: validator(RULE.domainWithPan, '域名填写错误') }
      },
      cform: {
        domain: '',
        domain_name: '',
        buy_cdn: {
          accounting_rules: 2
        }
      }
    }
  },

  methods: {
    afterOpen() {
      this.daterange = []
      this.$refs.Form && this.$refs.Form.clearValidate()
    },

    handleSubmit() {
      this.$refs.Form.validate(async(valid) => {
        if (!valid) {
          this.$refs.Dialog.resetSubmitLoading()
          return
        }

        const [begin_time, expire_time] = this.daterange
        const form = {
          ...this.cform,
          begin_time,
          expire_time
        }
        if (!this.showBuyForm) {
          delete form.buy_cdn.accounting_rules
        }
        let data
        try {
          data = await this.Fetch.post('V4/Web.Domain.add.batch', form)
        } catch (e) {
          return
        } finally {
          this.$refs.Dialog.resetSubmitLoading()
        }

        this.Message('ACTION_SUCCESS')
        this.$emit('init')
        const id = Object.keys(data.list)[0]
        this.$router.push({ name: 'cloud-speed.router.websiteList__console__id', params: { id }})
      })
    }
  }
}
</script>
