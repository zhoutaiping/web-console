import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    {
      path: 'businessList',
      name: `${id}.router.businessList`,
      component: () => import('./views/business-list/index'),
      hidden: true,
      redirect: {
        name: `${id}.router.websiteList`
      },
      children: [
        {
          path: 'websiteList',
          name: `${id}.router.websiteList`,
          component: () => import('./views/website-list/index'),
          meta: { rememberPage: true }
        },
        {
          path: 'websiteGroup',
          name: `${id}.router.businessList__websiteGroup`,
          component: () => import('./views/website-group/index')
        }
      ]
    },
    {
      path: `batch-add`,
      name: `${id}.router.batch-add`,
      component: () => import('./views/website-list/pages/batch-add'),
      hidden: true
    },
    {
      path: `batch-delete`,
      name: `${id}.router.batch-delete`,
      component: () => import('./views/website-list/pages/batch-delete'),
      hidden: true
    },
    {
      path: 'websiteList/batch-setting',
      name: `${id}.router.websiteList__batch-setting`,
      hidden: true,
      component: () => import('./views/website-list/pages/batch-setting')
    },
    // 控制台
    {
      path: 'websiteList/console/:id',
      name: `${id}.router.websiteList__console__id`,
      hidden: true,
      component: () => import('./views/website-list/console/index'),
      redirect: {
        name: `${id}.router.websiteList__console__backsource`
      },
      children: [
        {
          path: 'backsource',
          name: `${id}.router.websiteList__console__backsource`,
          component: () =>
            import('./views/website-list/console/console-tab-backsource/index'),
          meta: { back: `${id}.router.websiteList` }
        },
        {
          path: 'perform',
          name: `${id}.router.websiteList__console__perform`,
          component: () =>
            import('./views/website-list/console/console-tab-perform/index'),
          meta: { back: `${id}.router.websiteList` }
        },
        {
          path: 'pages',
          name: `${id}.router.websiteList__console__pages`,
          component: () =>
            import('./views/website-list/console/console-tab-pages/index'),
          meta: { back: `${id}.router.websiteList` }
        },
        {
          path: `applicationSecurity`,
          name: `${id}.router.websiteList__applicationSecurity`,
          component: () =>
            import('./views/website-list/console/ApplicationSecurity/index'),
          meta: { title: '应用安全', back: `${id}.router.websiteList` }
        },
        {
          path: `contentSecurity`,
          name: `${id}.router.websiteList__contentSecurity`,
          component: () =>
            import('./views/website-list/console/ContentSecurity/index'),
          meta: { title: '内容安全', back: `${id}.router.websiteList` }
        },
        {
          path: `businessSecurity`,
          name: `${id}.router.websiteList__businessSecurity`,
          component: () =>
            import('./views/website-list/console/BusinessSecurity/index'),
          meta: { title: '业务安全', back: `${id}.router.websiteList` }
        },
        {
          path: `waf`,
          name: `${id}.router.websiteList__waf`,
          component: () => import('./views/website-list/console/Waf/index'),
          meta: { title: '精准访问控制', back: `${id}.router.websiteList` }
        },
        {
          path: `waf/:groupId`,
          name: `${id}.router.websiteList__wafDetail`,
          component: () => import('./views/website-list/console/Waf/Detail'),
          meta: { title: '精准访问控制' }
        },
        {
          path: `networkSecurity`,
          name: `${id}.router.websiteList__networkSecurity`,
          component: () => import('./views/website-list/console/NetworkSecurity/index'),
          meta: { title: '网络安全', back: `${id}.router.websiteList` }
        }
      ]
    },
    // 统计报表
    {
      path: 'statisticsReport',
      name: `${id}.router.statisticsReport`,
      component: () => import('./views/statistics-report/index'),
      redirect: {
        name: `${id}.router.statisticsReport__wideFlowRange`
      },
      children: [
        {
          // name: '流量带宽',
          path: 'wideFlowRange',
          name: `${id}.router.statisticsReport__wideFlowRange`,
          component: () => import('./views/statistics-report/tab-wide-flow-range')
        },
        {
          // name: '访问分析',
          path: 'accessAnalysis',
          name: `${id}.router.statisticsReport__accessAnalysis`,
          component: () => import('./views/statistics-report/tab-access-analysis')
        },
        {
          // name: '请求分布',
          path: 'distributionRequest',
          name: `${id}.router.statisticsReport__distributionRequest`,
          component: () => import('./views/statistics-report/tab-distribution-request')
        },
        {
          // name: '状态码分析',
          path: 'statusCodeAnalysis',
          name: `${id}.router.statisticsReport__statusCodeAnalysis`,
          component: () => import('./views/statistics-report/tab-status-code-analysis')
        },
        {
          // name: '热点分析',
          path: 'hotspotAnalysis',
          name: `${id}.router.statisticsReport__hotspotAnalysis`,
          component: () => import('./views/statistics-report/tab-hotspot-analysis')
        },
        // red-guard
        {
          path: `WAFAttack`,
          name: `${id}.router.menaceAnalyze__WAFAttack`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/WAFAttack')
        },
        {
          path: `WAFAttack/ScanDetail`,
          name: `${id}.router.menaceAnalyze__WAFAttack_ScanDetail`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/components/ScanDetail'),
          meta: { back: `${id}.router.menaceAnalyze__WAFAttack` }
        },
        {
          path: `WAFAttack/WAFAttackDetail`,
          name: `${id}.router.menaceAnalyze__WAFAttack_WAFAttackDetail`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/components/WAFAttackDetail'),
          meta: { back: `${id}.router.menaceAnalyze__WAFAttack` }
        },
        {
          path: `WAFAttack/WebShellDetail`,
          name: `${id}.router.menaceAnalyze__WAFAttack_WebShellDetail`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/components/WebShellDetail'),
          meta: { back: `${id}.router.menaceAnalyze__WAFAttack` }
        },
        {
          path: `CCAttack`,
          name: `${id}.router.menaceAnalyze__CCAttack`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/CCAttack')
        },
        {
          path: `CCAttack/CCAttackEventDetail`,
          name: `${id}.router.menaceAnalyze__CCAttackEventDetail`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/CCAttackEventDetail'),
          meta: { back: `${id}.router.menaceAnalyze__CCAttack` }
        },
        {
          path: `AccurateAccessControl`,
          name: `${id}.router.menaceAnalyze__AccurateAccessControl`,
          component: () =>
            import('@/console/red-guard/views/menace-analyze/tab/AccurateAccessControl')
        },
        {
          path: `menaceAnalyze/AccurateAccessControl/:id`,
          name: `${id}.router.menaceAnalyze__AccurateAccessControlId`,
          component: () =>
            import('@/console/red-guard/views/menace-analyze/tab/AccurateAccessControlShow'),
          meta: { title: '精准访问控制', tabs: `${id}.router.menaceAnalyze` }
        },
        {
          path: `Bot`,
          name: `${id}.router.menaceAnalyze__Bot`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/Bot')
        },
        {
          path: `Bot/KnowDetail/:id`,
          name: `${id}.router.menaceAnalyze__BotKnowDetailId`,
          component: () => import('@/console/red-guard/views/menace-analyze/tab/Bot/KnowDetail')
        },
        {
          path: `Bot/UnknowDetail/:id`,
          name: `${id}.router.menaceAnalyze__BotUnknowDetailIid`,
          component: () =>
            import('@/console/red-guard/views/menace-analyze/tab/Bot/UnknowDetail')
        }
      ]
    },
    {
      path: 'websiteGroup',
      name: `${id}.router.websiteGroup`,
      hidden: true,
      component: () => import('./views/website-group/index')
    },
    {
      path: 'preUpdate',
      name: `${id}.router.preUpdate`,
      component: () => import('./views/pre-update/index'),
      hidden: true,
      redirect: {
        name: `${id}.router.cleanCache`
      },
      children: [
        {
          path: 'cleanCache',
          name: `${id}.router.cleanCache`,
          component: () => import('./views/clean-cache/index')
        },
        {
          path: 'cachePreheat',
          name: `${id}.router.cachePreheat`,
          component: () => import('./views/cache-preheat')
        }
      ]
    },
    {
      path: 'taskList',
      name: `${id}.router.taskList`,
      component: () => import('./views/task-list/index'),
      redirect: {
        name: `${id}.router.taskList__operateLogBatch`
      },
      children: [
        {
          path: 'operateLogBatch',
          name: `${id}.router.taskList__operateLogBatch`,
          component: () => import('./views/task-list/batch')
        },
        {
          path: 'operateLogBatchDetail',
          name: `${id}.router.taskList__operateLogBatch__Detail`,
          component: () => import('./views/task-list/detail'),
          meta: { back: `${id}.router.taskList__operateLogBatch` }
        },
        {
          path: 'cleanCacheLog',
          name: `${id}.router.taskList__cleanCacheLog`,
          component: () => import('./views/clean-cache-log/index')
        },
        {
          path: 'cleanCacheLogDetail',
          name: `${id}.router.taskList__cleanCacheLog__Detail`,
          hidden: true,
          component: () => import('./views/clean-cache-log/detail'),
          meta: { back: `${id}.router.taskList__cleanCacheLog` }
        },
        {
          path: 'cachePreheatLog',
          name: `${id}.router.taskList__cachePreheatLog`,
          component: () => import('./views/cache-preheat-log/index')
        },
        {
          path: 'cachePreheatLogDetail',
          name: `${id}.router.taskList__cachePreheatLog__Detail`,
          hidden: true,
          component: () => import('./views/cache-preheat-log/detail'),
          meta: { back: `${id}.router.taskList__cachePreheatLog` }
        }
      ]
    },
    {
      path: 'operateLog',
      name: `${id}.router.operateLog`,
      component: () => import('./views/operate-log/index'),
      redirect: {
        name: `${id}.router.operateLog__list`
      },
      children: [
        {
          path: 'list',
          name: `${id}.router.operateLog__list`,
          component: () => import('./views/operate-log/list')
        },
        {
          path: 'batch',
          name: `${id}.router.operateLog__batch`,
          component: () => import('./views/operate-log/batch')
        }
      ]
    },
    {
      path: 'certificateList',
      name: `${id}.router.certificateList`,
      component: () => import('./views/certificateList'),
      hidden: true
    },
    // 配置模板
    {
      path: 'configTemplates',
      name: `${id}.router.configTemplates`,
      component: () => import('./views/config-templates/index'),
      hidden: true
    },
    {
      path: `configTemplates/create`,
      name: `${id}.router.configTemplates__create`,
      component: () => import('./views/config-templates/Detail'),
      hidden: true
    },
    {
      path: `configTemplates/edit/:id`,
      name: `${id}.router.configTemplates__edit__id`,
      component: () => import('./views/config-templates/Detail'),
      hidden: true
    }
  ]
}
