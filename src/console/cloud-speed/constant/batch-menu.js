export default [
  {
    title: '域名节点调度',
    list: [
      'DomainNode',
      'ProtectedMode'
    ]
  },
  {
    title: '回源配置',
    list: [
      // TODO
      {
        title: '源站设置',
        desc: '指定回源地址和监听端口，支持回源到IP及域名',
        name: 'dialogSource'
      },
      // 'Source',
      'Slice',
      'BackSourceHost',
      'BackSourceSni',
      // {
      //   title: '回源HOST',
      //   desc: '自定义性能优化节点取源站数据时所需访问的 WEB 服务器域名',
      //   name: 'dialogRequestTime'
      // },
      {
        title: '回源请求时长',
        desc: '安全节点回源请求连接等待时长',
        name: 'dialogRequestTime'
      },
      {
        title: '回源健康检查',
        desc: '对于存在多个源IP，当安全节点在指定时间间隔内回源到某个源的失败次数超过指定次数时，将在指定时间内禁用此源IP',
        name: 'dialogHealthy'
      },
      {
        title: '回源保持长连接',
        desc: '回源使用连接保活可以复用现有的连接（需源服务器支持keepalive），避免每次请求都重新建立TCP请求，可大幅提升回源性能，减小延迟',
        name: 'dialogKeepLive'
      }
    ]
  },
  {
    title: '性能优化',
    list: [
      'CdnCache',
      'WebP',
      'Mobile',
      'Browser'
    ]
  },
  {
    title: '高级配置',
    list: [
      'Https',
      'WebSocket',
      'HttpHeader',
      'HttpSourceHeader',
      'Page500',
      'Page502',
      'Page404'
    ]
  },
  {
    title: '应用安全',
    list: [
      'CloudWaf',
      'WebHoney',
      'WafIntercept'
    ]
  },
  {
    title: '内容安全',
    list: [
      'WebSnapshot',
      'ContentReplace'
    ]
  },
  {
    title: '业务安全',
    list: [
      'DefenseRefer',
      'ZoneLimit',
      'DefenseCC',
      'SourceSafe'
    ]
  },
  {
    title: '精准访问控制',
    list: [
      'WAF'
    ]
  }
]
