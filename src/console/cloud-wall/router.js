import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  name: `${id}.title`,
  component: () => import('./app'),
  children: [
    // 防护规则
    {
      path: 'protectionRules',
      name: `${id}.router.protectionRules`,
      component: () => import('./page/protectionRules/index'),
      redirect: {
        name: `${id}.router.protectionRules__configLayer7Rule`
      },
      children: [
        {
          path: 'configLayer7Rule',
          name: `${id}.router.protectionRules__configLayer7Rule`,
          component: () => import('./page/protectionRules/configLayer7Rule'),
          meta: { title: '防护规则', rememberPage: true }
        },
        {
          path: 'configLayer7Rule/:id',
          name: `${id}.router.protectionRules__configLayer7Rule__id`,
          component: () =>
          import('./page/protectionRules/configLayer7RuleShow'),
          meta: { title: '控制台', back: `${id}.router.protectionRules__configLayer7Rule` }
        },
        {
          path: 'configLayer4Rule',
          name: `${id}.router.protectionRules__configLayer4Rule`,
          component: () => import('./page/protectionRules/configLayer4Rule'),
          meta: { title: '防护规则', rememberPage: true }
        },
        {
          path: 'configLayer4Rule/:id',
          name: `${id}.router.protectionRules__configLayer4Rule__id`,
          component: () =>
            import('./page/protectionRules/configLayer4RuleShow'),
          meta: { title: '控制台', back: `${id}.router.protectionRules__configLayer4Rule` }
        }
      ]
    },
    // 套餐列表
    {
      path: 'packages',
      name: `${id}.router.packages`,
      component: () => import('./page/packages/index')
    },
    // 统计报表
    {
      path: 'dataReport',
      name: `${id}.router.dataReport`,
      component: () => import('./page/dataTable/index'),
      redirect: {
        name: `${id}.router.dataReport__webCCAttack`
      },
      children: [
        {
          path: 'webCCAttack',
          name: `${id}.router.dataReport__webCCAttack`,
          component: () => import('./page/dataTable/pages/webCCAttack')
        },
        {
          path: 'ddosAttack',
          name: `${id}.router.dataReport__ddosAttack`,
          component: () => import('./page/dataTable/pages/ddosAttack')
        },
        {
          path: 'ddosAttack/detail',
          name: `${id}.router.dataReport__ddosAttack__detail`,
          component: () => import('./page/dataTable/pages/ddosAttack/detail')
        },
        {
          path: 'tcpCCAttack',
          name: `${id}.router.dataReport__tcpCCAttack`,
          component: () => import('./page/dataTable/pages/tcpCCAttack')
        },
        {
          path: 'tcpTraffic',
          name: `${id}.router.dataReport__tcpTraffic`,
          component: () => import('./page/dataTable/pages/tcpTraffic')
        },
        {
          path: 'tcpSession',
          name: `${id}.router.dataReport__tcpSession`,
          component: () => import('./page/dataTable/pages/tcpSession')
        },
        {
          path: 'tcpSessionTime',
          name: `${id}.router.dataReport__tcpSessionTime`,
          component: () => import('./page/dataTable/pages/tcpSessionTime')
        },
        {
          path: 'tcpDistribution',
          name: `${id}.router.dataReport__tcpDistribution`,
          component: () => import('./page/dataTable/pages/tcpDistribution')
        },
        {
          path: 'nodeMonitor',
          name: `${id}.router.dataMeport__nodemonitor`,
          component: () => import('./page/dataTable/pages/nodeMonitor')
        },
        {
          path: 'accurateAccessControl',
          name: `${id}.router.dataReport__accurateAccessControl`,
          component: () => import('./page/dataTable/pages/accurateAccessControl')
        },
        {
          path: 'accurateAccessControl/:id',
          name: `${id}.router.dataReport__accurateAccessControl__id`,
          component: () => import('./page/dataTable/pages/accurateAccessControl/detail')
        }
      ]
    },
    // 操作记录
    {
      path: 'logs',
      name: `${id}.router.logs`,
      component: () => import('./page/logs/index'),
      redirect: {
        name: `${id}.router.logs__ddos`
      },
      children: [
        {
          path: 'ddos',
          name: `${id}.router.logs__ddos`,
          component: () => import('./page/logs/ddos'),
          meta: { title: '操作记录' }
        },
        {
          path: 'accurateAccessControl',
          name: `${id}.router.logs__accurateAccessControl`,
          component: () => import('./page/logs/accurateAccessControl'),
          meta: { title: '操作记录' }
        }
      ]
    }
  ]
}
