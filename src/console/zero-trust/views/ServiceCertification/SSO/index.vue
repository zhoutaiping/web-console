<template>
  <div>
    <template v-if="data.sso_id">
      <LoginSetting
        :data="data"
        @update="fetchData"
      />
      <LoginPageSetting
        :data="data"
        @update="fetchData"
      />
    </template>
    <template v-else>
      <CardItemForm />
      <CardItemForm />
    </template>
  </div>
</template>

<script>
import LoginSetting from './components/LoginSetting'
import LoginPageSetting from './components/LoginPageSetting'

export default {
  components: { LoginSetting, LoginPageSetting },

  data() {
    return {
      data: {}
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.loading = true
      let data
      try {
        data = await this.Fetch.get('V4/zero.trust.member.sso.info')
      } catch (e) {
        return
      } finally {
        this.loading = false
      }

      const loginDomain = data.domain_type === 0 ? `${data.prefix}.${data.suffix}` : data.own_domain

      this.data = {
        sso_id: data.member_id,
        loginDomain,
        ...data
      }
    }
  }
}
</script>
