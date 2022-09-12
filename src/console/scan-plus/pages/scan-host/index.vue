<template>
  <console-page-layout :class="b()">
    <template v-if="$route.path==='/scan-host/setting' || $route.path === '/scan-host/list'">
      <yd-alert class="margin-top">
        <p>剩余扫描次数：<strong>{{ quota || 0 }}</strong> 次，<el-button
          type="text"
          @click="Help.openServicePanel(appAssets.afterKF)"
        >购买更多扫描</el-button>
        </p>
        1. 添加漏扫任务代表用户默认同意 <a
          target="_blank"
          class="text--underline "
          href="/static/pdf/scan_agreement.pdf"
        >
          网站漏扫授权书
        </a> ， 用户需下载此授权书并签字（盖章）回传到上海云盾。<br>
        2. 用户需对所添加的网站拥有官方授予的操作权，任何信息伪造、欺骗行为，将由用户负全部法律责任。<br>
        3. 用户需知悉，漏扫会对网站造成一定影响。<br>
      </yd-alert>
      <NavbarPage
        slot="header"
        :data="navbar"
      />
    </template>
    <router-view @initQuota="initQuota" />
  </console-page-layout>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'page',

  data() {
    return {
      quota: '',
      // TODO
      navbar: [
        {
          label: '扫描列表',
          to: 'list'
        },
        {
          label: '配置列表',
          to: 'setting'
        }
      ]
    }
  },

  computed: {
    title() {
      const { path } = this.$route
      if (path === '/scan-host/setting' || path === '/scan-host/list') {
        return '系统漏洞扫描'
      } else {
        return '扫描详情'
      }
    }
  },

  methods: {
    async initQuota() {
      const data = await this.Fetch.post('/V4/host.scan.getHostScanNumber')
      this.quota = Number(data)
    }
  },

  created() {
    this.initQuota()
  }
})
</script>
