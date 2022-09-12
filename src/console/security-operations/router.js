import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  redirect: {
    name: `${id}.router.scan__propertys`
  },
  name: `${id}.title`,
  children: [
    {
      path: 'propertys',
      name: `${id}.router.scan__propertys`,
      component: () => import('@/console/scan-plus/pages/propertys')
    },
    {
      path: 'settings',
      name: `${id}.router.scan__productSettings`,
      component: () => import('./pages/settings'),
      redirect: {
        name: `${id}.router.scan__productSettings__Notice`
      },
      children: [
        {
          path: 'notice',
          name: `${id}.router.scan__productSettings__Notice`,
          component: () => import('@/console/scan-plus/pages/settings')
        },
        {
          path: 'packages',
          name: `${id}.router.scan__productSettings__Packages`,
          component: () => import('@/console/scan-plus/pages/packages')
        }
      ]
    },
    {
      path: 'dashboard',
      name: `${id}.router.dashboard`,
      component: () => import('./pages/dashboard')
    },
    {
      path: 'propertys/:id',
      name: `${id}.router.scan__propertys__id`,
      hidden: true,
      component: () => import('@/console/scan-plus/pages/propertys/Detail'),
      meta: { title: '资产详情' },
      redirect: {
        name: `${id}.router.scan__propertys__id__service-info`
      },
      children: [
        {
          path: 'service-info',
          name: `${id}.router.scan__propertys__id__service-info`,
          component: () => import('@/console/scan-plus/pages/service-info'),
          meta: { title: '资产详情' }
        },
        {
          path: 'content-safe-event',
          name: `${id}.router.scan__propertys__id__content-safe-event`,
          component: () => import('@/console/scan-plus/pages/content-safe/Event'),
          meta: { title: '资产详情' }
        },
        {
          path: 'usability-monitor',
          name: `${id}.router.scan__propertys__id__usability-monitor`,
          component: () => import('@/console/scan-plus/pages/usability-monitor/List'),
          meta: { title: '资产详情' }
        },
        {
          path: 'dns-monitor-event',
          name: `${id}.router.scan__propertys__id__dns-monitor-event`,
          component: () =>
        import('@/console/scan-plus/pages/dns-monitor/components/CardTableEvents'),
          meta: { title: '资产详情' }
        },
        {
          path: 'dns-monitor',
          name: `${id}.router.scan__propertys__id__dns-monitor`,
          component: () => import('@/console/scan-plus/pages/dns-monitor/List'),
          meta: { title: '资产详情' }
        },
        {
          path: 'usability-monitor-event',
          name: `${id}.router.scan__propertys__id__usability-monitor-event`,
          component: () => import('@/console/scan-plus/pages/usability-monitor/Event'),
          meta: { title: '资产详情' }
        },

        {
          path: 'scan-web-setting',
          name: `${id}.router.scan__propertys__id__scan-web-setting`,
          component: () => import('@/console/scan-plus/pages/scan-web/Setting'),
          meta: { title: '资产详情' }
        }
      ]
    },
    {
      path: 'activePrevention',
      name: `${id}.router.scan__activePrevention`,
      component: () => import('./pages/ActivePrevention'),
      redirect: {
        name: `${id}.router.scan__scanWeb`
      },
      children: [
        // Web漏洞扫描
        {
          path: 'scan-web',
          name: `${id}.router.scan__scanWeb`,
          component: () => import('@/console/scan-plus/pages/scan-web'),
          redirect: {
            name: `${id}.router.scan__scanWeb__service-info`
          },
          children: [
            {
              path: 'service-info',
              name: `${id}.router.scan__scanWeb__service-info`,
              component: () => import('@/console/scan-plus/pages/service-info')
            },
            {
              path: 'list',
              name: `${id}.router.scan__scanWeb__list`,
              component: () => import('@/console/scan-plus/pages/scan-web/List')
            },
            {
              path: 'setting',
              name: `${id}.router.scan__scanWeb__setting`,
              component: () => import('@/console/scan-plus/pages/scan-web/Setting')
            }
          ]
        }
      ]
    },
    {
      path: 'threatMonitoring',
      name: `${id}.router.scan__threatMonitoring`,
      component: () => import('./pages/ThreatMonitoring'),
      redirect: {
        name: `${id}.router.scan__contentSafe`
      },
      children: [
        // 内容安全
        {
          path: 'content-safe',
          name: `${id}.router.scan__contentSafe`,
          component: () => import('@/console/scan-plus/pages/content-safe'),
          redirect: {
            name: `${id}.router.scan__contentSafe__list`
          },
          children: [
            {
              path: 'list',
              name: `${id}.router.scan__contentSafe__list`,
              component: () => import('@/console/scan-plus/pages/content-safe/List')
            },
            {
              path: 'console/:id',
              name: `${id}.router.scan__contentSafe__console__id`,
              component: () => import('@/console/scan-plus/pages/content-safe/console/index'),
              meta: { back: `${id}.router.scan__contentSafe__list` }
            },
            {
              path: 'event',
              name: `${id}.router.scan__contentSafe__event`,
              component: () => import('@/console/scan-plus/pages/content-safe/Event')
            }
          ]
        },
        // 可用性监测
        {
          path: 'usability-monitor',
          name: `${id}.router.scan__usabilityMonitor`,
          component: () => import('@/console/scan-plus/pages/usability-monitor'),
          redirect: {
            name: `${id}.router.scan__usabilityMonitor__list`
          },
          children: [
            {
              path: 'usability-monitor/list',
              name: `${id}.router.scan__usabilityMonitor__list`,
              component: () => import('@/console/scan-plus/pages/usability-monitor/List')
            },
            {
              path: 'usability-monitor/event',
              name: `${id}.router.scan__usabilityMonitor__event`,
              component: () => import('@/console/scan-plus/pages/usability-monitor/Event')
            },
            {
              path: 'usability-monitor/detail/:id',
              name: `${id}.router.scan__usabilityMonitor__detail__id`,
              component: () => import('@/console/scan-plus/pages/usability-monitor/Detail'),
              meta: { back: `${id}.router.usability-monitor__list` }
            }
          ]
        },
        {
          path: 'dns-monitor',
          name: `${id}.router.scan__dnsMointor`,
          component: () => import('@/console/scan-plus/pages/dns-monitor'),
          meta: { title: 'DNS劫持监控' },
          redirect: {
            name: `${id}.router.scan__dnsMointor__list`
          },
          children: [
            {
              path: 'list',
              component: () => import('@/console/scan-plus/pages/dns-monitor/List'),
              name: `${id}.router.scan__dnsMointor__list`,
              meta: { title: 'DNS劫持监控' }
            },
            {
              path: 'report',
              component: () => import('@/console/scan-plus/pages/dns-monitor/Report'),
              name: `${id}.router.scan__dnsMointor__list__report`,
              meta: { title: 'DNS劫持监控' }
            }
          ]
        }
      ]
    },
    {
      path: 'securityManagement',
      name: `${id}.router.scan__securityManagement`,
      component: () => import('./pages/SecurityManagement'),
      redirect: {
        name: `${id}.router.serviceReport`
      },
      children: [
        {
          path: 'service-report',
          name: `${id}.router.serviceReport`,
          component: () => import('./pages/ServiceReport'),
          redirect: {
            name: `${id}.router.serviceReport__reportList`
          },
          children: [
            {
              path: `report/list`,
              name: `${id}.router.serviceReport__reportList`,
              component: () => import('@/console/service-report/views/report/list')
            },
            {
              path: `task/list`,
              component: () => import('@/console/service-report/views/task/list'),
              name: `${id}.router.serviceReport__taskList`
            }
          ]
        },
        {
          path: 'logs',
          name: `${id}.router.logs`,
          component: () => import('@/console/logs/pages/Manage/index'),
          redirect: {
            name: `${id}.router.logs__download`
          },
          children: [
            {
              path: 'download',
              name: `${id}.router.logs__download`,
              component: () => import('@/console/logs/pages/Download/index')
            },
            {
              path: 'template',
              name: `${id}.router.logs__template`,
              component: () => import('@/console/logs/pages/Template/index')
            }
          ]
        },
        {
          path: 'ip-list',
          name: `${id}.router.ipList`,
          component: () => import('@/console/user-center/views/ipList')
        }
      ]
    }
  ]
}
