import config from './config'
const { baseUrl } = config

export default {
  path: baseUrl,
  name: 'home.title',
  icon: 'ya-yunjiexi',
  component: () => import('./app'),
  children: [
    {
      path: '/',
      name: 'home.router.home',
      meta: { permission: ['products'] },
      component: () => import('./pages/home/index')
    },
    {
      path: 'access',
      name: 'home.router.access',
      meta: { permission: ['products'] },
      component: () => import('./pages/access')
    }
  ]
}
