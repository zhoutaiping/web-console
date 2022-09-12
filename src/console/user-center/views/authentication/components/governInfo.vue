<template>
  <div class="info-box">
    <h4 class="user-title correct-title">政府信息</h4>
    <div class="card-content">
      <div class="inline-box">
        <ul class="info-content">
          <li><span class="tip-required">机构名称</span>
            <div :title="governName" class="">
              {{ governName.length > 23 ? governName.slice(0,20) + '...' : governName }}
            </div>
          </li>
          <li><span class="tip-required">机构组织代码</span>
            <div :title="governCode" class="">
              {{ governCode }}
            </div>
          </li>
          <li><span class="tip-required">法定/负责人姓名</span>
            <div :title="governMan" class="">
              {{ governMan }}
            </div>
          </li>
          <li v-if="governTel"><span class="tip-required">办公室电话</span>
            <div :title="governTel" class="">
              {{ governTel }}
            </div>
          </li>
          <li v-if="governAdd"><span class="tip-required">机构地址</span>
            <div :title="governAdd" class="">
              {{ governAdd }}
            </div>
          </li>
          <li v-if="governPic" class="pic"><span class="tip-required">事业单位</span>
            <div class="">
              已上传
            </div>
          </li>
        </ul>
      </div>

      <h4 class="user-title correct-title">联系人信息</h4>
      <div class="inline-box">
        <el-form ref="governBox" :model="contactGov" :rules="rules" :label-position="'right'" label-width="114px" class="box">
          <el-form-item prop="contact_name" label="姓名" class="box">
            <el-input v-model="contactGov.contact_name" :disabled="contactInfo.name"/>
          </el-form-item>
          <el-form-item prop="contact_mobile" label="手机号码">
            <el-input v-model="contactGov.contact_mobile" :disabled="contactInfo.mobile"/>
          </el-form-item>
          <el-form-item prop="contact_qq" label="联系QQ">
            <el-input v-model="contactGov.contact_qq" :disabled="contactInfo.qq"/>
          </el-form-item>
        </el-form>
        <div v-if="this.$store.state.authentiStore.status === 1||this.$store.state.authentiStore.status === 6" class="currentBtn">
          <el-button type="primary" @click="saveContact('governBox')">保存</el-button>
          <el-button @click="edit">修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import verify from '@/utils/verify'
import SourceUserResource from '../../../assets/js/resource/SourceUserResource'
import { judgeEmpty } from '../../../assets/js/normal'
export default {
  data() {
    function validateContactMobile(rule, value, callback) {
      if (value) {
        if (verify.strictMobile.test(value) === false) {
          callback(new Error('请输入正确的手机格式'))
        }
      }
      callback()
    }

    function validateName(rule, value, callback) {
      if (value) {
        if (verify.name.test(value) === false) {
          callback(new Error('请输入正确的姓名格式'))
        }
      }
      callback()
    }

    function validateQQ(rule, value, callback) {
      if (value) {
        if (verify.qq.test(value) === false) {
          callback(new Error('请输入正确的QQ格式'))
        }
      }
      callback()
    }
    return {
      contactGov: {
        contact_name: this.$store.state.authentiStore.info.government.contact_name,
        contact_mobile: this.$store.state.authentiStore.info.government.contact_mobile,
        contact_qq: this.$store.state.authentiStore.info.government.contact_qq,
        certification_type: 3
      },
      contactInfo: {
        name: true,
        mobile: true,
        qq: true
      },
      contactWord: {
        name: '姓名',
        mobile: '手机',
        qq: 'qq'
      },
      rules: {
        contact_name: [{
          min: 2,
          max: 32,
          message: '长度在 2 到 32 个字符',
          trigger: 'blur'
        }, {
          validator: validateName,
          trigger: 'blur'
        }],
        contact_mobile: [{
          validator: validateContactMobile,
          trigger: 'blur'
        }],
        contact_qq: [{
          validator: validateQQ,
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    governName() {
      return this.$store.state.authentiStore.info.government.organization_name
    },
    governCode() {
      return this.$store.state.authentiStore.info.government.organization_code
    },
    governMan() {
      return this.$store.state.authentiStore.info.government.charge_man_name
    },
    governTel() {
      return this.$store.state.authentiStore.info.government.office_phone
    },
    governAdd() {
      return this.$store.state.authentiStore.info.government.organization_address
    },
    governPic() {
      return this.$store.state.authentiStore.info.government.organization_certificate_pic
    },
    contact() {
      return this.$store.state.authentiStore.info.government.contact_name
    },
    contactQQ() {
      return this.$store.state.authentiStore.info.government.contact_qq
    },
    contactMobile() {
      return this.$store.state.authentiStore.info.government.contact_mobile
    }
  },
  methods: {
    edit() {
      this.contactInfo.name = false
      this.contactInfo.mobile = false
      this.contactInfo.qq = false
    },
    saveContact(formName) {
      if (!(this.contactInfo.name && this.contactInfo.mobile && this.contactInfo.qq)) {
        if (judgeEmpty(this.contactGov, this.contactWord) === true) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              SourceUserResource.editContact(this.contactGov).then(response => {
                this.successCallback(response)
                this.contactInfo.name = true
                this.contactInfo.mobile = true
                this.contactInfo.qq = true
              })
            }
          })
        }
      }
    }
  }
}
</script>
