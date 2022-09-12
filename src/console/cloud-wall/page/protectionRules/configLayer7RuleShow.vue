<template>
  <div>
    <yd-card-list>
      <CardItemForm
        :loading="!pageData.domain"
        :is-init="!!pageData.domain"
        :is-support="true"
        title="性能优化"
      >
        <template slot="tips">
          <p>您已启用 <router-link :to="{name: 'cloud-speed.router.businessList'}">{{ $t('cloud-speed.title') }}服务</router-link>，如需配置高级缓存、页面压缩、页面优化等功能，请至 <router-link :to="cdnUrl">{{ $t('cloud-speed.title') }}控制台</router-link> 配置。
          </p>
        </template>
      </CardItemForm>
      <CardItemForm
        :loading="!pageData.domain"
        :is-init="!!pageData.domain"
        :is-support="support"
        title="精准访问控制"
      >
        <template slot="tips">
          <p>如需定制防护配置策略，请至 <router-link :to="wallUrl">{{ $t('cloud-speed.title') }}-控制台-精准访问控制</router-link> 进行配置</p>
        </template>
      </CardItemForm>
    </yd-card-list>
  </div>
</template>

<script>
import { PACKAGE_LEVEL_MAP } from '@/constants/package'

export default {
  data() {
    return {
      id: this.$route.params.id,
      support: false
    }
  },

  computed: {
    cdnUrl() {
      return `/console/cloud-speed/websiteList/console/${this.id}/backsource`
    },
    wallUrl() {
      return `/console/cloud-speed/websiteList/console/${this.id}/waf`
    },
    weblUrl() {
      return `/console/cloud-speed/websiteList/console/${this.id}/businessSecurity`
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      this.SET_PAGE_DATA({})
      const params = {
        domain: this.$route.params.id
      }
      const data = await this.Fetch.get('V4/Web.Domain.Info', params)
      data.packageLevel = PACKAGE_LEVEL_MAP[data.meal_flag] || 0
      this.support = true
      this.SET_PAGE_DATA(data)
    }
  }
}
</script>
