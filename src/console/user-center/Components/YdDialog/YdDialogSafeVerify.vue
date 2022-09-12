<style lang="scss" scoped>
.yd-dialog {
  .el-input {
    width: 250px;
  }
}
</style>

<template>
  <el-dialog :visible.sync="visible" title="关闭短信身份验证" @close="handleClose">
    <yd-alert>
      1. 为了您的账号安全，进行敏感操作前需先验证身份<br >
      2. 如果您不再使用此手机号，请<a @click="handleGotoInfo">更改手机号</a>
    </yd-alert>
    <el-form label-width="120px" style="max-width: 370px">
      <el-form-item label="绑定手机号">
        <el-input v-model="mobile" disabled/>
      </el-form-item>
      <yd-form-item-caption :cap="form.cap" type="getVerification" @change="updateCode"/>
      <el-form-item v-if="securityQs" label="问题一">
        <el-select v-model="form.qa" placeholder="请选择">
          <el-option v-for="(label, value) in qaList" :key="label" :label="label" :value="value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="securityQs">
        <el-input/>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 敏感操作身份验证弹框
const NAME = 'yd-dialog-safe-verify'

import SourceUserResource from '../../assets/js/resource/SourceUserResource'
import YdFormItemCaption from '../../Components/YdForm/YdFormItemCaption'

export default {
  name: NAME,

  components: {
    YdFormItemCaption
  },

  props: {
    mobile: [String, Number],
    securityQs: {
      type: Boolean,
      default: false
    },
    group: String
  },

  data() {
    return {
      qaList: [],
      visible: false,
      loading: false,
      form: {
        mobile: '',
        cap: '',
        qa: 'father_name',
        answer: ''
      }
    }
  },

  computed: {},

  // mounted: {},

  methods: {
    // 跳转
    handleGotoInfo() {
      this.visible = false
      window.location.href = '/console/user-center#/basicinfo'
    },
    handleClose() {
      this.visible = false
      this.$emit('close')
    },
    updateCode(val) {
      this.form.cap = val
    },

    open() {
      this.visible = true
      SourceUserResource.getSecurityQs().then(res => {
        const { data } = res
        this.qaList = data.data[0]
      })
    },
    handleSubmit() {
      const { group } = this
      this.loading = true
      const param = {
        group,
        status: 0,
        cap: this.form.cap
      }

      // if (this.securityQs) {
      //   param.
      // }

      SourceUserResource.changeConfig(param)
        .then(response => {
          const { code, message } = response.data.status
          if (code === 1) {
            this.$message.success('修改设置成功')
            this.loading = false
            this.visible = false
          } else {
            this.$message.warning(message)
            this.loading = false
          }
        })
        .catch(response => {
          this.loading = false
        })
    }
  }
}
</script>
