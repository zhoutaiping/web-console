import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    {
      path: 'dashboard',
      name: `${id}.router.dashboard`,
      component: () => import('./pages/dashboard')
    },
    {
      path: 'settings',
      name: `${id}.router.settings`,
      component: () => import('./pages/settings')
    },
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
    // 资产列表
    {
      path: 'propertys',
      name: `${id}.router.propertys`,
      component: () => import('./pages/propertys')
    },
    {
      path: 'propertys/:id',
      name: `${id}.router.propertys__id`,
      hidden: true,
      component: () => import('./pages/propertys/Detail'),
      meta: { title: '资产详情' },
      redirect: {
        name: `${id}.router.propertys__id__content-safe-event`
      },
      children: [
        {
          path: 'content-safe-event',
          name: `${id}.router.propertys__id__content-safe-event`,
          component: () => import('./pages/content-safe/Event'),
          meta: { title: '资产详情' }
        },
        {
          path: 'usability-monitor',
          name: `${id}.router.propertys__id__usability-monitor`,
          component: () => import('./pages/usability-monitor/List'),
          meta: { title: '资产详情' }
        },
        {
          path: 'dns-monitor-event',
          name: `${id}.router.propertys__id__dns-monitor-event`,
          component: () =>
            import('./pages/dns-monitor/components/CardTableEvents'),
          meta: { title: '资产详情' }
        },
        {
          path: 'dns-monitor',
          name: `${id}.router.propertys__id__dns-monitor`,
          component: () => import('./pages/dns-monitor/List'),
          meta: { title: '资产详情' }
        },
        {
          path: 'usability-monitor-event',
          name: `${id}.router.propertys__id__usability-monitor-event`,
          component: () => import('./pages/usability-monitor/Event'),
          meta: { title: '资产详情' }
        },

        {
          path: 'scan-web-setting',
          name: `${id}.router.propertys__id__scan-web-setting`,
          component: () => import('./pages/scan-web/Setting'),
          meta: { title: '资产详情' }
        }
      ]
    },
    // 内容安全
    {
      path: 'content-safe',
      name: `${id}.router.content-safe`,
      component: () => import('./pages/content-safe'),
      redirect: {
        name: `${id}.router.content-safe__list`
      },
      children: [
        {
          path: 'list',
          name: `${id}.router.content-safe__list`,
          component: () => import('./pages/content-safe/List'),
          meta: { title: '控制台' }
        },
        {
          path: 'console/:id',
          name: `${id}.router.content-safe__console__id`,
          component: () => import('./pages/content-safe/console/index'),
          meta: { title: '控制台', back: `${id}.router.content-safe__list` }
        },
        {
          path: 'event',
          name: `${id}.router.content-safe__event`,
          component: () => import('./pages/content-safe/Event'),
          meta: { title: '控制台' }
        }
      ]
    },
    // 可用性监测
    {
      path: 'usability-monitor',
      name: `${id}.router.usability-monitor`,
      component: () => import('./pages/usability-monitor'),
      meta: { title: '可用性监测' },
      redirect: {
        name: `${id}.router.usability-monitor__list`
      },
      children: [
        {
          path: 'usability-monitor/list',
          name: `${id}.router.usability-monitor__list`,
          component: () => import('./pages/usability-monitor/List'),
          meta: { title: '控制台' }
        },
        {
          path: 'usability-monitor/event',
          name: `${id}.router.usability-monitor__event`,
          component: () => import('./pages/usability-monitor/Event'),
          meta: { title: '控制台' }
        },
        {
          path: 'usability-monitor/detail/:id',
          name: `${id}.router.usability-monitor__detail__id`,
          component: () => import('./pages/usability-monitor/Detail'),
          meta: { title: '控制台', back: `${id}.router.usability-monitor__list` }
        }
      ]
    },
    // {
    //   path: 'dns-monitor',
    //   name: `${id}.router.dns-monitor`,
    //   component: () => import('./pages/dns-monitor'),
    //   meta: { title: 'DNS劫持监控' },
    //   redirect: {
    //     name: `${id}.router.dns-monitor__list`
    //   },
    //   children: [
    //     {
    //       path: 'list',
    //       component: () => import('./pages/dns-monitor/List'),
    //       name: `${id}.router.dns-monitor__list`,
    //       meta: { title: 'DNS劫持监控' }
    //     },
    //     {
    //       path: 'report',
    //       component: () => import('./pages/dns-monitor/Report'),
    //       name: `${id}.router.dns-monitor__report`,
    //       meta: { title: 'DNS劫持监控' }
    //     }
    //   ]
    // },
    // Web漏洞扫描
    {
      path: 'scan-web',
      name: `${id}.router.scan-web`,
      component: () => import('./pages/scan-web'),
      meta: { title: 'Web漏洞扫描' },
      redirect: {
        name: `${id}.router.scan-web__list`
      },
      children: [
        {
          path: 'scan-web/list',
          name: `${id}.router.scan-web__list`,
          component: () => import('./pages/scan-web/List'),
          meta: { title: '控制台' }
        },
        {
          path: 'scan-web/setting',
          name: `${id}.router.scan-web__setting`,
          component: () => import('./pages/scan-web/Setting'),
          meta: { title: '控制台' }
        }
      ]
    },
    // {
    //   path: 'operate-log',
    //   name: `${id}.router.operate-log`,
    //   component: () => import('./pages/operate-log'),
    //   meta: { title: '操作记录' }
    // },
    {
      path: 'packages',
      name: `${id}.router.packages`,
      component: () => import('./pages/packages')
    },
    {
      path: 'ipList',
      name: `${id}.router.ipList`,
      component: () => import('@/console/user-center/views/ipList/index')
    }
  ]
}
