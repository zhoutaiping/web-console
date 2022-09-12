<template>
  <div>
    <div>
      <h4 class="user-title correct-title">公司信息</h4>
      <div class="inline-box">
        <el-form
          ref="companyForm"
          :model="dynamicValidateForm"
          :rules="rules"
          label-width="114px"
          label-position="right"
          class="box"
        >
          <el-form-item
            prop="company_name"
            label="企业名称"
          >
            <el-input v-model="dynamicValidateForm.company_name" />
          </el-form-item>
          <el-form-item
            class="company_tyshxy_card"
            prop="company_tyshxy_card"
            label="统一社会信用代码"
          >
            <el-input v-model="dynamicValidateForm.company_tyshxy_card" />
          </el-form-item>
          <div class="upload-container">
            <label
              for=""
              class="tip-required"
            >营业执照</label>
            <el-upload
              :action="uploadAdd"
              :before-upload="limit"
              :file-list="fileList"
              :on-success="getPicUrl"
              :on-remove="handleRemove"
              class="upload-box"
              drag
              list-type="picture"
              name="company_yyzz_pic"
            >
              <div class="tip-box">
                <i class="ya-iconfont ya-yun-upload user-icon" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </div>
            </el-upload>
            <div
              slot="tip"
              class="el-upload__tip"
            >只能上传jpg/png文件，且不超过2M。
              <el-popover trigger="hover">
                <img
                  alt="business license"
                  src="../../../assets/images/business_license.png"
                >
                <a slot="reference">营业执照示例</a>
              </el-popover>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div>
      <h4 class="user-title correct-title">联系信息</h4>
      <div class="inline-box">
        <el-form
          ref="dynamicValidateForm"
          :model="dynamicValidateForm"
          :rules="rules2"
          label-width="114px"
          class="box"
        >
          <el-form-item
            prop="company_concat_name"
            label="姓名"
          >
            <el-input v-model="dynamicValidateForm.company_concat_name" />
          </el-form-item>
          <el-form-item
            prop="company_concat_mobile"
            label="手机号码"
          >
            <el-input v-model="dynamicValidateForm.company_concat_mobile" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="btn-location">
      <el-button
        type="primary"
        class="submit-btn"
        @click="submitForm('companyForm')"
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
import {
  validate
} from '@/assets/js/normal'
import { judgeEmpty } from '../../../assets/js/normal'
export default {
  components: {
    personalbox: personalBox
  },

  data() {
    function validateCompanySocialCode(rule, value, callback) {
      if (value) {
        if (validate.socialCode.test(value) === false) {
          callback(new Error('请输入正确的统一社会信用代码'))
        }
      }
      callback()
    }

    function validateCompanyCompanyName(rule, value, callback) {
      if (value) {
        if (validate.companyName.test(value) === false) {
          callback(new Error('请输入正确的公司名称'))
        }
      }
      callback()
    }

    function validateCompanyContactMobile(rule, value, callback) {
      if (value) {
        if (validate.phone.test(value) === false) {
          callback(new Error('请输入正确的手机格式'))
        }
      }
      callback()
    }

    return {
      fileList: [],
      typeTip: '提交',
      uploadAdd: BASE_URL + '/sso/V4/upload/yyzzPic',
      dynamicValidateForm: {
        company_name: '',
        company_tyshxy_card: '',
        company_yyzz_pic: '',
        company_concat_name: '',
        company_concat_mobile: ''
      },
      info: {
        company_name: '企业名称',
        company_tyshxy_card: '统一社会信用代码',
        company_concat_name: '姓名',
        company_concat_mobile: '手机号码',
        company_yyzz_pic: '营业执照照片'
      },
      rules: {
        company_name: [{
          min: 2,
          max: 32,
          message: '长度在 2 到 32 个字符',
          trigger: 'blur'
        },
        {
          validator: validateCompanyCompanyName,
          trigger: 'blur'
        }
        ],
        company_tyshxy_card: [{
          validator: validateCompanySocialCode,
          trigger: 'blur'
        }]
      },
      rules2: {
        company_concat_name: [{
          min: 2,
          max: 32,
          message: '长度在 2 到 32 个字符',
          trigger: 'blur'
        }],
        company_concat_mobile: [{
          validator: validateCompanyContactMobile,
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
      this.dynamicValidateForm.company_yyzz_pic = ''
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs.dynamicValidateForm.validate(valid => {
            if (valid) {
              if (judgeEmpty(this.dynamicValidateForm, this.info) === true) {
                if (this.$store.state.authentiStore.status === 5 ||
                  this.$store.state.authentiStore.status === 3) {
                  SourceUserResource.updateCompanyCertification(this.dynamicValidateForm)
                    .then(response => {
                      this.successCallback(response)
                    })
                } else if (this.$store.state.authentiStore.status === 1 && this.$store.state.authentiStore.type === 1) {
                  SourceUserResource.personalUpgradeCompany(this.dynamicValidateForm)
                    .then(response => {
                      this.successCallback(response)
                    })
                } else {
                  SourceUserResource.addCompanyCertification(this.dynamicValidateForm)
                    .then(response => {
                      this.successCallback(response)
                    })
                }
              }
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    getPicUrl(response, file, fileList) {
      if (response.code === 1) {
        this.dynamicValidateForm.company_yyzz_pic = response.data.real_url
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

.upload-box-company {
  width: 333px;
  margin-left: 129px;
  margin-bottom: 30px;
  display: inline-block;
}

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

.company-icon {
  width: 135px;
  height: 230px;
  background: url("../../../assets/images/business_license.png") center center
    no-repeat;
  top: -142px;
  left: 100%;
}
</style>
