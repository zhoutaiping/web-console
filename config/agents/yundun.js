module.exports = {
  assets: {
    titleSuffix: '上海云盾（YUNDUN）',
    productNav: true
  },
  layout: 'firebase',
  sidebarGroups: [
    {
      title: '互联网业务安全访问',
      icon: 'ya-jiasu',
      id: 'cloud'
    },
    {
      title: '安全运营中心',
      icon: 'ya-dun',
      id: 'snoc'
    },
    {
      title: '用户中心',
      icon: 'ya-yonghuzhongxin',
      id: 'user'
    }
  ],
  sidebar: [
    {
      // title: 'DNS安全加速',
      name: 'cloud-resolving',
      icon: 'ya-yunjiexi',
      groupId: 'cloud',
      children: [
        'cloud-resolving.router.domainList',
        'cloud-resolving.router.mealList',
        'cloud-resolving.router.domainGroup',
        'cloud-resolving.router.jobList',
        'cloud-resolving.router.operateLog'
      ],
    },
    {
      // title: 'WEB安全加速',
      name: 'cloud-speed',
      icon: 'ya-yun-yyj',
      groupId: 'cloud',
      children: [
        'cloud-speed.router.businessList',
        'cloud-speed.router.preUpdate',
        'cloud-speed.router.configTemplates',
        'cloud-speed.router.certificateList',
        'cloud-speed.router.taskList',
        'cloud-speed.router.statisticsReport',
        'cloud-speed.router.operateLog',
      ]
    },
    {
      // title: 'DDoS原生清洗',
      name: 'anti-ddos',
      access: 'anti-ddos',
      icon: 'ya-ddosDDoSfanghu',
      groupId: 'cloud',
      children: [
        'anti-ddos.router.defense',
        'anti-ddos.router.policyTemplate',
        'anti-ddos.router.bwlist',
        'anti-ddos.router.statistics',
        'anti-ddos.router.monitor',
        'anti-ddos.router.cluster',
        'anti-ddos.router.pcap',
        'anti-ddos.router.operateLog',
      ]
    },
    {
      // title: 'TCP安全加速',
      name: 'cloud-wall',
      icon: 'ya-cloud-wall',
      groupId: 'cloud',
      children: [
        'cloud-wall.router.protectionRules',
        'cloud-wall.router.packages',
        'cloud-wall.router.dataReport',
        'cloud-wall.router.logs'
      ]
    },
    {
      // title: '安全加速SDK',
      name: 'taichi-app',
      icon: 'ya-taichi-app',
      groupId: 'cloud',
      children: [
        'taichi-app.router.meal',
        'taichi-app.router.report',
        'taichi-app.router.logs'
      ]
    },
    // {
    //   groupId: 'snoc',
    //   name: 'security-operations.router.dashboard',
    // },
    {
      groupId: 'snoc',
      name: 'security-operations.router.scan__propertys',
    },
    {
      name: 'activePrevention',
      groupId: 'snoc',
      children: [
        'security-operations.router.scan__scanWeb'
      ]
    },
    {
      name: 'threatMonitoring',
      groupId: 'snoc',
      children: [
        'security-operations.router.scan__contentSafe',
        'security-operations.router.scan__usabilityMonitor',
      ]
    },
    {
      name: 'securityManagement',
      groupId: 'snoc',
      children: [
        'security-operations.router.serviceReport',
        'security-operations.router.logs',
        // 'security-operations.router.ipList',
      ]
    },
    {
      name: 'productSettings',
      groupId: 'snoc',
      children: [
        'security-operations.router.scan__productSettings__Notice',
        'security-operations.router.scan__productSettings__Packages',
      ]
    },
    {
      // title: '应用可信访问',
      name: 'zero-trust',
      icon: 'ya-dun',
      access: 'zero-trust',
      groupId: 'cloud',
      children: [
        'zero-trust.router.dashboard',
        'zero-trust.router.applications',
        'zero-trust.router.identityAuth',
        'zero-trust.router.menus',
        'zero-trust.router.connector',
        'zero-trust.router.serviceCertification',
        'zero-trust.router.logs',
      ]
    },
    {
      // title: '用户中心',
      name: 'user-center',
      icon: 'ya-yonghuzhongxin',
      groupId: 'user',
      children: [
        'user-center.router.basicinfo',
        'user-center.router.authentication',
        'user-center.router.modify',
        'user-center.router.safeConfig',
        'user-center.router.ipList',
        'user-center.router.logs'
      ],
    },
    {
      // title: '消息中心',
      name: 'message-center',
      icon: 'ya-xiaoxi',
      groupId: 'user',
      children: [
        'message-center.router.MessageList',
        'message-center.router.NoticeConfig',
        'message-center.router.PersonManage'
      ]
    },
    {
      // title: '账务中心',
      name: 'finance-center',
      icon: 'ya-caiwu1',
      groupId: 'user',
      children: [
        'finance-center.router.rechargeList',
        'finance-center.router.invoiceOrder',
        'finance-center.router.invoiceList',
        'finance-center.router.couponList'
      ]
    },
    {
      name: 'access-management',
      access: 'access-management',
      groupId: 'user',
      children: [
        'access-management.router.overview',
        'access-management.router.accounts',
        'access-management.router.groups',
        // 'access-management.router.privileges'
      ]
    }
  ],
  modulesSettings: {
    'taichi-app': {
      locale: {
        zh: {
          // title: 'SDK'
        }
      }
    },
    'red-guard': {
      ssa: true,
      ssaUrl: 'http://ssa.yundun.com'
    },
    'cloud-wall': {
      ssa: true,
      ssaUrl: 'http://ssa.yundun.com'
    },
    home: {
      wxPopover: [
        {
          title: '微信订阅号',
          src: 'https://yundun-statics.yundun.com/FpFEy0vtp9ykfw4ATu8Gml7gWFLn'
        },
        {
          title: '微信服务号',
          src: 'https://yundun-statics.yundun.com/Fj805u5DvLtiXyuQnH2meoI5r-hw'
        }
      ]
    }
  }
}
