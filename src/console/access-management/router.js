import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    {
      path: 'overview',
      name: `${id}.router.overview`,
      component: () => import('./pages/overview'),
      meta: { title: '概览' }
    },
    {
      path: 'accounts',
      name: `${id}.router.accounts`,
      component: () => import('./pages/accounts/index'),
      meta: { title: '账号管理' }
    },
    {
      path: 'accounts/:id',
      name: `${id}.router.accounts__id`,
      component: () => import('./pages/accounts/Detail'),
      meta: { title: '账号详情', back: `${id}.router.accounts` },
      hidden: true
    },
    {
      path: 'groups',
      name: `${id}.router.groups`,
      component: () => import('./pages/groups/index'),
      meta: { title: '组织管理' }
    },
    {
      path: 'groups/:id',
      name: `${id}.router.groups__id`,
      component: () => import('./pages/groups/Detail'),
      hidden: true,
      meta: { title: '组织详情' }
    },
    {
      path: 'groups/setting/:id',
      name: `${id}.router.setting__id`,
      component: () => import('./pages/groups/Setting'),
      hidden: true,
      meta: { title: '权限配置' }
    },
    {
      path: 'privileges',
      name: `${id}.router.privileges`,
      component: () => import('./pages/privileges/index'),
      redirect: {
        name: `${id}.router.privileges__system`
      },
      meta: { title: '策略管理' },
      children: [
        {
          path: 'system',
          name: `${id}.router.privileges__system`,
          component: () => import('./pages/privileges/system')
        },
        {
          path: 'custom',
          name: `${id}.router.privileges__custom`,
          component: () => import('./pages/privileges/custom')
        }
      ]
    },
    {
      path: 'privileges/system/:id',
      name: `${id}.router.privileges__system__id`,
      hidden: true,
      component: () => import('./pages/privileges/Detail/indexSystem'),
      redirect: {
        name: `${id}.router.privileges__system__id__permission`
      },
      meta: {
        back: `${id}.router.privileges__system`
      },
      children: [
        {
          path: 'permission',
          name: `${id}.router.privileges__system__id__permission`,
          component: () => import('./pages/privileges/Detail/Permission'),
          meta: { back: `${id}.router.privileges__system` }
        }
      ]
    },
    {
      path: 'privileges/custom/:id',
      name: `${id}.router.privileges__custom__id`,
      hidden: true,
      component: () => import('./pages/privileges/Detail'),
      redirect: {
        name: `${id}.router.privileges__custom__id__manage`
      },
      children: [
        {
          path: 'manage',
          name: `${id}.router.privileges__custom__id__manage`,
          component: () => import('./pages/privileges/Detail/Manage')
        },
        {
          path: 'permission',
          name: `${id}.router.privileges__custom__id__permission`,
          component: () => import('./pages/privileges/Detail/Permission')
        }
      ]
    }
  ]
}
