import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  name: `${id}.title`,
  component: () => import('./app'),
  children: [
    {
      path: 'manage',
      name: `${id}.router.manage`,
      component: () => import('./pages/Manage/index'),
      redirect: {
        name: `${id}.router.download`
      },
      children: [
        {
          path: 'download',
          name: `${id}.router.download`,
          component: () => import('./pages/Download/index')
        },
        {
          path: 'template',
          name: `${id}.router.template`,
          component: () => import('./pages/Template/index')
        }
      ]
    }
  ]
}
