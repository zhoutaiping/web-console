import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    {
      path: 'domainList',
      name: `${id}.router.domainList`,
      component: () => import('./views/domain-list/index'),
      hidden: true,
      meta: { title: '域名列表', permission: [`${id}.domainList`], rememberPage: true }
    },
    {
      name: `${id}.router.domainList__console__record`,
      path: 'domainList/console/:id/:member_id/record',
      hidden: true,
      component: () => import('./views/domain-list/console'),
      meta: { title: '控制台', back: `${id}.router.domainList` }
    },
    {
      name: `${id}.router.domainList__batch-domain-save`,
      path: 'domainList/batch-domain-save',
      hidden: true,
      component: () => import('./views/domain-list/batch-domain-save'),
      meta: { title: '批量添加域名' }
    },
    {
      name: `${id}.router.domainList__batch-record-save`,
      path: 'domainList/batch-record-save',
      hidden: true,
      component: () => import('./views/domain-list/console/batch'),
      meta: { title: '批量添加记录' }
    },
    {
      name: `${id}.router.domainList__importLog`,
      path: 'domainList/importLog',
      hidden: true,
      component: () => import('./views/domain-list/importLog'),
      meta: { title: '导入记录' }
    },
    {
      path: 'domainList/statistics',
      name: `${id}.router.domainList__statistics__resolvingDomain`,
      hidden: true,
      component: () => import('./views/domain-list/statistics'),
      meta: { title: '统计', back: `${id}.router.domainList` }
    },
    {
      path: 'mealList',
      name: `${id}.router.mealList`,
      component: () => import('./views/meal/index'),
      hidden: true,
      meta: { title: '套餐列表', rememberPage: true }
    },
    {
      path: 'domainGroup',
      name: `${id}.router.domainGroup`,
      component: () => import('./views/website-group/index'),
      hidden: true,
      meta: { title: '分组管理' }
    },
    {
      path: 'jobList',
      name: `${id}.router.jobList`,
      component: () => import('./views/job-list/index'),
      hidden: true,
      meta: { title: '任务列表' }
    },
    {
      path: 'jobList/detail-list',
      name: `${id}.router.jobList__detail-list`,
      hidden: true,
      component: () => import('./views/job-list/detail'),
      meta: { title: '任务详情', back: `${id}.router.jobList` }
    },
    {
      path: `${baseUrl}/operateLog`,
      name: `${id}.router.operateLog`,
      component: () => import('./views/operate-log/index'),
      hidden: true,
      meta: { title: '操作记录' }
    }
  ]
}
