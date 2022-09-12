<template>
  <yd-dialog
    :visible.sync="payConfigVisible"
    :close-on-click-modal="true"
    title="账户充值"
    width="650px"
    class="payDialog"
    @close="resetStatus"
  >
    <el-form
      ref="rechargeForm"
      :rules="rules"
      :model="rechargeForm"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="账户余额">
        {{ balance }}元
      </el-form-item>
      <el-form-item
        class="recharge-amount"
        label="充值金额"
        prop="amount"
      >
        <el-radio-group
          v-model="rechargeForm.amount"
          @change="changeRadio"
        >
          <el-radio-button :label="200">200元</el-radio-button>
          <el-radio-button :label="1000">1000元</el-radio-button>
          <el-radio-button :label="2000">2000元</el-radio-button>
          <el-radio-button
            v-show="rechargeForm.amount !== 'defined'"
            :label="'defined'"
          >自定义</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-show="rechargeForm.amount === 'defined'"
        class="zdy-item"
        label=""
        prop="definedAmount"
      >
        <el-input
          ref="definedAmount"
          v-model="rechargeForm.definedAmount"
        />
      </el-form-item>
      <el-form-item
        label-width="0px"
        prop="pay_type"
      >
        <label
          class="el-form-item__label title-purchase"
          style="width: 90px"
        >充值方式</label>
        <el-radio-group
          v-model="rechargeForm.pay_type"
          class="pay-radio"
          @change="changePay"
        >
          <el-radio :label="1"><span class="i-alipay" /></el-radio>
          <el-radio :label="2"><span class="i-wechartpay" /></el-radio>
          <el-radio :label="3"><span class="i-yinlianpay" /></el-radio>
        </el-radio-group>
      </el-form-item>
      <div
        v-show="isWeCharPay"
        class="el-form-item"
        style="text-align:center;"
      >
        <div
          v-loading="imgload"
          class="wechar-code"
        >
          <img
            :src="imgSrc"
            alt="pay"
            class="imgSrc"
          >
        </div>
      </div>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <div class="checkUser">
        <el-checkbox v-model="checkUser" />
        <div
          class="check-text"
          @click="checkUser = !checkUser"
        >
          我同意：所充值金额将直接进入所登录的帐户，相关操作均视为账户所有人操作，
          由账户所有人承担由此产生的一切权力义务。
        </div>
      </div>
      <div style="display:inline-block;">
        <el-button @click="resetForm('rechargeForm')">取消</el-button>
        <el-button
          :disabled="!checkUser || isWeCharPay"
          type="primary"
          @click="handleSubmit('rechargeForm')"
        >立即充值</el-button>
      </div>
    </div>
  </yd-dialog>
</template>

<script>
import SourceFinanceResource from '../../resource/SourceFinanceResource'
import { mapActions, mapState } from 'vuex'

const PAY_COMPANY_ID = {
  'baishan': 2
}

export default {
  props: {
    pageType: String,
    orderCode: String,
    couponCode: String,
    pageSize: Number
  },

  data() {
    const checkDefinedAmount = (rule, value, callback) => {
      if (this.rechargeForm.amount === 'defined') {
        if (!value) {
          return callback(new Error('请补充充值金额'))
        } else if (isNaN(value)) {
          return callback(new Error('请填写数字'))
        } else if (!/^(([1-9]\d{0,5}(\.\d{1,2})?)|(0\.\d[1-9])|(0\.[1-9]\d?))$/.test(value)) {
          return callback(new Error('金额范围为 0.01 ~ 999999.99，请核对后再提交'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      rules: {
        pay_type: [],
        recharge_type: [],
        amount: [],
        definedAmount: [{ validator: checkDefinedAmount, trigger: 'blur' }]
      },
      imgSrc: '',
      imgload: false,
      payConfigVisible: false,
      isWeCharPay: false,
      checkUser: false,
      WeCharPay_Code: '',
      rechargeForm: {
        pay_type: 1,
        recharge_type: '1',
        amount: 200,
        definedAmount: ''
      }
    }
  },
  computed: {
    ...mapState({
      balance: (state) => state.recharge.balance,
      visible: (state) => state.dialog.payConfig.visible
    })

  },
  watch: {
    visible: {
      handler(val) {
        this.payConfigVisible = val
      }
    }
  },
  created() {
    this.getUserBalance()
  },
  mounted() {
    this.rechargeForm.pay_type = 1
    this.isWeCharPay = false
    this.checkUser = false
    this.WeCharPay_Code = ''
    this.imgSrc = ''
  },
  methods: {
    ...mapActions([
      'triggerPayConfigVisible',
      'getUserBalance',
      'launchRecharge',
      'getRechargeByPage',
      'prepayOrderByCode',
      'baofuRecharge'
    ]),
    handleSubmit(form) {
      if (this.rechargeForm.pay_type === 1) {
        this.isWeCharPay = false
        this.handleAlipay(form)
      } else if (this.rechargeForm.pay_type === 2) {
        this.handleWeCharPay(form)
      } else if (this.rechargeForm.pay_type === 3) {
        this.handleYinlian()
      } else {
        this.$message.warning('请选择支付方式')
      }
    },
    changePay(value) {
      if (value === 1) {
        this.isWeCharPay = false
        this.WeCharPay_Code = ''
        this.imgSrc = ''
      }
    },
    changeRadio(value) {
      if (value === 'defined') {
        this.$refs.definedAmount.$el.children[0].focus()
      }
    },

    handleAlipay(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let totalFee = 0
          if (this.rechargeForm.amount !== 'defined') {
            totalFee = this.rechargeForm.amount
          } else {
            totalFee = this.rechargeForm.definedAmount
          }
          const tempWindow = window.open()
          this.launchRecharge({
            pageType: this.pageType,
            orderCode: this.orderCode,
            couponCode: this.couponCode,
            pageSize: this.pageSize,
            total_fee: totalFee,
            tempWindow,
            vm: this,
            company: PAY_COMPANY_ID[this.appEnv]
          })
        } else {
          this.$message.warning('提交的信息有误，请核对后再提交。')
        }
      })
    },
    // 微信支付
    handleWeCharPay(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let totalFee = 0
          if (this.rechargeForm.amount !== 'defined') {
            totalFee = this.rechargeForm.amount
          } else {
            totalFee = this.rechargeForm.definedAmount
          }
          const param = {
            total_fee: totalFee,
            company: PAY_COMPANY_ID[this.appEnv]
          }

          this.imgload = true
          this.isWeCharPay = true
          SourceFinanceResource.getWxPayUrl(param).then(res => {
            this.imgload = false
            this.imgSrc = res.data.data.img_src
            this.WeCharPay_Code = res.data.data.out_trade_no
            this.getTimeInterval(this.WeCharPay_Code)
          }).catch(e => {
            this.WeCharPay_Code = ''
            this.isWeCharPay = false
            this.$message.warning('获取微信支付码失败')
          })
        } else {
          this.WeCharPay_Code = ''
          this.$message.warning('提交的信息有误，请核对后再提交')
        }
      })
    },
    handleYinlian(params = {}) {
      function openWin(html) {
        var newwindow = window.open('', '_blank', '')
        newwindow.document.write(html)
        newwindow.onload()
      }
      this.$refs.rechargeForm.validate(valid => {
        if (valid) {
          this.Fetch.post('/V4/finance.recharge.baofu_Recharge', {
            Money: this.rechargeForm.amount !== 'defined' ? this.rechargeForm.amount : this.rechargeForm.definedAmount,
            company: PAY_COMPANY_ID[this.appEnv]
          }).then(res => {
            if (res.result && res.result.formString) {
              openWin(res.result.formString)
            }
            this.$store.commit('PAY_CONFIG_VISIBLE', { visible: false })
            this.$refs.rechargeForm.resetFields()
            this.$confirm('确认已完成充值?', '提示', {
              type: 'warning',
              confirmButtonText: '已完成',
              cancelButtonText: '未完成'
            }).then(() => {
              location.reload()
            }).catch(() => {
              location.reload()
            })
          })
        }
      })
    },
    getTimeInterval(WeCharPay_Code) {
      const interval = setInterval(() => {
        if (!this.isWeCharPay || !WeCharPay_Code) {
          clearInterval(interval)
          return
        }

        this.getPayStatus(WeCharPay_Code)
      }, 2000)
    },

    getPayStatus(WeCharPay_Code) {
      const param = {
        out_trade_no: WeCharPay_Code,
        company: PAY_COMPANY_ID[this.appEnv]
      }
      if (!this.isWeCharPay || WeCharPay_Code === '') {
        return
      }
      SourceFinanceResource.getWxpay_checkpay(param).then(res => {
        const data = res.data.data
        const status = Number(data.list.status)
        if (status === 1 || status === 2) {
          this.isWeCharPay = false
          this.WeCharPay_Code = ''
          this.getTimeInterval('')
          this.successPay(status)
        }
      }).catch(e => {
        this.getTimeInterval('')
        this.isWeCharPay = false
        this.WeCharPay_Code = ''
      })
    },

    successPay(status) {
      if (status === 1) {
        this.$message.success('支付成功')
      }
      if (this.pageType === 'rechargePage') {
        this.getUserBalance()
        this.getRechargeByPage({
          page: 1,
          per_page: this.pageSize
        })
        this.triggerPayConfigVisible(false)
      } else if (this.pageType === 'payPage') {
        this.prepayOrderByCode({
          orderCode: this.orderCode,
          couponCode: this.couponCode
        })
        this.triggerPayConfigVisible(false)
      } else {
        this.triggerPayConfigVisible(false)
        return
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.triggerPayConfigVisible(false)
    },
    resetStatus() {
      this.isWeCharPay = false
      this.checkUser = false
      this.$refs.rechargeForm.resetFields()
      this.triggerPayConfigVisible(false)
      this.successPay()
    }
  }
}
</script>

<style>
.zdy-item {
  position: absolute;
  top: 115px;
  left: 310px;
  display: inline-block;
  margin-bottom: 0;
}
.zdy-item > .el-form-item__content {
  display: inline-block;
  margin-left: 27px !important;
  width: 70px;
}
.zdy-item .el-input__inner {
  margin-left: -1px;
  height: 32px;
  border-radius: 0;
}
.zdy-item .el-form-item__error {
  width: 180px;
  line-height: 1.2;
}
.recharge-amount .el-form-item__label {
  margin-top: 5px;
}
</style>
<style lang="scss" >
.payDialog {
  /deep/ .el-dialog__body {
    min-height: 200px;
  }
  /deep/ .el-dialog__footer {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
}
.checkUser {
  display: inline-block;
  text-align: left;
}
.check-text {
  display: inline-grid;
  margin-left: 10px;
  cursor: pointer;
  width: 428px;
  font-size: 12px;
  color: #666;
}
.title-purchase {
  margin-top: 7px;
}
.pay-radio {
  .el-radio {
    .el-radio__input {
      margin-bottom: 30px !important;
    }
  }
}
.i-alipay {
  display: inline-block;
  width: 104px;
  height: 38px;
  background: url("../../assets/images/alipay.svg") no-repeat;
}

.i-wechartpay {
  display: inline-block;
  width: 134px;
  height: 38px;
  background: url("../../assets/images/WeChatPay.svg") no-repeat;
}
.i-yinlianpay {
  display: inline-block;
  width: 134px;
  height: 38px;
  background: url("../../assets/images/homepage-logo.png") no-repeat;
  background-size: 100%;
}
.wechar-code {
  display: inline-block;
  margin-top: 5px;
  border: 0.5px solid #cccccc;
  width: 174px;
  height: 155px;
}

.imgSrc {
  width: 150px;
  margin-top: 1px;
}
</style>
