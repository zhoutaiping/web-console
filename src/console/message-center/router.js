import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  name: `${id}.title`,
  component: () => import('./app'),
  children: [
    {
      path: 'MessageList',
      name: `${id}.router.MessageList`,
      component: () => import('./views/MessageList/MessageList'),
      meta: { title: '消息列表' }
    },
    {
      path: 'MessageList/detail/:id',
      name: `${id}.router.MessageList__id`,
      hidden: true,
      component: () => import('./views/MessageList/Components/detail'),
      meta: { title: '消息详情', back: `${id}.router.MessageList` }
    },
    {
      path: 'NoticeConfig',
      name: `${id}.router.NoticeConfig`,
      component: () => import('./views/MessageList/NoticeConfig'),
      meta: { title: '消息通知设置' }
    },
    {
      path: 'PersonManage',
      name: `${id}.router.PersonManage`,
      component: () => import('./views/MessageList/PersonManage'),
      meta: { title: '消息接收人管理' }
    }
  ]
}
