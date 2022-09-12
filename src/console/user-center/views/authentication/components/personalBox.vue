<template>
  <div class="box-container">
    <yd-panel title="认证地区">
      <el-form>
        <el-form-item label="地区选择">
          <yd-form-radio-button
            :radios="AREA_TYPE"
            v-model="activeName"
            @change="handleClick"
          />
        </el-form-item>
      </el-form>
    </yd-panel>

    <yd-panel title="个人信息">
      <el-form
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="max-width:500px"
      >
        <el-form-item
          label="姓名"
          prop="personal_name"
        >
          <el-input v-model="dynamicValidateForm.personal_name" />
        </el-form-item>
        <el-form-item
          :label="activeType"
          :prop="validateType"
        >
          <el-input v-model="dynamicValidateForm[validateType]" />
        </el-form-item>

        <el-form-item :label="`${activeType}正反面`">
          <el-upload
            :action="uploadAdd"
            :before-upload="limit"
            :file-list="fileList"
            :data="typeData"
            :name="areaTypePic"
            :on-success="getPicUrl"
            :multiple="false"
            :on-remove="handleRemove"
            class="upload-box"
            drag
            list-type="picture"
          >
            <div class="tip-box">
              <i class="ya-iconfont ya-yun-upload user-icon" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-upload
            :action="uploadAdd"
            :before-upload="limit"
            :file-list="fileListAnother"
            :name="areaTypePicReverse"
            :on-success="getAnotherPicUrl"
            :multiple="false"
            :on-remove="handleRemoveAnother"
            :data="typeDataReverse"
            class="upload-box"
            drag
            list-type="picture"
          >
            <div class="tip-box">
              <i class="ya-iconfont ya-yun-upload user-icon" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
            <div slot="tip">只能上传jpg/png文件，且不超过2M<br>
              <el-popover trigger="hover">
                <img
                  src="../../../assets/images/IDcard_example.png"
                  alt="demo"
                >
                <img
                  src="../../../assets/images/IDcard_example2.png"
                  alt="demo"
                >
                <a slot="reference">手持身份证示例</a>
              </el-popover>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </yd-panel>

    <yd-panel title="联系信息">
      <el-form
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        :rules="rules"
        label-width="114px"
        class="box"
        label-position="right"
      >
        <el-form-item
          label="手机号码"
          prop="personal_mobile"
        >
          <el-input v-model="dynamicValidateForm.personal_mobile" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('dynamicValidateForm')"
          >{{ typeTip }}</el-button>
        </el-form-item>
      </el-form>
    </yd-panel>
  </div>
</template>

<script>
import YdPanel from '../../../Components/YdPanel/YdPanel'
import {
  BASE_URL
} from '@/config/interceptor'
import {
  judgeEmpty
} from '../../../assets/js/normal'
import SourceUserResource from '../../../assets/js/resource/SourceUserResource'
import {
  validate
} from '@/assets/js/normal'

export default {
  components: { YdPanel },
  data() {
    const a = this
    function validateName(rule, value, callback) {
      callback()
    }

    function validateIDnumber(rule, value, callback) {
      if (value) {
        if (validate.IDnumber.test(value) === false) {
          callback(new Error('请输入正确的身份证号'))
        }
      }
      callback()
    }

    function validateMobile(rule, value, callback) {
      if (value && a.activeName === 'first') {
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

    function validateHome(rule, value, callback) {
      if (value) {
        if (validate.homeVisitingNumber.test(value) === false) {
          callback(new Error('请输入正确的回乡证号'))
        }
      }
      callback()
    }

    function validateMtp(rule, value, callback) {
      if (value) {
        if (validate.mtpNumber.test(value) === false) {
          callback(new Error('请输入正确的台胞证号'))
        }
      }
      callback()
    }

    return {
      activeName: 'first',
      activeType: '身份证',
      validateType: 'personal_id_card',
      AREA_TYPE: [
        {
          label: '大陆地区',
          value: 'first'
        },
        {
          label: '港澳地区',
          value: 'second'
        },
        {
          label: '台湾地区',
          value: 'third'
        },
        {
          label: '海外地区',
          value: 'forth'
        }
      ],
      area: {
        first: {
          name: '身份证',
          param: 'personal_id_card'
        },
        second: {
          name: '回乡证',
          param: 'home_visiting_certificate'
        },
        third: {
          name: '台胞证',
          param: 'mtp'
        },
        forth: {
          name: '护照',
          param: 'passport'
        }
      },
      transferData: {},
      fileList: [],
      fileListAnother: [],
      dialogImageUrl: '',
      dialogVisible: false,
      typeTip: '提交',
      uploadAdd: BASE_URL + '/sso/V4/upload/uploadPic',
      dynamicValidateForm: {
        personal_name: '',
        personal_id_card: '',
        personal_mobile: '',
        personal_id_card_pic: '',
        personal_id_card_pic_negative: '',
        home_visiting_certificate: '',
        mtp: '',
        passport: '',
        area: 1
      },
      info: {
        personal_name: '姓名',
        personal_id_card: '身份证号码',
        personal_mobile: '手机号码',
        home_visiting_certificate: '回乡证',
        mtp: '台胞证',
        passport: '护照',
        personal_id_card_pic: '身份证正面',
        personal_id_card_pic_negative: '身份证反面',
        home_visiting_certificate_pic: '回乡证正面',
        home_visiting_certificate_pic_negative: '回乡证反面',
        mtp_pic: '台胞证正面',
        mtp_pic_negative: '台胞证反面',
        passport_pic: '护照正面',
        passport_pic_negative: '护照反面'
      },
      rules: {
        personal_name: [{
          min: 2,
          max: 32,
          message: '长度在 2 到 32 个字符',
          trigger: 'blur'
        }, {
          validator: validateName,
          trigger: 'blur'
        }],
        personal_id_card: [{
          validator: validateIDnumber,
          trigger: 'blur'
        }],
        personal_mobile: [{
          validator: validateMobile,
          trigger: 'blur'
        }],
        home_visiting_certificate: [{
          min: 9,
          max: 9,
          message: '长度为9位',
          trigger: 'blur'
        }, {
          validator: validateHome,
          trigger: 'blur'
        }],
        mtp: [{
          validator: validateMtp,
          trigger: 'blur'
        }],
        passport: [{
          min: 1,
          max: 32,
          message: '长度不超过32位',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    areaTypePic() {
      return this.validateType + '_pic'
    },
    areaTypePicReverse() {
      return this.validateType + '_pic_negative'
    },
    typeData() {
      return {
        fileKey: this.validateType + '_pic'
      }
    },
    typeDataReverse() {
      return {
        fileKey: this.validateType + '_pic_negative'
      }
    }
  },
  watch: {
    activeName(newValue) {
      if (newValue) { this.$refs.dynamicValidateForm.resetFields() }
      this.handleRemove()
      this.handleRemoveAnother()
      switch (newValue) {
        case 'first':
          this.dynamicValidateForm.area = 1
          break
        case 'second':
          this.dynamicValidateForm.area = 2
          break
        case 'third':
          this.dynamicValidateForm.area = 3
          break
        case 'forth':
          this.dynamicValidateForm.area = 4
          break
        default:
      }
    }
  },
  mounted() {
    if (this.$store.state.authentiStore.status === 3) {
      this.typeTip = '重新提交'
      // for (const item in this.dynamicValidateForm)
      //   this.dynamicValidateForm[item] = this.$store.state.authentiStore.info.personal[item]
    }
  },
  methods: {
    // 数据筛出，将未选中的类型数据和图片过滤
    dataFilter(obj, targetObj) {
      let type
      for (const i in this.area) {
        type = this.area[i].param
        delete obj[type]
        delete obj[type + '_pic']
        delete obj[type + '_pic_negative']
      }
      obj[this.validateType] = targetObj[this.validateType]
      obj[this.validateType + '_pic'] = targetObj[this.validateType + '_pic']
      obj[this.validateType + '_pic_negative'] = targetObj[this.validateType + '_pic_negative']
      return obj
    },
    handleClick(tab) {
      this.activeName = tab
      const type = this.activeName
      this.activeType = this.area[type].name
      this.validateType = this.area[type].param
    },
    handleRemove(file) {
      const type = this.area[this.activeName].param + '_pic'
      this.dynamicValidateForm[type] = ''
      this.fileList = []
      // this.fileList.forEach((item, i) => {
      //   if (item.name === file.name)
      //     this.fileList.splice(i, 1)
      //   if (file.url === this.dynamicValidateForm.personal_id_card_pic)
      //     this.dynamicValidateForm.personal_id_card_pic = ''
      // })
    },
    handleRemoveAnother(file) {
      const type = this.area[this.activeName].param + '_pic_negative'
      this.dynamicValidateForm[type] = ''
      this.fileListAnother = []
      // this.fileListAnother.forEach((item, i) => {
      //   if (item.name === file.name)
      //     this.fileListAnother.splice(i, 1)
      //   if (file.url === this.dynamicValidateForm.personal_id_card_pic_negative)
      //     this.dynamicValidateForm.personal_id_card_pic_negative = ''
      // })
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs.dynamicValidateForm.validate(valid => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.dynamicValidateForm))
          const filterData = this.dataFilter(data, this.dynamicValidateForm)
          const { mtp, home_visiting_certificate } = filterData
          if (mtp) {
            if (validate.mtpNumber.test(mtp) === false) {
              this.$message.error('台胞证格式错误')
              return
            }
          }
          if (home_visiting_certificate) {
            if (validate.homeVisitingNumber.test(home_visiting_certificate) === false) {
              this.$message.error('回乡证格式错误')
              return
            }
          }

          if (judgeEmpty(filterData, this.info) === true) {
            if (this.$store.state.authentiStore.status === 0) {
              SourceUserResource.addPersonalCertification(filterData)
                .then(response => {
                  this.successCallback(response)
                })
            } else {
              SourceUserResource.updatePersonalCertification(filterData)
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getPicUrl(response, file, fileList) {
      if (response.code === 1) {
        const type = this.area[this.activeName].param + '_pic'
        this.dynamicValidateForm[type] = response.data.real_url
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
    getAnotherPicUrl(response, file, fileList) {
      if (response.code === 1) {
        const type = this.area[this.activeName].param + '_pic_negative'
        this.dynamicValidateForm[type] = response.data.real_url
        this.fileListAnother.push({
          name: response.data.key,
          url: response.data.real_url
        })
        if (this.fileListAnother.length !== 1) {
          this.fileListAnother.forEach((item, i) => {
            if (item.name !== file.name) { this.fileListAnother.splice(i, 1) }
          })
        }
      } else {
        this.fileListAnother = []
        this.$message.error(response.status.message)
      }
    }
  }
}
</script>
