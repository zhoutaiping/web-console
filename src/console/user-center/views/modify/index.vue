<template>
  <console-page-layout>
    <DmCard>
      <el-form
        ref="ruleForm"
        :model="dynamicValidateForm"
        :rules="rules"
        label-width="120px"
        style="max-width: 500px"
        label-position="right"
      >
        <el-form-item
          label="手机或邮箱"
          prop="username"
        >
          <el-input v-model="dynamicValidateForm.username" />
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="captcha"
        >
          <el-input v-model="dynamicValidateForm.captcha">
            <el-button
              slot="append"
              :disabled="usernameDisabled"
              @click="mobileCode($event)"
            >发送验证码</el-button>
          </el-input>
        </el-form-item>
        <!-- 安全密保 -->
        <el-form-item
          v-if="userinfo.isSecurityQs"
          label="密保问题"
          prop="username"
        >
          <el-select
            v-model="qsForm.qs_flag"
            placeholder="请选择"
          >
            <el-option
              v-for="(label, value) in userinfo.qsList"
              :key="label"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="userinfo.isSecurityQs"
          label="问题答案"
          prop="username"
        >
          <el-input v-model="qsForm.qs_answer" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item
          label="密码"
          prop="newPassword"
        >
          <el-input
            v-model="dynamicValidateForm.newPassword"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="repeatNewPassword"
        >
          <el-input
            v-model="dynamicValidateForm.repeatNewPassword"
            type="password"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="modifyPass"
          >确认</el-button>
        </el-form-item>
      </el-form>
    </DmCard>
  </console-page-layout>
</template>

<script>
import SourceUserResource from '../../assets/js/resource/SourceUserResource'
import { addTimer, validate, asciiValidate, addDisable } from '@/assets/js/normal'
import { judgeEmpty } from '../../assets/js/normal'

export default {
  data() {
    const that = this

    function validateUsername(rule, value, callback) {
      if (
        value === '' ||
        validate.phone.test(value) === true ||
        validate.email.test(value) === true
      ) {
        callback()
      } else {
        callback(new Error('请输入正确的手机或邮箱格式'))
      }
    }

    function validatePass(rule, value, callback) {
      const psdLevel = asciiValidate(value)
      const containSpace = value.indexOf(' ')
      const valLen = value.length
      if (value) {
        if (that.dynamicValidateForm.newPassword !== '') {
          that.$refs.ruleForm.validateField('repeatNewPassword')
        }
        if (!(psdLevel >= 2 && psdLevel <= 4) || containSpace !== -1 || valLen < 6 || valLen > 20) {
          callback(new Error('长度6——20位，含大写字母，小写字母、数字及标点中的两种'))
        }
      }
      callback()
    }

    function validatePass2(rule, value, callback) {
      if (value === '') {
        callback()
      } else if (value !== that.dynamicValidateForm.newPassword) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }

    return {
      usernameDisabled: false,
      dynamicValidateForm: {
        username: '',
        captcha: '',
        newPassword: '',
        repeatNewPassword: ''
      },
      info: {
        username: '手机或邮箱',
        captcha: '验证码',
        newPassword: '密码',
        repeatNewPassword: '重复密码'
      },

      qsList: [],
      userinfo: {
        qsList: {},
        isSecurityQs: false
      },
      qsForm: {
        qs_flag: '',
        qs_answer: ''
      },
      rules: {
        username: [
          {
            validator: validateUsername,
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        repeatNewPassword: [
          {
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    getQaList() {
      return new Promise((resolve, reject) => {
        SourceUserResource.getSecurityQs().then(res => {
          const { data } = res
          resolve(data.data[0])
        })
      })
    },

    async init() {
      const qsList = await this.getQaList()

      SourceUserResource.getMemberSetting({
        group: ['security_qs']
      }).then(response => {
        const { data } = response
        const { security_qs } = data.data[0]

        if (security_qs) {
          for (const key in security_qs) {
            this.userinfo.qsList[key] = qsList[key]
          }

          this.userinfo.isSecurityQs = true
        } else {
          this.userinfo.isSecurityQs = false
        }
      })
    },

    mobileCode(e) {
      const tar = e.target || e.srcElement
      if (this.dynamicValidateForm.username === '') {
        this.$message.error('手机或邮箱格式错误')
      } else {
        SourceUserResource.modifyPassSendCap({
          username: this.dynamicValidateForm.username
        }).then(response => {
          if (response.data.status.code === 1) {
            addDisable(tar)
            addTimer(tar, 60)
          } else {
            this.$message.error(response.data.status.message)
          }
        })
      }
    },

    modifyPass() {
      const form = this.dynamicValidateForm
      const { username, captcha, newPassword, repeatNewPassword } = form
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (judgeEmpty(form, this.info) === true) {
            let param = form
            if (this.userinfo.isSecurityQs) {
              const { qs_flag, qs_answer } = this.qsForm
              param = {
                username,
                captcha,
                newPassword,
                repeatNewPassword,
                qs_flag,
                qs_answer
              }
            }
            SourceUserResource.modifyPass(param).then(response => {
              if (response.data.status.code === 1) {
                this.$message.success(response.data.status.message)
                setTimeout(() => {
                  window.location.reload()
                }, 1500)
              } else {
                this.$message.error(response.data.status.message)
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
