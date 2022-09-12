<template>
  <div class="card-content correct-card">
    <h4 class="user-title correct-title">个人信息</h4>
    <div class="inline-box">
      <ul
        class="info-content"
        style="margin-left: -4px;"
      >
        <li><span class="tip-required">姓名</span>
          <div
            :title="name"
            class=""
          >
            {{ name.length > 23 ? name.slice(0,20) + '...' : name }}
          </div>
        </li>
        <li><span class="tip-required">{{ status|typeFilter }}</span>
          <div
            :title="numberContent"
            class=""
          >
            {{ numberContent }}
          </div>
        </li>
        <li class="pic"><span class="tip-required">手持{{ status|typeFilter }}正面</span>
          <div class="">
            {{ pic|filterPic }}
          </div>
        </li>
        <li class="pic"><span class="tip-required">手持{{ status|typeFilter }}反面</span>
          <div class="">
            {{ negativePic|filterNegative }}
          </div>
        </li>
      </ul>
    </div>
    <h4 class="user-title correct-title">联系信息</h4>
    <div class="inline-box">
      <el-form
        ref="contactBox"
        :model="contactPersonal"
        :rules="rules"
        label-width="110px"
        label-position="right"
        class="box"
      >
        <el-form-item
          label="手机号码"
          prop="contact_mobile"
        >
          <el-input
            v-model="contactPersonal.contact_mobile"
            :disabled="contactInfo.mobile"
          />
        </el-form-item>
      </el-form>
      <div
        v-if="this.$store.state.authentiStore.status === 1||this.$store.state.authentiStore.status === 6"
        class="currentBtn"
      >
        <el-button
          type="primary"
          @click="saveContact('contactBox')"
        >保存</el-button>
        <el-button @click="edit">修改</el-button>
      </div>
    </div>
  </div>
</template>
<style media="screen" lang="scss">
.user-title::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 20px;
  background: $--color-primary;
  vertical-align: text-bottom;
  margin-right: 11px;
}
</style>

<script>
import { judgeEmpty } from '../../../assets/js/normal'
import SourceUserResource from '../../../assets/js/resource/SourceUserResource'
import {
  validate
} from '@/assets/js/normal'
export default {
  filters: {
    typeFilter(value) {
      switch (parseInt(value, 0)) {
        case 1:
          return '身份证'
        case 2:
          return '回乡证'
        case 3:
          return '台胞证'
        case 4:
          return '护照'
        default:
          return '身份证'
      }
    },
    filterPic(value) {
      return value ? '已上传'
        : '未上传'
    },
    filterNegative(value) {
      return value ? '已上传'
        : '未上传'
    }
  },
  data() {
    const t = this
    function validateMobile(rule, value, callback) {
      if (value && t.status === 1) {
        if (validate.phone.test(value) === false) {
          callback(new Error('请输入正确的手机号'))
        }
      } else if (value) {
        if (validate.overseaPhone.test(value) === false) {
          callback(new Error('请输入正确的手机号'))
        }
      }
      callback()
    }
    return {
      areaState: '身份证',
      status: this.$store.state.authentiStore.area,
      pic: this.$store.state.authentiStore.info.personal.personal_pic,
      negativePic: this.$store.state.authentiStore.info.personal.personal_pic_negative,
      contactPersonal: {
        contact_mobile: this.$store.state.authentiStore.info.personal.personal_mobile,
        certification_type: 1,
        area: this.$store.state.authentiStore.area
      },
      contactInfo: {
        mobile: true
      },
      contactWord: {
        contact_mobile: '手机'
      },
      rules: {
        contact_mobile: [{
          validator: validateMobile,
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    name() {
      return this.$store.state.authentiStore.info.personal.personal_name
    },
    numberContent() {
      return this.$store.state.authentiStore.info.personal.personal_number
    },
    mobile() {
      return this.$store.state.authentiStore.info.personal.personal_mobile
    }
  },
  methods: {
    edit() {
      this.contactInfo.mobile = false
    },
    saveContact(formName) {
      if (!(this.contactInfo.name && this.contactInfo.mobile && this.contactInfo.qq)) {
        if (judgeEmpty(this.contactPersonal, this.contactWord) === true) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              SourceUserResource.editContact(this.contactPersonal).then(response => {
                this.successCallback(response)
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
