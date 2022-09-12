<style lang="scss">
.safeConfig {
  .area {
    &-list-wrap {
      max-width: 650px;
    }
    &-item {
      width: 200px;
      display: inline-block;
      &__btn {
        cursor: pointer;
        color: #ddd;
        margin-right: 8px;
        &:hover {
          color: $--color-primary;
        }
      }
    }
  }

  .yd-input-phone {
    position: relative;
    .el-input-group__append {
      position: absolute;
      right: 34px;
      top: -3px;
      height: 30px;
      line-height: 35px;
      color: #999;
      background: transparent;
      border: 0;
    }
  }

  .binded::before,
  .unbind::before {
    content: "";
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    right: 85%;
    top: 10px;
  }

  .binded::before {
    background: url(../../assets/images/bind.svg);
  }

  .unbind::before {
    background: url(../../assets/images/unbind.svg);
  }
  .yd-input-phone {
    width: 200px;
    .el-input__inner {
      width: 200px !important;
    }
  }
}
</style>

<template>
  <console-page-layout
    class="safeConfig"
    title="安全设置"
  >
    <!-- 敏感操作身份验证 -->
    <yd-dialog-safe-verify
      ref="verify"
      :mobile="dialogSafeVerify.mobile"
      :group="dialogSafeVerify.group"
      @close="init"
    />
    <div>
      <DmAlert>请先设置你的安全手机与安全密保，设置完成后才能使用安全设置功能</DmAlert>
      <yd-panel>
        <yd-form
          class="yd-form"
          width="400px"
          label-width="100px"
        >
          <el-form-item label="安全手机">
            <el-input
              :disabled="data.bindMobile"
              v-model="data.mobile"
              class="yd-input-phone"
            >
              <span
                slot="append"
                :class="data.bindMobile ? 'binded' : 'unbind'"
                class="user-status"
              >{{ data.bindMobile ? '已绑定' : '未绑定' }}</span>
            </el-input>
            <el-button
              v-if="data.bindMobile"
              @click="handleGotoInfo"
            >修改</el-button>
            <el-button
              v-else
              @click="handleGotoInfo"
            >绑定</el-button>
          </el-form-item>
        </yd-form>
        <div class="yd-panel__desc">
          安全密保：安全密保可找回密码，登录二次验证保护等进行验证，进一步保障账号安全。

          <template v-if="setting.isSecurityQs">
            <TipsButton v-if="appAssets.afterKF">忘记安全密保问题？</TipsButton>
            <a
              v-else
              @click="Dialog.open(dialogQa)"
            >忘记安全密保问题？</a>
          </template>
          <a
            v-else
            @click="handleDialogSecurityQsOpen"
          >设置安全密保</a>
        </div>
      </yd-panel>

      <yd-panel title="二次验证">
        <p class="yd-panel__desc">为了您的账户增添一层安全保护，如：登录、修改密码，同时选择验证码与密保问题后，在登录时需同时满足两者条件。</p>
        <el-checkbox
          v-model="setting.loginSecondVerify"
          label="手机短信验证码"
          @change="handleSettingUpdate('loginSecondVerify')"
        />
        <el-checkbox
          v-model="setting.loginSecondVerify_pass_pro_qs"
          label="安全密保问题"
          @change="val => handleSettingUpdate('loginSecondVerify_pass_pro_qs', val)"
        />
      </yd-panel>

      <yd-panel title="账号登录白名单">
        <p class="yd-panel__desc">可进一步保障您的账号安全，账号登录白名单分为 IP 与区域。同时选择了 IP 白名单与区域白名单后，设置后的 IP 可与区域均可登录。</p>
        <el-form label-width="100px">
          <el-form-item>
            <el-checkbox
              v-model="setting.ipWhileVerify"
              class="yd-panel__desc"
              label="IP 登录白名单"
              @change="handleSettingUpdate('ip_white_list')"
            />
          </el-form-item>
          <el-form-item label="添加 IP">
            <el-input
              v-model="formIp.content"
              :rows="5"
              style="width: 500px"
              type="textarea"
              placeholder="请输入 IP，多个 IP 用“，”隔开。设置后只允许列表中 IP 登录此账号。"
              @blur="handleIpListUpdate"
            />
          </el-form-item>
        </el-form>
        <el-form label-width="100px">
          <el-form-item>
            <el-checkbox
              v-model="setting.zoneWhiteVerify"
              label="区域登录白名单"
              @change="handleSettingUpdate('zone_white_list')"
            />
          </el-form-item>
          <el-form-item label="添加区域">
            <el-select
              v-model="formZone.country"
              style="width: 140px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in CountryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-if="formZone.country === 'CN'"
              v-model="formZone.province"
              style="width: 140px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ProvinceList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button
              :loading="formZone.loading"
              type="primary"
              @click="handleAreaAdd"
            >添加</el-button>
          </el-form-item>
          <el-form-item label="">
            <div class="area-list-wrap">
              <div
                v-for="(item, index) in formZone.areaList"
                :key="index"
                class="area-item"
              >
                <i
                  class="area-item__btn el-icon-circle-close"
                  @click="hanldeAreaRemove(index)"
                />
                <span class="area-item__text">{{ item | areaViewStage }}</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </yd-panel>

      <yd-panel title="登录时间控制">
        <p class="yd-panel__desc">为进一步保障您的账号安全，您可自定义登入时间。登入时间内，若用户对网站没有任何操作，则会自动退出，用户再次打开网站需重新登录。</p>
        <DmAlert>以分钟为单位最低设置15分钟，最高1440分钟；以小时为单位最低设置1小时，最高24小时；默认登入时间为8小时</DmAlert>
        <el-checkbox
          v-model="setting.session_active_time"
          label="自定义登入时间"
          @change="e =>{
            if (e) {
              session_active.time = session_active.time || 15
              session_active.unit = session_active.unit || 'm'
            } else {
              session_active.time = 8
              session_active.unit = 'h'
              handleSettingUpdate('session_active_time')
            }
          }"
        />
        <p
          v-show="setting.session_active_time"
          style="margin-top:10px;"
        >
          <el-input-number
            v-model="session_active.time"
            :disabled="!setting.session_active_time"
            :precision="0"
            :min="TIME_CASE[session_active.unit].min"
            :max="TIME_CASE[session_active.unit].max"
            controls-position="right"
            style="margin-right:5px"
          />
          <el-select
            v-model="session_active.unit"
            :disabled="!setting.session_active_time"
            style="width:100px;margin-right:5px;"
            @change="changeSessionActiveUnit"
          >
            <el-option
              value="m"
              label="分钟"
            />
            <el-option
              value="h"
              label="小时"
            />
          </el-select>
          <el-button
            type="primary"
            @click="handleSettingUpdate('session_active_time')"
          >保存</el-button>
        </p>
      </yd-panel>
    </div>
    <!-- 设置安全密保 - 填写问题 -->
    <el-dialog
      :visible.sync="dialogQa.visible"
      title="设置安全密保"
      @close="init"
    >
      <yd-tips
        v-if="dialogQa.tips"
        type="warning"
      >请选择三个不同的问题</yd-tips>
      <yd-form
        width="400px"
        mode="dialog-qa"
      >
        <div
          v-for="(item, index) in dialogQa.form.answer"
          :key="index"
        >
          <el-form-item :label="'问题 ' + (index + 1)">
            <el-select
              v-model="item.name"
              placeholder="请选择"
              @change="handleQsListCheck(dialogQa)"
            >
              <el-option
                v-for="(label, value) in qaList"
                :key="label"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="item.value" />
          </el-form-item>
        </div>
        <el-form-item label="手机号">
          <el-input
            v-model="data.mobile"
            disabled
          />
        </el-form-item>
        <yd-form-item-caption
          :cap="dialogQa.form.cap"
          type="setSecurityQsSendMobileCap"
          @change="updateQsCode"
        />
      </yd-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="dialogQa.loading"
          type="primary"
          @click="handleQaSubmit"
        >确认</el-button>
      </span>
    </el-dialog>
    <!-- 关闭安全密保验证 -->
    <el-dialog
      :visible.sync="dialogCloseQa.visible"
      title="身份验证"
      @close="init"
    >
      <yd-tips>
        1. 为了您的账号安全，进行敏感操作前需先验证身份。<br> 2. 如果您已忘记安全密保答案，
        <template v-if="appEnv === 'baishan'">
          请联系<TipsButton>售后客服</TipsButton>
        </template>
        <template v-else>
          请修改
          <a @click="jumpDialog(dialogCloseQa, dialogQa)">安全密保问题</a>
        </template>
      </yd-tips>
      <yd-form
        width="400px"
        mode="dialog-qa"
      >
        <el-form-item label="密保问题">
          <el-select
            v-model="dialogCloseQa.form.qs_flag"
            placeholder="请选择"
          >
            <el-option
              v-for="(label, value) in qaList"
              :key="label"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="dialogCloseQa.form.qs_answer" />
        </el-form-item>
      </yd-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="dialogCloseQa.loading"
          type="primary"
          @click="handleQaCloseSubmit"
        >下一步</el-button>
      </span>
    </el-dialog>
  </console-page-layout>
</template>

<script>
import CountryList from '@/constants/country-list'
import { province as ProvinceList } from '@/constants/city-data'
import RULE from '@/utils/verify'
import { deepClone } from '@/utils'
import { jumpDialog } from '@/service/ui'
import Dialog from '@/service/dialog'
import SourceUserResource from '../../assets/js/resource/SourceUserResource'
import YdPanel from '../../Components/YdPanel/YdPanel'
import YdForm from '../../Components/YdForm/YdForm'
import YdDialog from '../../Components/YdDialog/YdDialog'
import YdFormItemCaption from '../../Components/YdForm/YdFormItemCaption'
import YdInputSafeCode from '../../Components/YdInput/YdInputSafeCode'
import * as FORM from '../../constants/form'
import { isRepeat } from '@/utils/array'
import YdDialogSafeVerify from '../../Components/YdDialog/YdDialogSafeVerify'

export default {
  components: {
    YdPanel,
    YdForm,
    YdInputSafeCode,
    YdDialog,
    YdFormItemCaption,
    YdDialogSafeVerify
  },

  props: {
    updateTime: [String, Number]
  },

  data() {
    return {
      jumpDialog,
      ProvinceList,
      CountryList,
      Dialog,
      data: {},
      qaList: [],
      // 安全设置
      setting: {
        loginSecondVerify: false, // 手机二次验证开关配置
        loginSecondVerify_pass_pro_qs: false, // 二次验证密保问题开关配置
        ipWhileVerify: false,
        zoneWhiteVerify: false,
        isSecurityQs: true, // 是否已经设置安全密保
        session_active_time: false
      },
      // 登录白名单
      formIp: {
        content: '',
        loading: false
      },
      formZone: deepClone(FORM.USER_SAFE_ZONE),
      dialogCloseQa: Dialog.create(FORM.USER_SAFE_CLOSE_QA),
      // 密保问题设置弹框
      dialogQa: Dialog.create(FORM.FORM_SAFE),
      dialogQaRestNext: Dialog.create(FORM.USER_SAFE_REST_QA),
      dialogSafeVerify: {
        mobile: null,
        type: null
      },
      session_active: {
        second: 15 * 60,
        time: 15,
        unit: 'm'
      },

      TIME_CASE: {
        'm': {
          min: 15,
          max: 1440
        },
        'h': {
          min: 1,
          max: 24
        }
      },
      SECOND: {
        'm': (time, unit) => {
          return time * 60
        },
        'h': (time, unit) => {
          return time * 60 * 12
        }
      }
    }
  },

  computed: {
    dialogQaTitle() {
      if (this.setting.isSecurityQs) {
        return '重置安全密保'
      } else {
        return '设置安全密保'
      }
    }
  },

  watch: {
    updateTime() {
      this.init()
    }
  },

  mounted() {
    this.getQaList()
    this.init()
  },
  methods: {
    formatAreaItem(value) {
      return value.replace('CN-', '')
    },
    handleQsListCheck(dialog) {
      const { answer } = dialog.form
      const list = answer.map(item => item.name)
      dialog.tips = isRepeat(list)
    },
    init() {
      this.setting.loginSecondVerify_pass_pro_qs = false
      SourceUserResource.getMemberSetting({
        group: [
          'loginSecondVerify',
          'loginSecondVerify_pass_pro_qs',
          'security_qs',
          'ip_white_list',
          'zone_white_list',
          'session_active_time'
        ]
      }).then(response => {
        const { data } = response
        const {
          loginSecondVerify,
          loginSecondVerify_pass_pro_qs,
          zone_white_list,
          security_qs,
          ip_white_list,
          session_active_time
        } = data.data[0]

        if (session_active_time && session_active_time.status) {
          this.setting.session_active_time = parseInt(session_active_time.status, 10) === 1
          this.session_active.time = session_active_time.time
          this.session_active.unit = session_active_time.unit
        }
        // 是否开启登录验证
        if (loginSecondVerify && loginSecondVerify.status) {
          this.setting.loginSecondVerify = parseInt(loginSecondVerify.status, 10) === 1
        }

        if (loginSecondVerify_pass_pro_qs && loginSecondVerify_pass_pro_qs.status) {
          this.setting.loginSecondVerify_pass_pro_qs = Number(loginSecondVerify_pass_pro_qs.status) === 1
        }

        if (ip_white_list) {
          this.formIp.content = ip_white_list.content
          this.setting.ipWhileVerify = parseInt(ip_white_list.status, 10) === 1
        }

        if (zone_white_list && zone_white_list.status) {
          this.setting.zoneWhiteVerify = parseInt(zone_white_list.status, 10) === 1
          if (zone_white_list.content) {
            this.formZone.areaList = zone_white_list.content.split(',')
          }
        }

        if (security_qs) {
          this.setting.isSecurityQs = true
        } else {
          this.setting.isSecurityQs = false
        }
      })
      SourceUserResource.getUserInfo().then(response => {
        const { data } = response
        // 转 Boolean
        data.bindMobile = data.bindMobile === 1
        data.loginSecondVerify_pass_pro_qs = data.loginSecondVerify_pass_pro_qs === 1 // 二次验证密保问题开关

        this.data = data
        // this.$emit('open-safe-verify', this.data)
      })
    },
    // 获取问题列表
    getQaList() {
      if (this.qaList.length > 0) return
      SourceUserResource.getSecurityQs().then(res => {
        const { data } = res
        this.qaList = data.data[0]
      })
    },
    changeSessionActiveUnit(val) {
      if (val === 'm') {
        this.session_active.time = 15
      } else if (val === 'h') {
        this.session_active.time = 1
      }
    },
    // 安全问题 - 弹框打开
    handleDialogSecurityQsOpen() {
      this.getQaList()
      Dialog.open(this.dialogQa)
    },
    // 安全问题 - 提交
    handleQaSubmit() {
      if (this.dialogQa.tips) {
        this.$message.error('请选择三个不同的问题')
        return
      }

      this.dialogQa.loading = true
      const { form } = this.dialogQa
      const { cap, answer } = form
      const param = {
        cap,
        answer,
        group: 'security_qs'
      }

      SourceUserResource.changeConfig(param).then(response => {
        const { code, message } = response.data.status
        this.dialogQa.loading = false

        if (code === 1) {
          this.$message.success('修改设置成功')

          Dialog.rest(this.dialogQa)
          Dialog.close(this.dialogQa)
          this.init()
        } else {
          this.$message.warning(message)
        }
      })
    },
    // 关闭密保问题 - 提交
    handleQaCloseSubmit() {
      this.dialogCloseQa.loading = true
      const { form } = this.dialogCloseQa
      const { qs_flag, qs_answer } = form
      const param = {
        status: 0,
        qs_flag,
        qs_answer,
        group: 'loginSecondVerify_pass_pro_qs'
      }
      SourceUserResource.changeConfig(param).then(response => {
        this.dialogCloseQa.loading = false
        const { code, message } = response.data.status
        if (code === 1) {
          this.$message.success('修改设置成功')
          this.dialogCloseQa.visible = false
          this.init()
        } else {
          this.$message.warning(message)
        }
      })
    },
    // IP 白名单 - 提交
    handleIpListUpdate() {
      let { content } = this.formIp

      // IP 地址校验
      if (content) {
        content = content.replace(/，/gm, ',')
        this.formIp.content = content

        const list = content.split(',')
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (!RULE.ipReg.test(item)) {
            this.$message.warning('IP 地址有误')
            return
          }
        }
      }

      const param = {
        group: 'ip_white_list',
        content
      }

      SourceUserResource.changeConfig(param).then(response => {
        const { code, message } = response.data.status
        this.formZone.loading = false
        if (code === 1) {
          this.$message.success('修改设置成功')
          this.init()
        } else {
          this.$message.warning(message)
        }
      })
    },
    // 区域白名单 - 添加区域
    handleAreaAdd() {
      const { country, province, areaList } = this.formZone
      this.formZone.loading = true

      let item = country
      if (country === 'CN' && province) item += '-' + province
      areaList.push(item)

      const param = {
        group: 'zone_white_list',
        content: areaList.join(',')
      }

      SourceUserResource.changeConfig(param).then(response => {
        const { code, message } = response.data.status
        this.formZone.loading = false
        if (code === 1) {
          this.$message.success('修改设置成功')
        } else {
          this.$message.warning(message)
        }
      })
    },
    // 区域白名单 - 移除区域
    hanldeAreaRemove(index) {
      const { areaList } = this.formZone
      areaList.splice(index, 1)

      const param = {
        group: 'zone_white_list',
        content: areaList.join(',')
      }

      SourceUserResource.changeConfig(param).then(response => {
        const { code } = response.data.status
        if (code === 1) {
          this.$message.success('删除成功')
          this.formZone.loading = false
        } else {
          this.$message.warning('修改失败')
          this.formZone.loading = false
        }
      })
    },
    // 启动安全验证
    handleOpenSafeVerify(form) {
      const { mobile, group } = form
      this.dialogSafeVerify.mobile = mobile
      this.dialogSafeVerify.group = group
      this.$refs.verify.open()
    },
    // 用户设置 - 更新
    handleSettingUpdate(group, val) {
      if (!group) return

      const param = { group }

      if (group === 'loginSecondVerify') {
        const status = this.setting.loginSecondVerify === true ? 1 : 0
        param.status = status

        // 关闭验证开启需弹出安全验证
        if (!status) {
          this.$emit('open-safe-verify', {
            mobile: this.data.mobile,
            group
          })
          return
        }
      } else if (group === 'loginSecondVerify_pass_pro_qs') {
        // 密保验证开关
        const status = this.setting.loginSecondVerify_pass_pro_qs === true ? 1 : 0

        if (!status) {
          this.getQaList()
          // this.setting.loginSecondVerify_pass_pro_qs = !this.setting.loginSecondVerify_pass_pro_qs
          this.dialogCloseQa.visible = true
          this.dialogCloseQa.form = {
            qs_flag: 'father_name',
            qs_answer: ''
          }
          return
        }

        // 未填写密保验证
        if (!this.setting.isSecurityQs) {
          // this.setting.loginSecondVerify_pass_pro_qs = !this.setting.loginSecondVerify_pass_pro_qs
          this.handleDialogSecurityQsOpen()
          return
        }

        param.status = status
      } else if (group === 'ip_white_list') {
        const status = this.setting.ipWhileVerify === true ? 1 : 0
        param.content = this.formIp.content

        if (param.content === '' && status) {
          this.$message.error('请先设置 IP 登录白名单')
          this.setting.ipWhileVerify = !this.setting.ipWhileVerify
          return
        }
        param.status = status
      } else if (group === 'zone_white_list') {
        const status = this.setting.zoneWhiteVerify === true ? 1 : 0

        param.content = this.formZone.areaList.join(',')
        if (param.content === '' && status) {
          this.$message.error('请先设置区域列表')
          this.setting.zoneWhiteVerify = !this.setting.zoneWhiteVerify
          return
        }

        param.status = status
      } else if (group === 'session_active_time') {
        param.status = this.setting.session_active_time === true ? 1 : 0
        param.time = this.session_active.time
        param.unit = this.session_active.unit

        param.second = this.SECOND[this.session_active.unit](this.session_active.time)
        console.log(param)
      }

      SourceUserResource.changeConfig(param).then(response => {
        const { code, message } = response.data.status
        if (code === 1) {
          const msg = group === 'session_active_time' ? '自定义登入时间设置成功' : '修改设置成功'
          this.$message.success(msg)
          this.init()
        } else {
          this.$message.warning(message)
          this.init()
        }
      })
    },
    // 跳转
    handleGotoInfo() {
      window.location.href = '/console/user-center#/basicinfo'
    },
    // $$$
    updateQsCode(val) {
      this.dialogQa.form.cap = val
    },
    updateQsRestNextCode(val) {
      this.dialogQaRestNext.form.cap = val
    }
  }
}
</script>
