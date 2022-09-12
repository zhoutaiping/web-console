<template>
  <console-page-layout :tabs="navShow">
    <template slot="tab-item">
      <NavbarPageItem
        v-if="link.CcDeduction && moduleSettings['cloud-wall'].ssa"
        @click="handleClick('cc')"
      >CC可视化推演</NavbarPageItem>
      <NavbarPageItem
        v-if="link.DdosDeduction && moduleSettings['cloud-wall'].ssa"
        @click="handleClick('ddos')"
      >DDOS可视化推演</NavbarPageItem>
    </template>
    <Toolbar
      v-show="toolbarVisible"
      :settings="toolbarSettings"
      @update="fetchSetting"
    />
    <router-view v-if="visibleChart" />
  </console-page-layout>
</template>

<script>
import NavbarPageItem from '@/components/Navbar/NavbarPageItem'
import Toolbar from './components/Toolbar'
import cwReport from '../../mixins/cwReport'

const NAV_MAP = {
  TcpFlow: 'tcpTraffic',
  WebCc: 'webCCAttack',
  TcpSessionTime: 'tcpSessionTime',
  TcpDistribution: 'tcpDistribution',
  TcpSession: 'tcpSession',
  TcpCcStati: 'tcpCCAttack',
  DDoStati: 'ddosAttack',
  FirewallReport: 'accurateAccessControl',
  TcpIPMonitor: 'nodemonitor'
}

export default {
  components: {
    NavbarPageItem, Toolbar
  },

  mixins: [cwReport],

  data() {
    return {
      link: {
        CcDeduction: false,
        DdosDeduction: false
      },
      visibleChart: false,
      navbar: [
        {
          title: 'Web CC攻击',
          name: `cloud-wall.router.dataReport__webCCAttack`,
          key: 'webCCAttack',
          toolbarVisible: true,
          toolbar: {
            auto: true
          },
          show: true
        },
        {
          title: 'DDoS攻击',
          name: `cloud-wall.router.dataReport__ddosAttack`,
          key: 'ddosAttack',
          toolbarVisible: true,
          show: true,
          toolbar: {
            date: true,
            auto: true
          }
        },
        {
          title: 'TCP CC攻击',
          name: `cloud-wall.router.dataReport__tcpCCAttack`,
          key: 'tcpCCAttack',
          toolbarVisible: true,
          show: true,
          toolbar: {
            auto: true
          }
        },
        {
          title: 'TCP流量',
          name: `cloud-wall.router.dataReport__tcpTraffic`,
          key: 'tcpTraffic',
          toolbarVisible: true,
          show: true,
          toolbar: {
            date: true,
            auto: true
          }
        },
        {
          title: 'TCP会话',
          name: `cloud-wall.router.dataReport__tcpSession`,
          key: 'tcpSession',
          toolbarVisible: true,
          show: true,
          toolbar: {
            date: true,
            auto: true
          }
        },
        {
          title: '节点监控',
          name: `cloud-wall.router.dataMeport__nodemonitor`,
          key: 'nodemonitor',
          toolbarVisible: true,
          show: true,
          toolbar: {
            date: true,
            auto: false
          }
        },
        {
          title: 'TCP会话时长',
          name: `cloud-wall.router.dataReport__tcpSessionTime`,
          key: 'tcpSessionTime',
          toolbarVisible: true,
          show: true,
          toolbar: {
            date: true,
            auto: true
          }
        },
        {
          title: 'TCP请求分布',
          name: `cloud-wall.router.dataReport__tcpDistribution`,
          key: 'tcpDistribution',
          toolbarVisible: true,
          show: true,
          toolbar: {
            auto: true
          }
        },
        {
          title: '精准访问控制',
          name: `cloud-wall.router.dataReport__accurateAccessControl`,
          key: 'accurateAccessControl',
          toolbarVisible: false,
          show: true
        }
      ]
    }
  },

  computed: {
    toolbarSettings() {
      const item = this.navbar.find(_ => _.name === this.$route.name)
      return item && item.toolbar
    },

    toolbarVisible() {
      const nameList = this.navbar.filter(_ => _.toolbarVisible).map(_ => _.name)
      return nameList.includes(this.$route.name)
    },

    navShow() {
      return this.navbar.filter(_ => _.show)
    }
  },

  watch: {
    'reportParams.package_id'(val) {
      if (val) {
        this.visibleChart = true
      }
    }
  },

  methods: {
    async fetchSetting(reportParams) {
      // if (!reportParams.package_id) return

      const params = {
        package_id: reportParams.package_id,
        type: 'PLUS'
      }
      const data = await this.Fetch.get('V4/tjkd.app.api.get.report.getSetting', params)
      const activeName = this.$route.path.split('/')[2]
      let hasJump = false

      Object.keys(data).forEach(key => {
        const visible = Boolean(data[key])
        const name = NAV_MAP[key]
        this.itemVisibleByName(name, visible)

        if (Object.keys(this.link).includes(key)) {
          this.link[key] = visible
        }
        // 当前页面不可见，需要跳转
        if (name === activeName && !visible) hasJump = true
      })

      if (hasJump) {
        this.$router.push({
          name: this.navShow[0].name
        })
      }
    },

    itemVisibleByName(name, visible) {
      const navbar = this.navbar
      const item = navbar.find(_ => _.key === name)
      if (item) item.show = visible
    },

    async handleClick(type) {
      const data = await this.Fetch.get('V4/member.whole.report.token', { type })
      const ssaUrl = this.moduleSettings['cloud-wall'].ssaUrl
      const url = `${ssaUrl}/${type}?id=${data.member_id}&token=${data.token}&meal_flag=taichi-plus`
      window.open(url)
    }
  }
}
</script>
