<style lang="scss" scoped>
.form-box {
  margin-bottom: 5px;
}
.input-box {
  widows: 150px;
}
.desc-box {
  display: inline-block;
  width: 250px;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :show-submit="showSubmit"
    title="扩容"
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
      :model="kuorong_form"
      label-width="160px"
      label-position="left"
    >
      <el-form-item
        v-for="(item, index) in kuorong"
        :key="index"
        :label="item.label"
        class="form-box"
      >
        <template v-if="!item.key">
          {{ item.value }}
        </template>
        <template v-else>
          <div class="desc-box color--primary">
            <!-- <div> {{ Number(kuorong_form[item.key]) }}{{ item.unit }}</div> -->
            <span> 基础：{{ item.min }}{{ item.unit }}</span>
            <span style="margin-left:10px;">已扩容：{{ kuorongNum(data.plan_setting.cfg.kuorong, item.key) }}{{ item.unit }}</span>
          </div>
          <div class="desc-box">
            <el-input-number
              v-model="kuorong_form[item.key]"
              :step="item.step"
              :min="0"
              :max="item.max"
              placeholder=""
              class="input-box"
              @change="e => {
                changeKuorong(e,item.key,item.step,item.min)
              }"
            />
          </div>
        </template>
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
function kuorong(list = [], form = {}) {
  const data = {}
  list.forEach(item => {
    if (item.key && form[item.key] !== '') {
      data[item.key] = {
        'buy_num': form[item.key] || 0
      }
    }
  })
  return data
}
function desc(list = [], form = {}, data = {}) {
  const desc = []
  list.forEach(i => {
    if (i.key && form[i.key] !== '') {
      i.kuorongValue = form[i.key]
    }
    desc.push(i)
  })
  return desc
}

function kuorongNum(kuorong = {}, key = '') {
  let val = 0
  if (kuorong && Object.keys(kuorong).length) {
    val = kuorong[key] && kuorong[key].buy_num || 0
  }
  return val
}

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
      kuorong_form: {
        plan_id: ''
      },
      rules: {
        plan_id: []
      },
      pay_price: 0,
      diff_price_time: 0,
      kuorong: [],
      index: 0
    }
  },
  computed: {
    showSubmit() {
      let val = false
      for (let i = 0; i < this.kuorong.length; i++) {
        const key = this.kuorong[i] && this.kuorong[i].key || ''
        if (key && this.kuorong_form[key] && this.kuorong_form[key] > 0) {
          val = true
          break
        }
      }
      return val
    }
  },

  methods: {
    afterOpen() {
      this.$nextTick(() => {
        this.kuorong_form.plan_id = this.data.id
        this.pay_price = 0
        if (this.data && this.data.plan_setting) {
          this.setkuorong()
          this.getPrice()
        }
      })
    },

    async getPrice(val) {
      const param = { ...this.kuorong_form }
      param.kuorong = kuorong(this.kuorong, this.kuorong_form)

      try {
        const data = await this.Fetch.post('/V4/order.kuorongprice', param)
        this.pay_price = data.pay_price
        this.diff_price_time = data.diff_price_time
      } catch (error) {
        return
      }
    },
    kuorongNum(kuorong, key) {
      return kuorongNum(kuorong, key)
    },
    handleSubmit() {
      const Item = {
        meal_flag: this.data.meal_flag,
        desc: desc(this.kuorong, this.kuorong_form, this.data),
        buy_num: 1,
        pay_price: this.pay_price,
        buy_time: '',
        diff_price_time: this.diff_price_time,
        buy_time_text: this.CountDown(this.data.expire_time),
        plan_id: this.data.id,
        kuorong: kuorong(this.kuorong, this.kuorong_form),
        model: 'kuorong'
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
