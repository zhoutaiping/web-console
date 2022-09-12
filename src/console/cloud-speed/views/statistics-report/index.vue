<template>
  <ConsolePageLayout>
    <div slot="header">
      <navbar-page
        v-if="!isDetail"
        v-model="active"
        :data="navbar"
      >
        <NavbarPageItem
          v-if="moduleSettings['cloud-speed'].ssa"
          @click="handleClickSSA"
        >实时态势</NavbarPageItem>
        <NavbarPageItem
          v-if="moduleSettings['red-guard'].ssa"
          @click="handleClickWAF"
        >{{ $t('button.dataScreen') }}</NavbarPageItem>
      </navbar-page>
    </div>

    <template v-if="!isDetail">
      <ToolbarCdn
        v-if="navbar.filter(_ => _.type==='speed').map(_ => _.name).includes($route.name)"
        ref="ToolbarCdn"
        :show3h="$route.name === 'cloud-speed.router.statisticsReport__wideFlowRange'"
        @init="init"
      />
    </template>
    <router-view />
  </ConsolePageLayout>
</template>

<script>
import NavbarPageItem from '@/components/Navbar/NavbarPageItem'
import report from '../../mixins/report'
import ToolbarCdn from '../../components/Toolbar/ToolbarCdn'

export default {
  components: { NavbarPageItem, ToolbarCdn },

  mixins: [report],

  data() {
    return {
      active: '',
      interval: 60,
      intervalFn: null,
      navbar: [
        {
          name: 'cloud-speed.router.statisticsReport__wideFlowRange',
          type: 'speed'
        },
        {
          name: 'cloud-speed.router.statisticsReport__accessAnalysis',
          type: 'speed'
        },
        {
          name: 'cloud-speed.router.statisticsReport__distributionRequest',
          type: 'speed'
        },
        {
          name: 'cloud-speed.router.statisticsReport__statusCodeAnalysis',
          type: 'speed'
        },
        {
          name: 'cloud-speed.router.statisticsReport__hotspotAnalysis',
          type: 'speed'
        },
        {
          name: 'cloud-speed.router.menaceAnalyze__WAFAttack'
        },
        {
          name: 'cloud-speed.router.menaceAnalyze__CCAttack'
        },
        {
          name: 'cloud-speed.router.menaceAnalyze__AccurateAccessControl'
        },
        {
          name: 'cloud-speed.router.menaceAnalyze__Bot'
        }
      ]
    }
  },
  computed: {
    isDetail() {
      return [
        'cloud-speed.router.menaceAnalyze__WAFAttack_ScanDetail',
        'cloud-speed.router.menaceAnalyze__WAFAttack_WAFAttackDetail',
        'cloud-speed.router.menaceAnalyze__WAFAttack_WebShellDetail',
      ].includes(this.$route.name)
    }
  },
  methods: {
    init(params) {
      this.SET_PARAMS(params)
      this.SET_UTIME(Date.now())
    },

    async handleClickSSA() {
      const data = await this.Fetch.get('V4/member.whole.report.token', { report_type: 'waf' })
      // const ssaUrl = this.moduleSettings['cloud-speed'].ssaUrlv2
      window.open(`/ssa#/scdn?id=${data.member_id}&token=${data.token}`)
    },

    async handleClickWAF() {
      const data = await this.Fetch.get('V4/member.whole.report.token', { report_type: 'waf' })
      const ssaUrl = this.moduleSettings['red-guard'].ssaUrl
      window.open(`${ssaUrl}/waf?id=${data.member_id}&token=${data.token}`)
    }
  }
}
</script>
