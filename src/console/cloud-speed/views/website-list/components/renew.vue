<style lang="scss" scoped>
/deep/.el-radio-button {
  margin: 2px;
}
/deep/.el-radio-button .el-radio-button__inner {
  border: 1px solid #e8e8e8;
}
/deep/.el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0 !important;
}
/deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  border-color: #2991fa;
}
/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 !important;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    title="续费"
    width="600px"
    @submit="handleSubmit"
  >
    <DmAlert>
      当前版本：{{ data.plan_setting.meal.product_name }}【{{ data.plan_name }}】<br>
      到期时间：{{ expire_time }}
    </DmAlert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="renew_form"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="续费时长">
        <el-radio-group
          v-model="renew_form.buy_time"
          @change="getPrice"
        >
          <el-radio-button
            v-for="(m, m_index) in times"
            :key="m_index"
            :label="m.value"
          >
            {{ m.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="0">
        <el-form-item
          label="应付价格"
          style="display: inline-block;"
        >
          <span class="color--primary">{{ pay_price }} 元</span>
        </el-form-item>
        <el-form-item
          label="优惠"
          style="display: inline-block;margin-left:20px;"
        >
          <span class="color--primary">{{ diff_price_time }} 元</span>
        </el-form-item>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
<script>
import consoleDialog from '@/mixins/consoleDialog'
import mealMixis from '../../../mixins/website-meal-mixins'
export default {
  mixins: [consoleDialog, mealMixis],
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      renew_form: {
        plan_id: '',
        buy_time: 1,
        time_unit: 'm'
      },
      rules: {
        plan_id: [],
        buy_time: [],
        time_unit: []
      },
      pay_price: 0,
      diff_price_time: 0,
      expire_time: ''
    }
  },
  methods: {
    afterOpen() {
      this.$nextTick(() => {
        this.renew_form.plan_id = this.data.id
        this.pay_price = 0
        this.diff_price_time = 0
        this.getPrice(1)
      })
    },

    async getPrice(val) {
      const param = { ...this.renew_form }
      param['buy_time'] = buy_time(this.renew_form['buy_time'])
      param['time_unit'] = unit(this.renew_form['buy_time'])
      try {
        const data = await this.Fetch.post('/V4/order.renewprice', param)
        this.pay_price = data.pay_price
        this.diff_price_time = data.diff_price_time
        this.expire_time = data.expire_time
      } catch (error) {
        return
      }
    },

    handleSubmit() {
      function lable(list = [], value = '') {
        let val = ''
        const index = list.findIndex(i => { return i.value === value })
        if (index > -1) {
          val = list[index].label
        }
        return val
      }
      const Item = {
        meal_flag: this.data.meal_flag,
        desc: [
          { label: '套餐版本：', value: 'Web安全加速【' + this.data.plan_name + '】' }
        ],
        buy_num: 1,
        pay_price: this.pay_price,
        buy_time: this.renew_form.buy_time,
        diff_price_time: this.diff_price_time,
        buy_time_text: lable(this.times, this.renew_form.buy_time),
        plan_id: this.data.id,
        model: 'renew'
      }
      localStorage.setItem('webscdnItem', JSON.stringify(Item))
      localStorage.setItem('webscdnFlag', this.data.meal_flag)
      localStorage.setItem('webscdnPayStatus', 0)
      window.location = '/webscdn-pay'
      this.$refs.Dialog.resetSubmitLoading()
      this.$refs.Dialog.handleClose()
    }
  }
}
function buy_time(val = 1) {
  if (val > 9) {
    return val / 12
  } else {
    return val
  }
}

function unit(val = 1) {
  if (val > 9) {
    return 'y'
  } else {
    return 'm'
  }
}
</script>
