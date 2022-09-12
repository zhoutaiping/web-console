import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    {
      path: 'basicinfo',
      name: `${id}.router.basicinfo`,
      component: () => import('./views/basics/index'),
      meta: { title: '基本资料' }
    },
    {
      path: 'authentication',
      name: `${id}.router.authentication`,
      component: () => import('./views/authentication/index'),
      meta: { title: '用户认证' }
    },
    {
      path: 'modify',
      name: `${id}.router.modify`,
      component: () => import('./views/modify/index'),
      meta: { title: '修改密码' }
    },
    {
      path: 'safeConfig',
      name: `${id}.router.safeConfig`,
      component: () => import('./views/safeConfig/index'),
      meta: { title: '安全设置' }
    },
    {
      path: 'ipList',
      name: `${id}.router.ipList`,
      component: () => import('./views/ipList/index'),
      meta: { title: 'IP列表' }
    },
    {
      path: 'logs',
      name: `${id}.router.logs`,
      component: () => import('./views/logs/index'),
      redirect: {
        name: `${id}.router.logs__login`
      },
      children: [
        {
          path: 'login',
          name: `${id}.router.logs__login`,
          component: () => import('./views/logs/login')
        },
        {
          path: 'operation',
          name: `${id}.router.logs__operation`,
          component: () => import('./views/logs/operation')
        }
      ]
    }
  ]
}
