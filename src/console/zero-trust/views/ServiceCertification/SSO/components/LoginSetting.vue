<template>
  <div>
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="统一登录入口"
    >
      <template slot="tips">
        <p>开通 Access 服务后系统会自动为您创建单点登录域名后缀，您需要添加自定义的域名前缀作为企业标识。</p>
      </template>
      <el-button
        slot="action"
        type="primary"
        @click="$refs.DialogRule.handleOpen(data)"
      >规则配置</el-button>
      <el-form>
        <el-form-item label="单点登录域名">
          <template v-if="data.domain_type === 0">
            <el-input
              v-model="data.prefix"
              readonly
              placeholder=""
              style="width: 280px; margin-right: 12px"
            >
              <template
                slot="append"
              >.{{ data.suffix }}</template>
            </el-input>
          </template>
          <template v-else>
            <el-input
              v-model="data.own_domain"
              readonly
              placeholder=""
              style="width: 280px; margin-right: 12px"
            />
          </template>
          <el-button @click="handleCopy(data.loginDomain)">复制</el-button>
          <el-button
            type="primary"
            @click="$refs.DialogCustomDomain.handleOpen(data)"
          >自定义</el-button>
          <el-button type="danger" plain @click="handleRevoke">撤销令牌</el-button>
        </el-form-item>
      </el-form>
    </CardItemForm>
    <DialogCustomDomain
      ref="DialogCustomDomain"
      @init="reload()"
    />
    <DialogRule ref="DialogRule" />
  </div>
</template>

<script>
import DialogCustomDomain from './DialogCustomDomain'
import DialogRule from './DialogRule'

export default {
  components: { DialogCustomDomain, DialogRule },

  props: {
    data: Object
  },

  methods: {
    reload() {
      window.location.reload()
    },

    handleCopy(text) {
      this.Help.copyText(text)
      this.$message.success('复制成功')
    },

    handleRevoke() {
      this.$confirm('本次操作将会结束所有用户的活动会话，是否确认该操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.loadingSubmit = true
        try {
          await this.Fetch.post('V4/zero.trust.remove.admin.token')
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
      })
    }
  }
}
</script>
