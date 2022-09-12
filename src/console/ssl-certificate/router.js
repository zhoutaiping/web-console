import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    {
      path: 'operateLog',
      name: `${id}.router.operateLog`,
      component: () => import('./views/operateLog'),
      hidden: true
    }
  ]
}
