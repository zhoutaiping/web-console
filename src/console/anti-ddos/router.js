import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    // 防御对象（业务管理）
    {
      path: 'defense',
      name: `${id}.router.defense`,
      component: () => import('./views/defense')
    },
    // 策略配置
    {
      path: 'settings/:id',
      name: `${id}.router.settings__id`,
      component: () => import('./views/settings/detail'),
      meta: { back: `${id}.router.settings` },
      redirect: {
        name: `${id}.router.settings__id__tcp`
      },
      children: [
        {
          path: 'tcp',
          name: `${id}.router.settings__id__tcp`,
          component: () => import('./views/settings/pages/tcp')
        },
        {
          path: 'udp',
          name: `${id}.router.settings__id__udp`,
          component: () => import('./views/settings/pages/udp')
        },
        {
          path: 'icmp',
          name: `${id}.router.settings__id__icmp`,
          component: () => import('./views/settings/pages/icmp')
        },
        {
          path: 'dns',
          name: `${id}.router.settings__id__dns`,
          component: () => import('./views/settings/pages/dns')
        },
        {
          path: 'other',
          name: `${id}.router.settings__id__other`,
          component: () => import('./views/settings/pages/other')
        },
        {
          path: 'bwlist',
          name: `${id}.router.settings__id__bwlist`,
          component: () => import('./views/settings/pages/bwlist')
        },
        {
          path: 'geo',
          name: `${id}.router.settings__id__geo`,
          component: () => import('./views/settings/pages/geo')
        },
        {
          path: 'threat',
          name: `${id}.router.settings__id__threat`,
          component: () => import('./views/settings/pages/threat')
        },
        {
          path: 'waf',
          name: `${id}.router.settings__id__waf`,
          component: () => import('./views/settings/pages/waf')
        }
      ]
    },
    // 集群管理
    {
      path: 'cluster',
      name: `${id}.router.cluster`,
      component: () => import('./views/cluster')
    },
    {
      path: 'cluster/:id',
      name: `${id}.router.cluster__device`,
      component: () => import('./views/device'),
      meta: { back: `${id}.router.cluster` }
    },
    // 模板配置
    {
      path: 'policy-template',
      name: `${id}.router.policyTemplate`,
      component: () => import('./views/policy-template')
    },
    // 抓包工具
    {
      path: 'pcap',
      name: `${id}.router.pcap`,
      component: () => import('./views/pcap')
    },
    // IP 黑白名单
    {
      path: 'bwlist',
      name: `${id}.router.bwlist`,
      component: () => import('./views/bwlist'),
      redirect: {
        name: `${id}.router.bwlistStatic`
      },
      children: [
        {
          path: 'static',
          name: `${id}.router.bwlistStatic`,
          component: () => import('./views/bwlist/pages/static')
        },
        {
          path: 'dynamic',
          name: `${id}.router.bwlistDynamic`,
          component: () => import('./views/bwlist/pages/dynamic')
        },
        {
          path: 'logs',
          name: `${id}.router.bwlistLogs`,
          component: () => import('./views/bwlist/pages/logs')
        }
      ]
    },
    // 实时监控
    {
      path: 'monitor',
      name: `${id}.router.monitor`,
      component: () => import('./views/monitor'),
      redirect: {
        name: `${id}.router.monitorAttack`
      },
      children: [
        {
          path: 'attack',
          name: `${id}.router.monitorAttack`,
          component: () => import('./views/monitor/pages/attack/index')
        },
        {
          path: 'cluster',
          name: `${id}.router.monitorCluster`,
          component: () => import('./views/monitor/pages/cluster')
        }
      ]
    },
    // 统计分析
    {
      path: 'statistics',
      name: `${id}.router.statistics`,
      component: () => import('./views/statistics'),
      redirect: {
        name: `${id}.router.statisticsAttack`
      },
      children: [
        {
          path: 'attack',
          name: `${id}.router.statisticsAttack`,
          component: () => import('./views/statistics/pages/attack')
        },
        {
          path: 'analyze',
          name: `${id}.router.statisticsAnalyze`,
          component: () => import('./views/statistics/pages/analyze')
        },
        {
          path: 'device',
          name: `${id}.router.statisticsDevice`,
          component: () => import('./views/statistics/pages/device')
        },
        {
          path: 'attackLog',
          name: `${id}.router.monitorAttackLog`,
          component: () => import('./views/monitor/pages/attack/log')
        },
        {
          path: 'attackLog/:id',
          name: `${id}.router.monitorAttackLog__Detail`,
          component: () => import('./views/monitor/pages/attack/Detail'),
          meta: { back: `${id}.router.monitorAttackLog` }
        }
      ]
    },

    // 日志管理
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
        }
      ]
    }
  ]
}
