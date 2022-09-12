<template>
  <DmDialog
    ref="Dialog"
    title="升级"
    width="700px"
    @submit="handleSubmit"
  >
    <DmAlert>
      当前版本：{{ data.plan_setting.meal.product_name }}【{{ data.plan_name }}】<br>
      到期时间：{{ data.expire_time }}
    </DmAlert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="up_form"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="升级套餐">
        <el-radio-group
          v-model="up_desc"
          @change="getPrice"
        >
          <el-radio
            v-for="radio in UpMeal"
            :key="radio.value"
            :label="radio.desc"
          >{{ radio.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="0">
        <el-row
          :gutter="12"
          style="border:1px solid #EBEEF5"
        >
          <el-col
            :span="11"
            style="margin-left:15px;"
          >
            <div
              v-for="(item, index) in payItemDesc[findIndex(data, data.meal_flag)]"
              :key="index"
            >
              {{ item.label }} {{ item.value }}
            </div>
          </el-col>
          <el-col :span="11">
            <div
              v-for="(item, index) in payItemDesc[up_desc]"
              :key="index"
            >
              {{ item.label }} {{ item.value }}
            </div>
          </el-col>
        </el-row>
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
      up_form: {
        plan_id: '',
        meal_flag: ''
      },
      rules: {
        plan_id: [],
        buy_time: [],
        time_unit: []
      },
      pay_price: 0,
      diff_price_time: 0,
      flag: '',
      UpMeal: [],
      up_desc: ''
    }
  },
  methods: {
    afterOpen() {
      this.$nextTick(() => {
        this.up_form.plan_id = this.data.id
        this.pay_price = 0
        this.diff_price_time = 0
        this.UpMeal = this.upMeal()
        this.up_desc = this.UpMeal.length > 0 && this.UpMeal[0].desc || ''
        this.getPrice()
      })
    },

    async getPrice(val) {
      const param = { ...this.up_form }
      param.meal_flag = this.meals[this.up_desc]
      try {
        const data = await this.Fetch.post('/V4/order.upprice', param)
        this.pay_price = data.pay_price
        this.diff_price_time = data.diff_price_time
      } catch (error) {
        return
      }
    },

    handleSubmit() {
      const Item = {
        meal_flag: this.meals[this.up_desc],
        desc: [
          { label: '套餐版本：', value: 'Web安全加速【' + this.data.plan_name + '】 -->Web安全加速【' + this.option.meals[this.up_desc].label + '】' }
        ],
        buy_num: 1,
        pay_price: this.pay_price,
        buy_time: 1,
        diff_price_time: this.diff_price_time,
        buy_time_text: this.CountDown(this.data.expire_time),
        plan_id: this.data.id,
        model: 'up'
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
</script>
