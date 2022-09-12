export default {
  id: 'security-operations',
  access: 'security-operations',
  name: 'security-operations.title',
  baseUrl: 'security-operations',
  hiddenMenus: true,
  menus: [
    {
      key: 'security-operations.router.dashboard',
      icon: 'ProjectTwoTone',
      to: '/yundun/security-operations/dashboard'
    },
    {
      key: 'security-operations.router.scan__propertys',
      icon: 'ProjectTwoTone',
      to: '/yundun/security-operations/propertys'
    },
    {
      key: 'security-operations.router.scan__activePrevention',
      icon: 'ProjectTwoTone',
      to: '/yundun/security-operations/activePrevention',
      children: [
        {
          key: 'security-operations.router.scan__scanWeb',
          to: '/yundun/security-operations/activePrevention/scan-web'
        }
      ]
    },
    {
      key: 'security-operations.router.scan__threatMonitoring',
      icon: 'ProjectTwoTone',
      to: '/yundun/security-operations/threatMonitoring',
      children: [
        {
          key: 'security-operations.router.scan__contentSafe',
          to: '/yundun/security-operations/threatMonitoring/content-safe'
        },
        {
          key: 'security-operations.router.scan__usabilityMonitor',
          to: '/yundun/security-operations/threatMonitoring/usability-monitor'
        }
      ]
    },
    {
      key: 'security-operations.router.scan__securityManagement',
      icon: 'ProjectTwoTone',
      to: '/yundun/security-operations/securityManagement',
      children: [
        {
          key: 'security-operations.router.serviceReport',
          to: '/yundun/security-operations/securityManagement/service-report'
        },
        {
          key: 'security-operations.router.logs',
          to: '/yundun/security-operations/securityManagement/logs'
        }
      ]
    },
    {
      key: 'security-operations.router.scan__productSettings',
      icon: 'ProjectTwoTone',
      to: '/yundun/security-operations/settings',
      children: [
        {
          key: 'security-operations.router.scan__productSettings__Notice',
          to: '/yundun/security-operations/settings/notice'
        },
        {
          key: 'security-operations.router.scan__productSettings__Packages',
          to: '/yundun/security-operations/settings/packages'
        },
        {
          key: 'security-operations.router.ipList',
          to: '/yundun/security-operations/settings/ip-list'
        }
      ]
    }
  ]
}

