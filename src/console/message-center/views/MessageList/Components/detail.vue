<template>
  <console-page-layout>
    <DmCard
      :loading="loading"
      :title="data.msg_title"
    >
      <template slot="action">
        <i
          title="站内消息通知"
          class="el-icon-message-solid iconfont-active color--primary"
        />
        <i
          :class="{ 'iconfont-active': data.switch_email === '1' }"
          title="邮件通知"
          class="el-icon-message margin-left color--primary"
          style="margin-left: 10px"
        />
        <i
          :class="{ 'iconfont-active': data.switch_sms === '1' }"
          title="短信通知"
          class="el-icon-s-comment margin-left color--primary"
          style="margin-left: 10px"
        />
      </template>
      <div id="content-div" style="padding-bottom: 16px" />
      <el-divider style="margin: 16px 0;" />
      <span>{{ data.notice_time }}</span>
    </DmCard>
  </console-page-layout>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      data: {}
    }
  },

  watch: {
    '$route'() {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      this.loading = true
      const message_id = this.$route.params.id

      const data = await this.Fetch.get('V4/messagecenter.getmessageinfo', { message_id })
      this.data = data

      const element = document.getElementById('content-div')
      element.innerHTML = data.msg_content
      this.loading = false
    },

    goBack() {
      this.$router.push({
        name: `message-center.router.MessageList`
      })
    }
  }
}
</script>
