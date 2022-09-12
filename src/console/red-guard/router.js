import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    // 安全概览
    {
      path: 'safetyOverview',
      name: `${id}.router.safetyOverview`,
      component: () => import('./views/safety-overview/index'),
      hidden: true
    },
    // 网站列表
    {
      path: 'websiteList',
      name: `${id}.router.websiteList`,
      component: () => import('./views/website-list/index'),
      hidden: true,
      meta: { rememberPage: true }
    },
    // 套餐列表
    {
      path: 'packageList',
      name: `${id}.router.packageList`,
      component: () => import('./views/package-list/index'),
      hidden: true
    },
    // 威胁分析
    {
      path: 'menaceAnalyze',
      name: `${id}.router.menaceAnalyze`,
      component: () => import('./views/menace-analyze'),
      hidden: true,
      redirect: {
        name: `${id}.router.menaceAnalyze__WAFAttack`
      },
      children: [
        {
          path: `WAFAttack`,
          name: `${id}.router.menaceAnalyze__WAFAttack`,
          component: () => import('./views/menace-analyze/tab/WAFAttack'),
          meta: { tabs: `${id}.router.menaceAnalyze` }
        },
        {
          path: `CCAttack`,
          name: `${id}.router.menaceAnalyze__CCAttack`,
          component: () => import('./views/menace-analyze/tab/CCAttack'),
          meta: { tabs: `${id}.router.menaceAnalyze` }
        },
        {
          path: `AccurateAccessControl`,
          name: `${id}.router.menaceAnalyze__AccurateAccessControl`,
          component: () =>
            import('./views/menace-analyze/tab/AccurateAccessControl'),
          meta: { tabs: `${id}.router.menaceAnalyze` }
        },
        {
          path: `menaceAnalyze/AccurateAccessControl/:id`,
          name: `${id}.router.menaceAnalyze__AccurateAccessControlId`,
          component: () =>
            import('./views/menace-analyze/tab/AccurateAccessControlShow'),
          meta: { title: '精准访问控制', tabs: `${id}.router.menaceAnalyze` }
        },
        {
          path: `Bot`,
          name: `${id}.router.menaceAnalyze__Bot`,
          component: () => import('./views/menace-analyze/tab/Bot'),
          meta: { tabs: `${id}.router.menaceAnalyze` }
        },
        {
          path: `Bot/KnowDetail/:id`,
          name: `${id}.router.menaceAnalyze__BotKnowDetailId`,
          component: () => import('./views/menace-analyze/tab/Bot/KnowDetail'),
          meta: { tabs: `${id}.router.menaceAnalyze` }
        },
        {
          path: `Bot/UnknowDetail/:id`,
          name: `${id}.router.menaceAnalyze__BotUnknowDetailIid`,
          component: () =>
            import('./views/menace-analyze/tab/Bot/UnknowDetail'),
          meta: { tabs: `${id}.router.menaceAnalyze` }
        }
      ]
    },
    // 任务列表
    {
      path: 'taskList',
      name: `${id}.router.taskList`,
      component: () => import('./views/task-list/index'),
      hidden: true
    },
    // 操作日志
    {
      path: 'operateLog',
      name: `${id}.router.operateLog`,
      component: () => import('./views/operate-log/index'),
      hidden: true,
      redirect: {
        name: `${id}.router.operateLogApplicationWall`
      },
      children: [
        {
          path: `operateLog/applicationWall`,
          component: () => import('./views/operate-log/applicationWall'),
          name: `${id}.router.operateLogApplicationWall`,
          meta: { tabs: `${id}.router.operateLog` }
        },
        {
          path: `operateLog/accurateAccessControl`,
          component: () => import('./views/operate-log/accurateAccessControl'),
          name: `${id}.router.operateLogAccurateAccessControl`,
          meta: { tabs: `${id}.router.operateLog` }
        }
      ]
    }
  ]
}
