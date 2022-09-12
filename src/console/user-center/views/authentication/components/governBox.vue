<template>
  <div>
    <h4 class="user-title correct-title">政府资料信息</h4>
    <div class="inline-box">
      <el-form
        ref="governForm"
        :model="governData"
        :rules="rules"
        :label-position="'right'"
        label-width="114px"
        class="box"
      >
        <el-form-item
          prop="organization_name"
          label="机构名称"
        >
          <el-input v-model="governData.organization_name" />
        </el-form-item>
        <el-form-item
          prop="organization_code"
          label="组织机构代码"
        >
          <el-input v-model="governData.organization_code" />
        </el-form-item>
        <el-form-item
          prop="charge_man_name"
          label="法定 / 负责人姓名"
        >
          <el-input v-model="governData.charge_man_name" />
        </el-form-item>
        <el-form-item
          prop="office_phone"
          label="办公室电话(选填)"
        >
          <el-input
            v-model="governData.office_phone"
            placeholder="包括区号、电话、分机号，以“-”隔开"
          />
        </el-form-item>
        <el-form-item
          prop="organization_address"
          label="机构地址(选填)"
        >
          <el-input
            v-model="governData.organization_address"
            placeholder="能够收发信件的有效地址"
          />
        </el-form-item>
        <div class="upload-container">
          <label
            for=""
            class="tip-required"
          >事业单位法人证书或组织机构代码证(选填)</label>
          <el-upload
            :action="uploadAdd"
            :before-upload="limit"
            :file-list="fileList"
            :on-success="getPicUrl"
            :on-remove="handleRemove"
            :data="typeData"
            class="upload-box"
            drag
            list-type="picture"
            name="organization_certificate_pic"
          >
            <div class="tip-box">
              <i class="ya-iconfont ya-yun-upload user-icon" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
            <div
              slot="tip"
              class="el-upload__tip govern"
            >只能上传jpg/png文件，且不超过2M。
              <el-popover trigger="hover">
                <img
                  src="../../../assets/images/governPic.jpg"
                  alt="demo"
                >
                <a slot="reference">示例</a>
              </el-popover>
            </div>
          </el-upload>
        </div>
      </el-form>
    </div>
    <h4 class="user-title correct-title">联系信息</h4>
    <div class="inline-box">
      <el-form
        ref="governForm"
        :model="governData"
        :rules="rules"
        :label-position="'right'"
        label-width="114px"
        class="box"
      >
        <el-form-item
          prop="contact_name"
          label="姓名"
          class="box"
        >
          <el-input v-model="governData.contact_name" />
        </el-form-item>
        <el-form-item
          prop="contact_mobile"
          label="手机号码"
        >
          <el-input v-model="governData.contact_mobile" />
        </el-form-item>
        <el-form-item
          prop="contact_qq"
          label="联系QQ"
        >
          <el-input v-model="governData.contact_qq" />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button
        type="primary"
        class="submit-btn"
        @click="submitForm('governForm')"
      >{{ typeTip }}</el-button>
    </div>
  </div>
</template>

<script>
import personalBox from './personalBox'
import {
  BASE_URL
} from '@/config/interceptor'
import SourceUserResource from '../../../assets/js/resource/SourceUserResource'
import verify from '@/utils/verify'
import { judgeEmpty } from '../../../assets/js/normal'
export default {
  components: {
    personalbox: personalBox
  },

  data() {
    function validateOrganizationCode(rule, value, callback) {
      if (value) {
        if (!verify.organizationCode.test(value) && !verify.organizationCode18.test(value)) {
          callback(new Error('请输入正确的组织机构代码'))
        }
      }
      callback()
    }

    function validateOfficePhone(rule, value, callback) {
      if (value) {
        if (verify.landline.test(value) === false) {
          callback(new Error('请输入正确的办公室电话'))
        }
      }
      callback()
    }

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
      typeData: {
        fileKey: 'organization_certificate_pic'
      },
      fileList: [],
      typeTip: '提交',
      uploadAdd: BASE_URL + '/sso/V4/upload/uploadPic',
      governData: {
        organization_name: '',
        organization_code: '',
        charge_man_name: '',
        office_phone: '',
        organization_address: '',
        organization_certificate_pic: '',
        contact_mobile: '',
        contact_qq: '',
        contact_name: ''
      },
      info: {
        organization_name: '机构名称',
        organization_code: '组织机构代码',
        charge_man_name: '法定代表人/负责人姓名',
        contact_mobile: '联系人手机号',
        contact_qq: '联系人QQ',
        contact_name: '联系人姓名'
      },
      rules: {
        organization_name: [{
          min: 2,
          max: 32,
          message: '长度在 2 到 32 个字符',
          trigger: 'blur'
        }],
        organization_code: [{
          validator: validateOrganizationCode,
          trigger: 'blur'
        }],
        charge_man_name: [{
          min: 2,
          max: 20,
          message: '长度在 2 到 20 个字符',
          trigger: 'blur'
        }, {
          validator: validateName,
          trigger: 'blur'
        }],
        office_phone: [{
          validator: validateOfficePhone,
          trigger: 'blur'
        }],
        organization_address: [{
          min: 2,
          max: 32,
          message: '长度在 2 到 32 个字符',
          trigger: 'blur'
        }],
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
  mounted() {
    if (this.$store.state.authentiStore.status === 3 ||
      this.$store.state.authentiStore.status === 5) {
      this.typeTip = '重新提交'
      // for (const item in this.dynamicValidateForm)
      //   this.dynamicValidateForm[item] = this.$store.state.authentiStore.info.company[item]
    }
  },
  methods: {
    handleRemove(file) {
      this.governData.organization_certificate_pic = ''
    },
    limit(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!(isJPG || isPNG)) {
        this.$message.error('上传图片只能是JPG/PNG 格式!')
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    submitForm(formName) {
      this.$refs.governForm.validate(valid => {
        if (valid) {
          if (judgeEmpty(this.governData, this.info) === true) {
            if (this.$store.state.authentiStore.status === 8 ||
              this.$store.state.authentiStore.status === 3) {
              SourceUserResource.updateGovernmentCertification(this.governData)
                .then(response => {
                  this.successCallback(response)
                })
            } else if (this.$store.state.authentiStore.status === 1) {
              SourceUserResource.personalUpgradeGovernment(this.governData)
                .then(response => {
                  this.successCallback(response)
                })
            } else {
              SourceUserResource.addGovernmentCertification(this.governData)
                .then(response => {
                  this.successCallback(response)
                })
            }
          }
        } else {
          return false
        }
      })
    },
    getPicUrl(response, file, fileList) {
      if (response.code === 1) {
        this.governData.organization_certificate_pic = response.data.real_url
        this.fileList.push({
          name: response.data.key,
          url: response.data.real_url
        })
        if (this.fileList.length !== 1) {
          this.fileList.forEach((item, i) => {
            if (item.name !== file.name) { this.fileList.splice(i, 1) }
          })
        }
      } else {
        this.fileList = []
        this.$message.error(response.status.message)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      const index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.example-company {
  position: relative;
  height: 467px;
}

/*.tip-required:first-letter{
  color: red;
}*/

.btn-location-company {
  margin-left: 0;
}

.image-company {
  padding: 5px 110px;
  border: 1px dashed #d6d6d6;
  border-radius: 5px;
  position: absolute;
  bottom: 108px;
  left: 100px;
}

.word {
  position: absolute;
  bottom: 213px;
  left: 10px;
  color: $--color-primary;
  font-size: 14px;
}
</style><style>
/*.dynamic-box .el-button--primary {
  padding: 10px 54px!important;
  letter-spacing: 2px;
  display: block;
}*/
</style><style lang="scss" scoped>
.image {
  width: 330px;
  border: 1px dashed #d6d6d6;
  border-radius: 5px;
  position: absolute;
  bottom: 108px;
  left: 100px;
}

.word {
  position: absolute;
  bottom: 213px;
  left: 10px;
  color: $--color-primary;
  font-size: 14px;
}

.government-icon {
  background: url("../../../assets/images/governPic.jpg") center center
    no-repeat;
  width: 567px;
  height: 204px;
  left: 100%;
  top: -110px;
}

.govern {
  left: 69%;
  top: 38px;
}
</style>
