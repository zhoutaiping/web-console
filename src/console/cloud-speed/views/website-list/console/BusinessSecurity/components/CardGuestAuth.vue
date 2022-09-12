<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="false"
    title="访客鉴权"
  >
    <template slot="tips">
      <p>通过算法签名对请求进行校验，可100%识别针对应用的各种CC攻击，无漏报误报，适用于APP和API场景</p>
    </template>
    <SelectSwitch
      slot="action"
      :value="status"
      off-value="off"
      on-value="on"
      @change="handleUpdateStatus"
    />
    <DmAlert>
      <p>开启访问鉴权功能前，请将生成的密钥部署到请求中，并按接入文档步骤完成请求签名。</p>
      <p>开启此功能后，安全节点将开启访问校验，校验通过的予以放行，未通过校验的请求将被拦截。<a
        @click="handleOpenHelp"
      >接入帮助</a></p>
      <p class="color--warning">注意：本功能不适合浏览器访问场景，浏览器场景请勿开启此开关。开启前需正确对接并保证测试通过。</p>
    </DmAlert>
    <el-form
      v-if="form.auth_token"
      label-position="left"
      label-width="150px"
    >
      <el-form-item label="密钥（AUTH_TOKEN）">
        <el-input
          v-model="form.auth_token"
          disabled
          style="width: 350px; margin-right: 12px"
        >
          <el-button
            v-if="form.auth_token"
            slot="append"
            type="default"
            @click="handleCopy(form.auth_token)"
          >复制</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <DialogGuestAuthHelper ref="DialogGuestAuthHelper"/>
  </CardItemForm>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import DialogGuestAuthHelper from './DialogGuestAuthHelper'
import consoleItem from '../../../../../mixins/consoleItem'

export default {
  name: 'DefenseDdos',

  components: {
    SelectSwitch,
    DialogGuestAuthHelper
  },

  mixins: [consoleItem],

  data() {
    return {
      token: '',
      SETTING_ID: 'guest_auth',
      formDefault: {
        auth_token: '',
        status: 'off'
      }
    }
  },

  computed: {
    status() {
      const { status } = this.form
      return status
    }
  },

  methods: {
    handleOpenHelp() {
      this.$refs.DialogGuestAuthHelper.handleOpen({ auth_token: this.form.auth_token })
    },

    handleUpdateStatus(val) {
      const form = this.form
      form.status = val
      this.handleUpdate()
    },

    async handleUpdate() {
      await this.confirmAction()
      this.fetchUpdate()
    },

    handleCopy(text) {
      this.Help.copyText(text)
      this.$message.success('复制成功')
    }
  }
}
</script>
