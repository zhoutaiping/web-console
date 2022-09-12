import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./app'),
  name: `${id}.title`,
  children: [
    {
      path: `report/list`,
      name: `${id}.router.reportList`,
      component: () => import('./views/report/list')
    },
    {
      path: `task/list`,
      component: () => import('./views/task/list'),
      name: `${id}.router.taskList`
    }
  ]
}
