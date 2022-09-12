<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    width="600px"
    title="接入帮助"
    @submit="handleSubmit"
  >
    <yd-alert>
      <p>1. 客户端请求的时候带上特定的头部 X-YD-Req-Token, 值为加密后的结果</p>
      <p>2. 节点在收到请求时对 X-YD-Req-Token 进行校验，校验成功则通过，正常响应，校验失败则拒绝，响应 <strong>464</strong></p>
      <strong>加密方式</strong>
      <p>MD5= md5（Timestamp+NONCE+AUTH_TOKEN+URL）<br>
        示例：MD5=md5(1581577282Zod2Lhy2nLj81964c708b9f1231c96b3aa0db0d6772ehttp://www.yundun.com/token?auth=1) 最终生成MD5为：fc7f02dc369206905f9a41a12297a783 </p>
      <strong>发起请求</strong>
      <p>Timestamp, NONCE, MD5, 用“|”拼接并赋值给 X-YD-Req-Token: Timestamp|NONCE|MD5 最终生成的 X-YD-Req-Token 如下：<br>
        X-YD-Req-Token: 1581577282|Zod2Lhy2nLj8|fc7f02dc369206905f9a41a12297a783<br>
        客户端再发起请求的时候，增加请求头 X-YD-Req-Token 即可
      </p>
    </yd-alert>
    <p>对接调试，若程序生成与此相同，则对接正确，否则请仔细阅读 <a href="https://yundun-statics.yundun.com/Fnhe8AquxPvtfSpVjS2zRYVqcYHy" target="_blank">接入文档</a> 进行调试</p>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      style="margin-top: 16px"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        label="Timestamp"
        prop="timestamp"
      >
        <el-input
          v-model="form.timestamp"
          style="width: 250px"
          placeholder="过期时间：UNIX 时间戳"
        />
        <TipsTooltip title="鉴权过期时间，unix 十进制，偏差1 小时内，示例：1581577282"/>
      </el-form-item>
      <el-form-item
        label="AUTH_TOKEN"
        prop="auth_token"
      >
        <el-input
          v-model="form.auth_token"
          style="width: 250px"
          placeholder="AUTH_TOKEN"
        />
        <TipsTooltip title="鉴权密钥，配置开启后随机生成，示例：1964c708b9f1231c96b3aa0db0d6772e"/>
      </el-form-item>
      <el-form-item
        label="NONCE"
        prop="nonce"
      >
        <el-input
          v-model="form.nonce"
          style="width: 250px"
          placeholder="随机字符串"
        />
        <TipsTooltip title="随机字符串，建议每次都用不同的 ，示例：Zod2Lhy2nLj8"/>
      </el-form-item>
      <el-form-item
        label="URL"
        prop="url"
      >
        <el-input
          v-model="form.url"
          style="width: 250px"
          placeholder="请求 URL"
        />
        <TipsTooltip title="请求 URL，包括参数，示例：http://www.yundun.com/token?auth=1"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleCreate"
        >生成</el-button>
      </el-form-item>
    </el-form>
    <el-input
      v-if="md5"
      v-model="md5"
      style="width: 450px"
    >
      <template slot="prepend">MD5</template>
    </el-input>
    <el-input
      v-if="token"
      v-model="token"
      style="width: 450px; margin-top: 10px"
    >
      <template slot="prepend">X-YD-Req-Token</template>
    </el-input>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import MD5 from 'js-md5'
import RULE from '@/utils/verify'

export default createDialog({
  components: { TipsTooltip },

  data() {
    return {
      md5: '',
      token: '',
      rules: {
        auth_token: {
          required: true, message: '请填写'
        },
        nonce: {
          required: true, message: '请填写'
        },
        url: {
          required: true, message: '格式有误', pattern: RULE.defaultUrl
        },
        timestamp: {
          required: true,
          validator: function validateRegion(rule, value, callback) {
            if (Math.abs(value - parseInt(Date.now() / 1000)) > 3600) {
              callback(new Error('时间戳不合法：与当前时间戳差的绝对值大于一小时'))
            } else {
              callback()
            }
          }
        }
      },
      formDefault: {
        timestamp: parseInt(Date.now() / 1000),
        auth_token: '',
        nonce: '',
        url: ''
      }
    }
  },

  methods: {
    initOptions(form) {
      this.mode = form.id ? 'Edit' : 'Create'
    },

    handleCreate() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          const { timestamp, auth_token, nonce, url } = this.form
          const md5 = MD5(`${timestamp}${nonce}${auth_token}${url}`)
          this.md5 = md5
          this.token = `${timestamp}|${nonce}|${md5}`
        }
      })
    },

    async handleSubmit(form) {
      this.handleClose()
    }
  }
})
</script>
