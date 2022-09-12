<template>
  <div class="card-content">
    <h4 class="user-title correct-title">企业信息</h4>
    <div class="inline-box">
      <ul class="info-content">
        <li><span class="tip-required">企业名称</span>
          <div :title="companyName" class="">
            {{ companyName.length > 23 ? companyName.slice(0,20) + '...' : companyName }}
          </div>
        </li>
        <li><span class="tip-required">统一社会信用代码</span>
          <div class="">
            {{ companyCode }}
          </div>
        </li>
        <li v-if="companyLicense"><span class="tip-required">营业执照</span>
          <div class="">
            已上传
          </div>
        </li>
      </ul>
    </div>
    <h4 class="user-title correct-title">联系人信息</h4>
    <div class="inline-box">
      <el-form ref="contactBox" :model="contact" :rules="rules2" label-width="114px" class="box">
        <el-form-item prop="contactcontact_name" label="姓名">
          <el-input v-model="contact.contact_name" :disabled="contactInfo.name"/>
        </el-form-item>
        <el-form-item prop="contact_mobile" label="手机号码">
          <el-input v-model="contact.contact_mobile" :disabled="contactInfo.mobile"/>
        </el-form-item>
      </el-form>
      <div v-if="this.$store.state.authentiStore.status === 1||this.$store.state.authentiStore.status === 6" class="currentBtn">
        <el-button type="primary" @click="saveContact('contactBox')">保存</el-button>
        <el-button @click="edit">修改</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  judgeEmpty
} from '../../../assets/js/normal'
import SourceUserResource from '../../../assets/js/resource/SourceUserResource'
import {
  validate
} from '@/assets/js/normal'
export default {
  data() {
    function validateCompanyContactMobile(rule, value, callback) {
      if (value) {
        if (validate.phone.test(value) === false) {
          callback(new Error('请输入正确的手机格式'))
        }
      }
      callback()
    }

    return {
      contact: {
        contact_name: this.$store.state.authentiStore.info.company.company_concat_name,
        contact_mobile: this.$store.state.authentiStore.info.company.company_concat_mobile,
        certification_type: 2
      },
      contactWord: {
        contact_name: '联系人姓名',
        contact_mobile: '手机号码'
      },
      rules2: {
        contact_name: [{
          min: 2,
          max: 32,
          message: '长度在 2 到 32 个字符',
          trigger: 'blur'
        }],
        contact_mobile: [{
          validator: validateCompanyContactMobile,
          trigger: 'blur'
        }]
      },
      contactInfo: {
        name: true,
        mobile: true
      }
    }
  },
  computed: {
    companyName() {
      return this.$store.state.authentiStore.info.company.company_name
    },
    companyCode() {
      return this.$store.state.authentiStore.info.company.company_tyshxy_card
    },
    companyLicense() {
      return this.$store.state.authentiStore.info.company.company_yyzz_pic
    }
    // contact() {
    //   return this.$store.state.authentiStore.info.company.company_concat_name
    // },
    // contactMobile() {
    //   return this.$store.state.authentiStore.info.company.company_concat_mobile
    // }
  },
  methods: {
    edit() {
      this.contactInfo.name = false
      this.contactInfo.mobile = false
    },
    saveContact(formName) {
      if (!(this.contactInfo.name && this.contactInfo.mobile)) {
        if (judgeEmpty(this.contact, this.contactWord) === true) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              SourceUserResource.editContact(this.contact).then(response => {
                this.successCallback(response)
                this.contactInfo.name = true
                this.contactInfo.mobile = true
              })
            }
          })
        }
      }
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
.currentBtn {
  font-size: 12px;
  margin-left: 114px;
  button {
    height: 30px;
    padding: 5px 15px;
  }
}

</style>
