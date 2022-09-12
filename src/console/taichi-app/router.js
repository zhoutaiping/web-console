import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./App'),
  name: `${id}.title`,
  children: [
    // 套餐列表
    {
      path: 'meal',
      name: `${id}.router.meal`,
      component: () => import('./views/MealList/index')
    },
    // 业务列表
    {
      path: 'business/:id',
      name: `${id}.router.business__id`,
      hidden: true,
      component: () => import('./views/Business/Detail'),
      redirect: {
        name: `${id}.router.business__id__applicationAcceleration`
      },
      meta: { title: '控制台' },
      children: [
        {
          path: 'applicationSecurity',
          name: `${id}.router.business__id__applicationSecurity`,
          component: () => import('./views/Business/ApplicationSecurity/index'),
          meta: { title: '控制台', back: `${id}.router.meal` }
        },
        {
          path: 'applicationAcceleration',
          name: `${id}.router.business__id__applicationAcceleration`,
          component: () => import('./views/Business/ApplicationAcceleration'),
          meta: { title: '控制台', back: `${id}.router.meal` }
        },
        {
          path: 'businessSecurity',
          name: `${id}.router.business__id__BusinessSecurity`,
          component: () => import('./views/Business/BusinessSecurity'),
          meta: { title: '控制台', back: `${id}.router.meal` }
        },
        {
          path: 'networkSecurity',
          name: `${id}.router.business__id__NetworkSecurity`,
          component: () => import('./views/Business/NetworkSecurity'),
          meta: { title: '控制台', back: `${id}.router.meal` }
        }
      ]
    },
    {
      path: 'meal/:id',
      name: `${id}.router.meal__id`,
      hidden: true,
      component: () => import('./views/MealList/Detail'),
      meta: { title: '管理', back: `${id}.router.meal` }
    },
    {
      path: 'report',
      name: `${id}.router.report`,
      component: () => import('./views/Report/index'),
      redirect: {
        name: `${id}.router.report__cc`
      },
      children: [
        {
          path: 'cc',
          name: `${id}.router.report__cc`,
          component: () => import('./views/Report/CC'),
          meta: { title: 'CC攻击统计' }
        },
        {
          path: 'visit',
          name: `${id}.router.report__visit`,
          component: () => import('./views/Report/Visit'),
          meta: { title: '访问分析' }
        },
        {
          path: 'waf',
          name: `${id}.router.report__waf`,
          component: () => import('./views/Report/Waf/index'),
          meta: { title: '业务安全分析' }
        },
        {
          path: 'waf/:id',
          name: `${id}.router.report__waf__id`,
          component: () => import('./views/Report/Waf/Detail'),
          meta: { title: '业务安全分析' }
        }
      ]
    },
    {
      path: 'explorer/:id',
      name: `${id}.router.explorer`,
      component: () => import('./views/Explorer/index'),
      redirect: {
        name: `${id}.router.explorer__manage`
      },
      children: [
        {
          path: 'manage',
          name: `${id}.router.explorer__manage`,
          component: () => import('./views/Explorer/Manage')
        },
        {
          path: 'logs',
          name: `${id}.router.explorer__logs`,
          component: () => import('./views/Explorer/Logs')
        }
      ]
    },
    {
      path: 'logs',
      name: `${id}.router.logs`,
      component: () => import('./views/Logs/index'),
      // redirect: {
      //   name: `${id}.router.logs__sdk`
      // },
      children: [
        {
          path: 'sdk',
          name: `${id}.router.logs__sdk`,
          component: () => import('./views/Logs/sdk'),
          meta: { tabs: `${id}.router.logs` }
        },
        {
          path: 'accurateAccessControl',
          name: `${id}.router.logs__accurateAccessControl`,
          component: () => import('./views/Logs/accurateAccessControl'),
          meta: { tabs: `${id}.router.logs`, title: '精准访问控制' }
        }
      ]
    }
  ]
}
